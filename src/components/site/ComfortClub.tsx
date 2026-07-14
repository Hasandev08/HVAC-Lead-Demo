import { company } from "@/config/company";
import { CheckIcon, ShieldCheckIcon } from "./Icons";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function ComfortClub() {
  const plan = company.comfortClub;

  return (
    <section id="comfort-club" className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Maintenance Plans"
          title={`Join the ${plan.name}`}
          description={plan.pitch}
        />

        <Reveal>
          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <div className="grid md:grid-cols-[1fr_320px]">
              {/* Benefits */}
              <div className="p-7 sm:p-9">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <ShieldCheckIcon className="h-5 w-5" />
                  </span>
                  <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    {plan.name}
                  </h3>
                </div>

                <ul className="mt-7 space-y-3.5">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <span className="text-[15px] leading-relaxed text-slate-700">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price */}
              <div className="flex flex-col justify-center border-t border-slate-200 bg-brand p-7 text-center md:border-t-0 md:border-l sm:p-9">
                <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Membership
                </p>
                <p className="mt-3 flex items-start justify-center text-white">
                  <span className="mt-1.5 text-2xl font-bold">$</span>
                  <span className="text-6xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                </p>
                <p className="text-sm font-medium text-slate-400">{plan.period}</p>

                <a
                  href="#contact"
                  className="mt-6 rounded-xl bg-accent px-6 py-3.5 font-bold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark active:scale-[.98]"
                >
                  Join the {plan.name}
                </a>
                <p className="mt-4 text-xs leading-relaxed text-slate-500">
                  {plan.footnote}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
