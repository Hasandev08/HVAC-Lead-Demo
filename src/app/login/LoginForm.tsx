"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initial: LoginState = { error: null };

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, initial);

  const field =
    "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";

  return (
    <form
      action={formAction}
      className="rounded-2xl bg-white p-7 shadow-2xl ring-1 ring-black/5"
    >
      <input type="hidden" name="next" value={next} />

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            autoFocus
            placeholder="you@company.com"
            className={field}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={field}
          />
        </div>

        {state.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-800">{state.error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 font-bold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark active:scale-[.99] disabled:opacity-70"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </div>
    </form>
  );
}
