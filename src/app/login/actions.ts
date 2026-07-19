"use server";

import { redirect } from "next/navigation";
import { isOwnerEmail, supabaseServer } from "@/lib/supabase-server";

export type LoginState = { error: string | null };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const db = await supabaseServer();
  if (!db) {
    return { error: "Supabase isn't configured. Check .env.local." };
  }

  const { data, error } = await db.auth.signInWithPassword({ email, password });

  if (error) {
    // Deliberately vague: distinguishing "wrong password" from "no such user"
    // tells an attacker which emails exist.
    return { error: "Wrong email or password." };
  }

  // Signed in, but is this an owner? Anyone with the anon key could have signed
  // themselves up, so a session alone earns nothing. Sign them straight back out
  // rather than leaving a valid session attached to a non-owner.
  if (!(await isOwnerEmail(data.user.email!))) {
    await db.auth.signOut();
    return { error: "That account doesn't have dashboard access." };
  }

  // Only redirect to our own paths — an open redirect would let someone craft
  // /login?next=https://evil.com and bounce a logged-in owner off-site.
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  redirect(safeNext);
}

export async function logout() {
  const db = await supabaseServer();
  await db?.auth.signOut();
  redirect("/login");
}
