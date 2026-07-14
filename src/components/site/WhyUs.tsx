import { company } from "@/config/company";
import { CheckIcon } from "./Icons";
import { Reveal } from "./Reveal";

export function WhyUs() {
  const yearsInBusiness = new Date().getFullYear() - company.foundedYear;

  return (
    <section className="relative overflow-hidden bg-brand py-16 sm:py-20">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
          <Reveal>
            <div>
              <p className="text-sm font-bold tracking-wider text-accent uppercase">
                Why {company.logo.primary}
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {yearsInBusiness} years, and we still answer the phone.
              </h2>
              <p className="mt-4 leading-relaxed text-slate-300">
                {company.footer.blurb}
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {company.whyChooseUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="flex h-full gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.08]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                    <CheckIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
