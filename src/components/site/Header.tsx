"use client";

import { useEffect, useState } from "react";
import { company } from "@/config/company";
import { CloseIcon, MenuIcon, PhoneIcon } from "./Icons";

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Maintenance Plans", href: "#comfort-club" },
  { label: "Reviews", href: "#reviews" },
  { label: "Service Area", href: "#service-area" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Condense the header once the user leaves the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A scrollable page behind an open mobile menu is a classic annoyance.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Emergency banner — above the header, as on every real HVAC site. */}
      <div className="relative z-50 bg-accent text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center">
          <span className="h-1.5 w-1.5 shrink-0 animate-soft-pulse rounded-full bg-white" />
          <p className="text-[13px] font-semibold sm:text-sm">
            {company.emergencyBanner}
          </p>
          <a
            href={`tel:${company.phone.href}`}
            className="hidden shrink-0 items-center gap-1 underline underline-offset-2 hover:opacity-90 sm:inline-flex"
          >
            Call now
          </a>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 border-b transition-all duration-200 ${
          scrolled
            ? "border-slate-200 bg-white/95 shadow-sm backdrop-blur"
            : "border-transparent bg-white"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a
            href="#top"
            className={`flex items-center gap-2.5 font-bold tracking-tight transition-all ${
              scrolled ? "py-3.5" : "py-4 sm:py-5"
            }`}
          >
            <Logo />
            <span className="text-lg leading-none text-brand sm:text-xl">
              {company.logo.primary}
              <span className="text-accent"> {company.logo.secondary}</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[15px] font-medium text-slate-600 transition hover:text-primary"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${company.phone.href}`}
              className="hidden text-right sm:block"
            >
              <span className="block text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                Call 24/7
              </span>
              <span className="block text-lg leading-tight font-bold text-brand transition hover:text-primary">
                {company.phone.display}
              </span>
            </a>

            <a
              href="#contact"
              className="hidden rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-accent-dark md:inline-block"
            >
              Get a Free Quote
            </a>

            <a
              href={`tel:${company.phone.href}`}
              className="rounded-lg bg-accent p-2.5 text-white sm:hidden"
              aria-label={`Call ${company.phone.display}`}
            >
              <PhoneIcon className="h-5 w-5" />
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="p-2 text-slate-700 lg:hidden"
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-brand/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <span className="font-bold text-brand">
                {company.logo.primary}
                <span className="text-accent"> {company.logo.secondary}</span>
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-2 text-slate-500"
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>

            <nav className="flex flex-col px-2 py-3">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3.5 text-lg font-medium text-slate-700 transition hover:bg-slate-50 hover:text-primary"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto space-y-3 border-t border-slate-100 p-5">
              <a
                href={`tel:${company.phone.href}`}
                className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3.5 font-bold text-white"
              >
                <PhoneIcon className="h-5 w-5" />
                {company.phone.display}
              </a>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg border-2 border-brand px-4 py-3 text-center font-bold text-brand"
              >
                Request Service
              </a>
              <p className="pt-1 text-center text-xs text-slate-400">
                {company.hours.emergency} · {company.license}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** A stylized vent/airflow mark — no logo file to license or maintain. */
function Logo() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand shadow-sm">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="h-5 w-5 text-white"
        aria-hidden="true"
      >
        <path d="M3 7h11a3 3 0 1 0-3-3" />
        <path d="M3 12h15a3 3 0 1 1-3 3" />
        <path d="M3 17h8" />
      </svg>
    </span>
  );
}
