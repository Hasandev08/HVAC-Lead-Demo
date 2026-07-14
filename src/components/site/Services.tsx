import { company } from "@/config/company";
import { ServiceIcon } from "./Icons";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Services() {
  return (
    <section id="services" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What We Do"
          title="Heating & cooling, done right the first time"
          description="Whatever's broken, we've seen it before — in a pre-war walk-up, a brownstone, or a new build."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {company.services.map((service, i) => (
            <Reveal key={service.id} delay={i * 50}>
              <a
                href="#contact"
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <ServiceIcon name={service.icon} />
                </span>
                <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>
                <span className="mt-4 text-sm font-semibold text-primary opacity-0 transition group-hover:opacity-100">
                  Get a quote →
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
