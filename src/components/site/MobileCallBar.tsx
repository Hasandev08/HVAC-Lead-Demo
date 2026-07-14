import { company } from "@/config/company";
import { PhoneIcon } from "./Icons";

/**
 * Fixed bottom bar on phones only. Real HVAC sites all do this: when someone's
 * AC just died, the call button should never be more than a thumb away.
 * Desktop gets nothing — the header already carries the number.
 */
export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur sm:hidden">
      <div className="flex gap-2.5">
        <a
          href={`tel:${company.phone.href}`}
          className="flex flex-[1.2] items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3.5 font-bold text-white active:scale-[.98]"
        >
          <PhoneIcon className="h-5 w-5" />
          Call Now
        </a>
        <a
          href="#contact"
          className="flex flex-1 items-center justify-center rounded-xl border-2 border-brand px-4 py-3.5 font-bold text-brand active:scale-[.98]"
        >
          Request Service
        </a>
      </div>
    </div>
  );
}
