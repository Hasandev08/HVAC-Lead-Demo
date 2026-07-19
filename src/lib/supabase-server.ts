import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Supabase client for Server Components and Route Handlers, backed by cookies.
 *
 * Why cookies rather than the default localStorage client: `proxy.ts` runs on
 * the edge before rendering and can only read cookies, so a localStorage session
 * would be invisible to it and the route guard could never see a logged-in user.
 */
export async function supabaseServer(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components can't set cookies. Harmless here: the proxy
          // refreshes the session on every request, so the write isn't lost.
        }
      },
    },
  });
}

/**
 * The authorization check for the whole dashboard.
 *
 * Two conditions, both required:
 *   1. A valid session (getUser() re-validates the JWT against Supabase —
 *      getSession() only reads the cookie and can be spoofed).
 *   2. That user's email is in the `owners` allowlist.
 *
 * Condition 2 is not redundant. Supabase permits self-signup with the anon key,
 * which ships in the browser bundle, so "has a session" says nothing about who
 * someone is. RLS enforces the same rule at the database level; this is the
 * matching check at the app level so we can redirect instead of showing an
 * empty page.
 */
export async function requireOwner(): Promise<
  { ok: true; email: string } | { ok: false; reason: "no-config" | "no-session" | "not-owner" }
> {
  const db = await supabaseServer();
  if (!db) return { ok: false, reason: "no-config" };

  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user?.email) return { ok: false, reason: "no-session" };

  // `await` is load-bearing: without it this is a Promise, always truthy, and
  // every logged-in user passes the owner check.
  return (await isOwnerEmail(user.email))
    ? { ok: true, email: user.email }
    : { ok: false, reason: "not-owner" };
}

/**
 * Is this email on the allowlist?
 *
 * Uses the SERVICE-ROLE client on purpose. The `owners` table has no RLS
 * policies at all, so a logged-in user's own client cannot read it — checking
 * with the anon client silently returns nothing and locks out even the real
 * owner. Service role bypasses RLS, and this only ever runs server-side.
 */
export async function isOwnerEmail(email: string): Promise<boolean> {
  const admin = supabaseAdmin();
  if (!admin) return false;

  const { data } = await admin
    .from("owners")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  return Boolean(data);
}
