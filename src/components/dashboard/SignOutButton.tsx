"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/Spinner";

/**
 * Sign-out button with a pending state.
 *
 * Its own component because `useFormStatus` only reports the status of a form
 * it is rendered *inside* — so the button has to be a child of the <form>, and
 * the form itself can stay in the server component that owns the action.
 *
 * Sign-out is slower than it looks: it clears the Supabase session and then
 * redirects. Without feedback that gap reads as a dead click, and people click
 * again.
 */
export function SignOutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
    >
      {pending && <Spinner className="h-3.5 w-3.5" />}
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
