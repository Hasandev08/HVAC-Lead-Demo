/**
 * THE ONLY FILE WITH COMPANY-SPECIFIC CONTENT.
 *
 * Everything a client would want changed — name, colors, phone, copy, services,
 * service area, reviews, pricing — lives here. Nothing company-specific belongs
 * in a component. Reskinning this demo for another company, or another trade
 * (roofing, plumbing, electrical), should be an edit to this file and nothing else.
 *
 * Colors are consumed as CSS variables; see app/globals.css.
 */

export type IconName =
  | "snowflake"
  | "install"
  | "minisplit"
  | "boiler"
  | "furnace"
  | "duct"
  | "air"
  | "shield";

export type Service = {
  /** Stable id. Used as the form dropdown's value and stored on the lead row. */
  id: string;
  name: string;
  description: string;
  icon: IconName;
};

export type Review = {
  name: string;
  neighborhood: string;
  rating: number;
  text: string;
  /** Relative, so a demo left running for a month doesn't show stale dates. */
  when: string;
};

export type Borough = {
  name: string;
  neighborhoods: string[];
};

export const company = {
  name: "Empire Air & Heating",
  /** Split for the two-tone logo lockup. */
  logo: { primary: "Empire", secondary: "Air & Heating" },
  tagline: "NYC's Same-Day Heating & Cooling Experts",

  phone: {
    /** What the customer reads. */
    display: "(212) 555-0148",
    /** What tel: links dial. */
    href: "+12125550148",
  },
  email: "service@empireairnyc.com",

  address: {
    street: "31-14 Northern Blvd",
    city: "Long Island City",
    state: "NY",
    zip: "11101",
  },

  /** Fictional, but formatted the way a real NYC HVAC contractor lists theirs. */
  license: "NYC DCWP Lic. #2087341",
  certifications: ["EPA 608 Certified", "NATE-Certified Technicians"],
  foundedYear: 2008,

  hours: {
    weekday: "Mon–Fri: 7:00 AM – 8:00 PM",
    saturday: "Saturday: 8:00 AM – 6:00 PM",
    sunday: "Sunday: Emergency service only",
    emergency: "24/7 Emergency Service",
  },

  rating: {
    score: 4.9,
    count: 612,
    source: "Google",
  },

  /** Brand palette. Change these six values and the entire site restyles. */
  colors: {
    /** Deep navy — header, footer, dark sections. Trust. */
    brand: "#0B2545",
    brandDark: "#071A33",
    /** Cooling blue — primary actions, links. */
    primary: "#1266E3",
    primaryDark: "#0D4FB4",
    /** Heating orange — the "call now" urgency accent. Used sparingly on purpose. */
    accent: "#FF6B1A",
    accentDark: "#E5570A",
  },

  emergencyBanner: "24/7 Emergency AC & Heating Repair — No Overtime Charges",

  hero: {
    headline: "AC Not Cooling? We'll Be There Today.",
    subtext:
      "Same-day repair across all five boroughs. Upfront pricing before we start, licensed technicians, and no overtime charges — nights, weekends, or holidays.",
    trustBadges: ["Licensed & Insured", "Same-Day Service", "Upfront Pricing"],
  },

  services: [
    {
      id: "ac-repair",
      name: "AC Repair",
      description:
        "Not cooling, leaking, or short-cycling? We diagnose fast and carry the common parts on the truck.",
      icon: "snowflake",
    },
    {
      id: "ac-installation",
      name: "AC Installation",
      description:
        "New central air or a full system replacement, sized properly for your home — not oversized to pad the invoice.",
      icon: "install",
    },
    {
      id: "ductless-mini-split",
      name: "Ductless Mini-Splits",
      description:
        "Cool a brownstone, walk-up, or converted space with no ductwork. The right fit for most NYC buildings.",
      icon: "minisplit",
    },
    {
      id: "boiler-steam-heat",
      name: "Boiler & Steam Heat",
      description:
        "Cold radiators, banging pipes, no hot water. We service the pre-war steam systems most companies won't touch.",
      icon: "boiler",
    },
    {
      id: "furnace-heat-pump",
      name: "Furnace & Heat Pump",
      description:
        "Heating repair, tune-ups, and high-efficiency heat pump installs that qualify for NY State rebates.",
      icon: "furnace",
    },
    {
      id: "duct-cleaning",
      name: "Duct Cleaning",
      description:
        "Clear out the dust, dander, and construction debris that's been recirculating through your home for years.",
      icon: "duct",
    },
    {
      id: "indoor-air-quality",
      name: "Indoor Air Quality",
      description:
        "Air purification, humidity control, and filtration — a real difference if anyone in the home has allergies.",
      icon: "air",
    },
    {
      id: "maintenance-plan",
      name: "Maintenance Plans",
      description:
        "Two tune-ups a year, priority scheduling, and discounted repairs. Catches problems before they become breakdowns.",
      icon: "shield",
    },
  ] satisfies Service[],

  whyChooseUs: [
    {
      title: "Upfront Pricing",
      description:
        "You approve the price before we pick up a wrench. No hourly meter, no surprises on the invoice.",
    },
    {
      title: "Background-Checked Techs",
      description:
        "Every technician is background-checked and shows up in a marked truck, in uniform, on time.",
    },
    {
      title: "Satisfaction Guarantee",
      description:
        "If you're not happy with the repair, we come back and make it right at no charge. In writing.",
    },
    {
      title: "Financing Available",
      description:
        "A new system is a big expense. Approved applicants can spread it across affordable monthly payments.",
    },
  ],

  comfortClub: {
    name: "Comfort Club",
    price: "14.99",
    period: "/month",
    pitch:
      "The cheapest repair is the one you never need. Members get their systems tuned before the season turns.",
    benefits: [
      "2 precision tune-ups per year (heating + cooling)",
      "Priority scheduling — members go to the front of the line",
      "15% off all repairs",
      "No overtime charges, ever",
      "Waived diagnostic fee on service calls",
      "Transferable if you sell your home",
    ],
    footnote: "Cancel anytime. No long-term contract.",
  },

  financing: {
    headline: "Flexible Monthly Payments",
    description:
      "A system replacement shouldn't have to wait for the perfect month. Approved applicants can finance the job and start with low monthly payments — often less than what a failing system is adding to your Con Edison bill.",
    partner: "ClearPath Financing",
    highlights: [
      "0% APR options for qualified buyers",
      "Apply in minutes, same-day decision",
      "Terms up to 60 months",
    ],
  },

  reviews: [
    {
      name: "Marisol Ortega",
      neighborhood: "Astoria, Queens",
      rating: 5,
      text: "Called at 8am on the hottest day of July with a dead AC and a newborn in the apartment. They had a tech here before noon. Blown capacitor, fixed on the spot, and he showed me the old part and the price before touching anything. I've never had an HVAC company move that fast.",
      when: "2 weeks ago",
    },
    {
      name: "David Chen",
      neighborhood: "Park Slope, Brooklyn",
      rating: 5,
      text: "Three companies told me a brownstone couldn't take central air without tearing up the walls. Empire spec'd a ductless system instead, installed it in two days, and the place is finally livable in August. Clean work, and they took their shoes off without being asked.",
      when: "1 month ago",
    },
    {
      name: "Angela Ruffino",
      neighborhood: "Bay Ridge, Brooklyn",
      rating: 5,
      text: "Our steam boiler died in January and half the radiators were stone cold. They actually understood the old system instead of just telling me to replace everything. Heat was back on the same night. Honest people, which is rare in this business.",
      when: "1 month ago",
    },
    {
      name: "Michael Sorrentino",
      neighborhood: "Riverdale, Bronx",
      rating: 5,
      text: "Signed up for the Comfort Club after they did our install. They call me to schedule the tune-ups so I don't have to remember. The AC has run without a single issue for two summers now.",
      when: "2 months ago",
    },
    {
      name: "Priya Raghunathan",
      neighborhood: "Forest Hills, Queens",
      rating: 4,
      text: "Great technician and a fair price on the repair. Only reason it's not five stars is the arrival window was wide and I waited most of the morning. But they texted me updates the whole time, and the work itself was excellent.",
      when: "3 months ago",
    },
    {
      name: "James Whitaker",
      neighborhood: "Upper East Side, Manhattan",
      rating: 5,
      text: "Coordinated the entire install with my building's management and handled the certificate of insurance paperwork themselves. If you've ever dealt with a co-op board, you know that's worth the price on its own.",
      when: "3 months ago",
    },
  ] satisfies Review[],

  serviceArea: {
    headline: "Serving All Five Boroughs",
    description:
      "Trucks staged across the city, so we reach most addresses within a couple of hours.",
    boroughs: [
      {
        name: "Manhattan",
        neighborhoods: [
          "Upper East Side",
          "Upper West Side",
          "Harlem",
          "Chelsea",
          "Murray Hill",
          "Washington Heights",
        ],
      },
      {
        name: "Brooklyn",
        neighborhoods: [
          "Park Slope",
          "Bay Ridge",
          "Williamsburg",
          "Bushwick",
          "Bensonhurst",
          "Flatbush",
        ],
      },
      {
        name: "Queens",
        neighborhoods: [
          "Astoria",
          "Long Island City",
          "Forest Hills",
          "Flushing",
          "Jackson Heights",
          "Ridgewood",
        ],
      },
      {
        name: "The Bronx",
        neighborhoods: [
          "Riverdale",
          "Pelham Bay",
          "Throgs Neck",
          "Fordham",
          "Morris Park",
        ],
      },
      {
        name: "Staten Island",
        neighborhoods: ["St. George", "Tottenville", "Great Kills", "New Dorp"],
      },
    ] satisfies Borough[],
  },

  /** The lead form's "when do you need us" options. */
  urgencyOptions: [
    { id: "asap", label: "ASAP — it's an emergency" },
    { id: "today", label: "Today if possible" },
    { id: "this-week", label: "Sometime this week" },
    { id: "flexible", label: "I'm flexible" },
  ],

  form: {
    heading: "Request Service",
    subheading:
      "Tell us what's going on. We'll text you back within minutes — not tomorrow.",
    submitLabel: "Request Service",
    success: {
      heading: "Help is on the way.",
      body: "Check your phone — we're texting you now to confirm. A confirmation email is on its way too.",
    },
  },

  footer: {
    blurb:
      "Family-owned, operating out of Long Island City since 2008. We keep New Yorkers cool in July and warm in January.",
  },
} as const;

export type Company = typeof company;

/** Used by the form, the services grid, and server-side validation. */
export const serviceIds: string[] = company.services.map((s) => s.id);
export const urgencyIds: string[] = company.urgencyOptions.map((u) => u.id);

export function serviceName(id: string): string {
  return company.services.find((s) => s.id === id)?.name ?? id;
}

export function urgencyLabel(id: string): string {
  return company.urgencyOptions.find((u) => u.id === id)?.label ?? id;
}
