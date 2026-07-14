import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
  align?: "center" | "left";
}) {
  const centered = align === "center";

  return (
    <Reveal>
      <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
        <p
          className={`text-sm font-bold tracking-wider uppercase ${
            dark ? "text-accent" : "text-primary"
          }`}
        >
          {eyebrow}
        </p>
        <h2
          className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${
            dark ? "text-white" : "text-slate-900"
          }`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-4 text-lg leading-relaxed ${
              dark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}
