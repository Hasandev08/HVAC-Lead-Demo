import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Route guard for /dashboard. In Next.js 16 this file is `proxy.ts` — the
 * convention formerly known as middleware.
 *
 * This is an OPTIMISTIC check, exactly as the Next.js auth guide describes: it
 * bounces logged-out visitors before a page renders, but it is NOT the security
 * boundary. The real authorization lives in requireOwner() in the page itself,
 * plus RLS in the database. Proxy runs on the edge and can be bypassed in ways
 * a server component cannot, so it never gets the last word.
 *
 * It also refreshes the Supabase session cookie on every request, which is what
 * keeps a login from expiring mid-demo.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Not configured yet — let the page render its own "set up Supabase" notice
  // rather than redirect to a login that also can't work.
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // getUser() validates the token with Supabase; getSession() would just trust
  // the cookie. Also the call that refreshes an expiring session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  // Only the dashboard. Without a matcher this runs on every asset request too,
  // which would put a Supabase round-trip in front of every CSS and image load.
  matcher: ["/dashboard/:path*"],
};
