import { company } from "@/config/company";
import { CheckIcon, TagIcon } from "./Icons";
import { Reveal } from "./Reveal";

export function Financing() {
  const { financing } = company;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid items-center gap-10 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 sm:p-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-bold tracking-wider text-primary uppercase">
                Financing
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {financing.headline}
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                {financing.description}
              </p>

              <ul className="mt-6 space-y-2.5">
                {financing.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckIcon className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="text-[15px] font-medium text-slate-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="mt-7 inline-block rounded-xl bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark active:scale-[.98]"
              >
                Check my options
              </a>
            </div>

            {/* Partner badge — the fictional equivalent of a Hearth/Synchrony lockup. */}
            <div className="flex justify-center">
              <div className="w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-lg shadow-slate-200/60">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TagIcon />
                </span>
                <p className="mt-4 text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Financing provided by
                </p>
                <p className="mt-1.5 text-xl font-extrabold tracking-tight text-brand">
                  {financing.partner}
                </p>
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="text-3xl font-extrabold text-slate-900">
                    $89<span className="text-base font-semibold text-slate-400">/mo</span>
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Typical payment on a new system for qualified buyers
                  </p>
                </div>
                <p className="mt-4 text-[10px] leading-relaxed text-slate-400">
                  Subject to credit approval. Rates and terms vary. This is an
                  illustration, not an offer of credit.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
