import { company } from "@/config/company";
import { CheckIcon, PhoneIcon, StarIcon } from "./Icons";
import { LeadForm } from "./LeadForm";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-brand">
      {/* Depth without a stock photo: a grid, two color washes, one soft glow. */}
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -top-40 -right-32 h-[520px] w-[520px] rounded-full opacity-25 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${company.colors.primary}, transparent 65%)`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-52 -left-40 h-[480px] w-[480px] rounded-full opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${company.colors.accent}, transparent 65%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_minmax(0,440px)] lg:gap-16">
          {/* Left: the pitch */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 backdrop-blur">
              <span className="flex h-2 w-2">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[13px] font-semibold text-white">
                Technicians available now
              </span>
            </div>

            <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {company.hero.headline}
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              {company.hero.subtext}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${company.phone.href}`}
                className="flex items-center justify-center gap-2.5 rounded-xl bg-accent px-7 py-4 text-lg font-bold text-white shadow-xl shadow-accent/30 transition hover:bg-accent-dark active:scale-[.98]"
              >
                <PhoneIcon className="h-5 w-5" />
                Call {company.phone.display}
              </a>
              <a
                href="#contact"
                className="flex items-center justify-center rounded-xl border-2 border-white/25 px-7 py-4 text-lg font-bold text-white transition hover:border-white/50 hover:bg-white/10 active:scale-[.98]"
              >
                Request Service
              </a>
            </div>

            {/* Trust row */}
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              {company.hero.trustBadges.map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-slate-300">{badge}</span>
                </div>
              ))}

              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="h-3.5 w-3.5" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-white">
                  {company.rating.score}
                </span>
                <span className="text-xs text-slate-400">
                  ({company.rating.count} {company.rating.source} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Right: the form. On mobile it sits below the pitch, which is correct —
              a panicking customer taps "Call" first; the form is for everyone else. */}
          <div className="lg:pl-4">
            <LeadForm variant="hero" />
          </div>
        </div>
      </div>

      {/* Wave into the white section below. */}
      <div className="relative h-12 sm:h-16" aria-hidden="true">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute bottom-0 h-full w-full"
        >
          <path d="M0 80V32c240 32 480 40 720 24S1200 8 1440 24v56Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
