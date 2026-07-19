import Link from "next/link";
import { company } from "@/config/company";
import { LoginForm } from "./LoginForm";

export const metadata = { title: `Sign in — ${company.name}` };

export default async function LoginPage({
  searchParams,
}: {
  // Next 16: searchParams is a Promise.
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand px-4 py-12">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white">
            {company.logo.primary}
            <span className="text-accent"> {company.logo.secondary}</span>
          </Link>
          <p className="mt-2 text-sm text-slate-400">Owner dashboard</p>
        </div>

        <LoginForm next={next ?? "/dashboard"} />

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="underline-offset-4 hover:text-slate-300 hover:underline">
            ← Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}
