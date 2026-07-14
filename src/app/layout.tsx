import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { company } from "@/config/company";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${company.name} — ${company.tagline}`,
  description: company.hero.subtext,
};

/**
 * The config's palette becomes CSS variables here, and globals.css maps those
 * into Tailwind's theme. This is the seam that makes `colors` in company.ts
 * genuinely restyle the site — without it, "config-driven branding" is a claim
 * rather than a fact.
 */
const brandVars = `:root{
  --brand:${company.colors.brand};
  --brand-dark:${company.colors.brandDark};
  --primary:${company.colors.primary};
  --primary-dark:${company.colors.primaryDark};
  --accent:${company.colors.accent};
  --accent-dark:${company.colors.accentDark};
}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // The inline script below adds a `js` class to <html> before React
      // hydrates, so the server and client markup intentionally differ here.
      // Without this, React treats it as a hydration mismatch, bails out, and
      // never runs the effects that drive the scroll reveals.
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: brandVars }} />
        {/*
          Marks the document as JS-capable before first paint. globals.css only
          hides scroll-reveal elements under `.js`, so if this never runs, the
          page renders fully visible instead of blank. Inline and synchronous on
          purpose — a deferred script would let unstyled content flash first.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
