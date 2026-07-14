import type { IconName } from "@/config/company";

/**
 * Inline SVG only — no icon library, no image licensing. Every icon inherits
 * currentColor and sizes from its container.
 */

type Props = { className?: string };

const base = "h-6 w-6";

export function ServiceIcon({
  name,
  className = base,
}: Props & { name: IconName }) {
  const icons: Record<IconName, React.ReactNode> = {
    snowflake: (
      <>
        <path d="M12 2v20M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3" />
        <path d="M20.66 7 3.34 17M20.66 7l-4.1.36M20.66 7l-1.27 3.93M3.34 17l4.1-.36M3.34 17l1.27-3.93" />
        <path d="M3.34 7l17.32 10M3.34 7l1.27 3.93M3.34 7l4.1.36M20.66 17l-1.27-3.93M20.66 17l-4.1-.36" />
      </>
    ),
    install: (
      <>
        <rect x="2" y="4" width="20" height="10" rx="2" />
        <path d="M6 8h4M6 11h2" />
        <path d="M7 18v2M12 18v3M17 18v2" />
        <path d="M2 14h20" />
      </>
    ),
    minisplit: (
      <>
        <rect x="3" y="4" width="18" height="7" rx="2" />
        <path d="M6 8h6" />
        <path d="M7 14c0 2 1.5 2 1.5 4M12 14c0 2 1.5 2 1.5 4M17 14c0 2 1.5 2 1.5 4" />
      </>
    ),
    boiler: (
      <>
        <rect x="5" y="3" width="14" height="14" rx="2" />
        <circle cx="12" cy="10" r="3" />
        <path d="M9 17v4M15 17v4M5 7h-2M21 7h-2" />
      </>
    ),
    furnace: (
      <>
        <path d="M12 22c3.5 0 6-2.4 6-5.7 0-3.8-3.6-5.4-2.8-9.8C13 7.7 12.4 10 11.5 11c-.9-1-.6-2.6-.6-4.3-2 1.4-4.9 3.9-4.9 9.6C6 19.6 8.5 22 12 22Z" />
      </>
    ),
    duct: (
      <>
        <path d="M4 6h9a4 4 0 0 1 4 4v8" />
        <path d="M4 3v6M17 15h5M17 18h5" />
        <path d="M8 6v3M12 6v3" />
      </>
    ),
    air: (
      <>
        <path d="M3 8h10a3 3 0 1 0-3-3" />
        <path d="M3 13h14a3 3 0 1 1-3 3" />
        <path d="M3 18h7" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

export function PhoneIcon({ className = base }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z" />
    </svg>
  );
}

export function StarIcon({
  className = "h-4 w-4",
  filled = true,
}: Props & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path d="m12 2 3.1 6.3 7 1-5 4.9 1.2 6.9-6.3-3.3-6.3 3.3L6.9 14l-5-4.9 7-1L12 2Z" />
    </svg>
  );
}

export function CheckIcon({ className = "h-5 w-5" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

export function ShieldCheckIcon({ className = base }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function ClockIcon({ className = base }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function TagIcon({ className = base }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 11V4a1 1 0 0 1 1-1h7l9 9-8 8-9-9Z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MenuIcon({ className = base }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className = base }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
