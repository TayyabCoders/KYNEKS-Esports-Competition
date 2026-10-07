import { marqueeItems } from "@/constants/content";
import { cn } from "@/lib/utils";

function Track({ reverse, outline }: { reverse?: boolean; outline?: boolean }) {
  // Two identical halves; the track slides exactly one half so the loop is seamless.
  const half = [...marqueeItems, ...marqueeItems];
  return (
    <div className={cn("flex w-max", reverse ? "animate-marquee-reverse" : "animate-marquee")} aria-hidden="true">
      {[0, 1].map((copy) => (
        <ul key={copy} className="flex shrink-0 items-center">
          {half.map((text, i) => (
            <li key={`${copy}-${i}`} className="flex items-center">
              <span
                className={cn(
                  "px-6 font-display text-3xl font-extrabold uppercase tracking-wide sm:text-5xl",
                  outline ? "text-outline [-webkit-text-stroke-width:1.5px] [-webkit-text-stroke-color:rgba(255,255,255,0.55)]" : "text-background"
                )}
              >
                {text}
              </span>
              <span className={cn("h-3 w-3 rotate-45 sm:h-4 sm:w-4", outline ? "bg-lime" : "bg-background")} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

/** Two crossing diagonal ticker bands: the visual break between hero and content. */
export default function Marquee() {
  return (
    <div className="relative z-10 -my-2 overflow-hidden py-14 sm:py-20" role="region" aria-label="Highlights">
      <p className="sr-only">{marqueeItems.join(". ")}.</p>
      <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[1.6deg] border-y border-purple/50 bg-purple/20 py-3 backdrop-blur-sm">
        <Track reverse outline />
      </div>
      <div className="relative -ml-[5%] w-[110%] -rotate-[1.6deg] bg-lime py-2.5 shadow-[0_0_60px_rgba(192,254,0,0.25)]">
        <Track />
      </div>
    </div>
  );
}
