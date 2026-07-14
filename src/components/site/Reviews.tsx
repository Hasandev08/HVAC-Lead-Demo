import { company } from "@/config/company";
import { StarIcon } from "./Icons";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Reviews() {
  return (
    <section id="reviews" className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Reviews"
          title="What your neighbors say"
          description={`${company.rating.score} out of 5 across ${company.rating.count} ${company.rating.source} reviews.`}
        />

        {/* Rating summary */}
        <Reveal>
          <div className="mx-auto mt-8 flex w-fit items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <p className="text-4xl font-extrabold tracking-tight text-slate-900">
              {company.rating.score}
            </p>
            <div>
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5" />
                ))}
              </div>
              <p className="mt-0.5 text-sm text-slate-500">
                {company.rating.count} {company.rating.source} reviews
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {company.reviews.map((review, i) => (
            <Reveal key={review.name} delay={(i % 3) * 60}>
              <figure className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <StarIcon
                        key={star}
                        className="h-4 w-4"
                        filled={star < review.rating}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{review.when}</span>
                </div>

                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-700">
                  &ldquo;{review.text}&rdquo;
                </blockquote>

                <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                    {initials(review.name)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{review.name}</p>
                    <p className="text-xs text-slate-500">{review.neighborhood}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}
