import { company } from "@/config/company";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function ServiceArea() {
  const { serviceArea } = company;

  return (
    <section id="service-area" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Service Area"
          title={serviceArea.headline}
          description={serviceArea.description}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {serviceArea.boroughs.map((borough, i) => (
            <Reveal key={borough.name} delay={(i % 3) * 60}>
              <div className="h-full rounded-2xl border border-slate-200 bg-slate-50/60 p-6 transition hover:border-primary/30 hover:bg-white hover:shadow-lg hover:shadow-slate-200/60">
                <div className="flex items-center gap-2.5">
                  <PinIcon />
                  <h3 className="text-lg font-bold text-slate-900">{borough.name}</h3>
                </div>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {borough.neighborhoods.map((hood) => (
                    <li
                      key={hood}
                      className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 ring-inset"
                    >
                      {hood}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          {/* Fills the sixth grid cell and catches anyone who doesn't see their
              neighborhood listed — a small conversion win, not decoration. */}
          <Reveal delay={120}>
            <div className="flex h-full flex-col justify-center rounded-2xl bg-brand p-6 text-center">
              <p className="text-lg font-bold text-white">
                Don&apos;t see your neighborhood?
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                We cover the whole city. Call and we&apos;ll tell you straight
                whether we can get to you today.
              </p>
              <a
                href={`tel:${company.phone.href}`}
                className="mt-5 rounded-lg bg-accent px-5 py-3 font-bold text-white transition hover:bg-accent-dark"
              >
                {company.phone.display}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-accent"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
