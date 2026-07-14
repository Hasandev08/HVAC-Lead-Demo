import { company } from "@/config/company";
import { ClockIcon, PhoneIcon, ShieldCheckIcon } from "./Icons";
import { LeadForm } from "./LeadForm";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-brand py-16 sm:py-24">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -top-32 right-0 h-[440px] w-[440px] rounded-full opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${company.colors.accent}, transparent 65%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-16">
          <div>
            <Reveal>
              <p className="text-sm font-bold tracking-wider text-accent uppercase">
                Contact Us
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Get help today — not next week.
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-slate-300">
                Fill out the form and we&apos;ll text you back within minutes. If
                it&apos;s an emergency, skip the form and call — we answer 24/7.
              </p>

              <a
                href={`tel:${company.phone.href}`}
                className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white">
                  <PhoneIcon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-xs font-medium tracking-wide text-slate-400 uppercase">
                    Call us 24/7
                  </span>
                  <span className="block text-2xl font-extrabold tracking-tight text-white">
                    {company.phone.display}
                  </span>
                </span>
              </a>

              <div className="mt-8 space-y-4">
                <Detail icon={<ClockIcon className="h-5 w-5" />} title="Hours">
                  {company.hours.weekday}
                  <br />
                  {company.hours.saturday}
                  <br />
                  <span className="font-semibold text-accent">
                    {company.hours.emergency}
                  </span>
                </Detail>

                <Detail
                  icon={<ShieldCheckIcon className="h-5 w-5" />}
                  title="Licensed & Insured"
                >
                  {company.license}
                  <br />
                  {company.certifications.join(" · ")}
                </Detail>
              </div>
            </Reveal>
          </div>

          <Reveal delay={80}>
            <LeadForm variant="section" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Detail({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-slate-300">
        {icon}
      </span>
      <div>
        <p className="font-bold text-white">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">{children}</p>
      </div>
    </div>
  );
}
