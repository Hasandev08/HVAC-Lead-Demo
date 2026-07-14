import { company } from "@/config/company";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Identity */}
          <div className="lg:col-span-1">
            <p className="text-lg font-bold text-white">
              {company.logo.primary}
              <span className="text-accent"> {company.logo.secondary}</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed">{company.footer.blurb}</p>
            <p className="mt-4 text-xs leading-relaxed">
              {company.license}
              <br />
              {company.certifications.join(" · ")}
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              Services
            </h3>
            <ul className="mt-4 space-y-2.5">
              {company.services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    className="text-sm transition hover:text-accent"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service area */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              Service Area
            </h3>
            <ul className="mt-4 space-y-2.5">
              {company.serviceArea.boroughs.map((borough) => (
                <li key={borough.name}>
                  <a
                    href="#service-area"
                    className="text-sm transition hover:text-accent"
                  >
                    {borough.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              Contact
            </h3>
            <div className="mt-4 space-y-3 text-sm">
              <a
                href={`tel:${company.phone.href}`}
                className="block text-xl font-bold text-white transition hover:text-accent"
              >
                {company.phone.display}
              </a>
              <a
                href={`mailto:${company.email}`}
                className="block transition hover:text-accent"
              >
                {company.email}
              </a>
              <address className="text-sm leading-relaxed not-italic">
                {company.address.street}
                <br />
                {company.address.city}, {company.address.state} {company.address.zip}
              </address>
              <div className="pt-1 text-sm leading-relaxed">
                <p>{company.hours.weekday}</p>
                <p>{company.hours.saturday}</p>
                <p>{company.hours.sunday}</p>
                <p className="mt-1.5 font-semibold text-accent">
                  {company.hours.emergency}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.name}. All rights reserved.
          </p>
          <p className="text-slate-500">
            Demonstration site. {company.name} is a fictional company.
          </p>
        </div>
      </div>
    </footer>
  );
}
