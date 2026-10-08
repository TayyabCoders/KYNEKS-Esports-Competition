"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Fighter } from "@/constants/content";
import { usePointerVars } from "@/hooks/usePointerVars";

/** Character card: tilts toward the cursor, the character pops out of the frame, glare follows the pointer. */
export default function FighterCard({ fighter, index }: { fighter: Fighter; index: number }) {
  const pointer = usePointerVars<HTMLDivElement>({ tilt: true, max: 10 });
  const lime = fighter.glow === "lime";

  return (
    <article className="min-w-[78%] snap-center sm:min-w-0">
      <div {...pointer} className="tilt group relative aspect-[3/4]">
        <div className="chamfer absolute inset-0 bg-gradient-to-b from-white/30 via-white/5 to-white/10 p-px transition-colors group-hover:from-lime">
          <div className="chamfer relative h-full overflow-hidden bg-surface-100">
            {/* Colour wash */}
            <div
              className="absolute inset-0"
              style={{
                background: lime
                  ? "radial-gradient(circle at 50% 70%, rgba(192,254,0,0.22), transparent 60%), linear-gradient(to top, rgba(108,19,236,0.25), transparent 60%)"
                  : "radial-gradient(circle at 50% 70%, rgba(108,19,236,0.55), transparent 62%), linear-gradient(to top, rgba(192,254,0,0.08), transparent 60%)",
              }}
            />
            <div className="scanlines absolute inset-0" />
            {/* Oversized name behind the character */}
            <span
              aria-hidden="true"
              className="text-outline absolute -left-2 top-4 select-none font-display text-[5.5rem] font-extrabold uppercase leading-none opacity-30 [-webkit-text-stroke-width:1.5px] sm:text-[6rem]"
            >
              {fighter.name}
            </span>
            <span className="absolute right-4 top-4 font-heading text-xs font-semibold tracking-[0.3em] text-white/50">0{index + 1}</span>

            <Image
              src={fighter.src}
              width={fighter.width}
              height={fighter.height}
              alt={`${fighter.name} character`}
              sizes="(min-width:768px) 340px, 78vw"
              className={cn(
                "tilt-pop absolute bottom-0 left-[6%] h-auto w-[88%] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]",
                fighter.id === "operator" && "left-[11%] w-[78%]",
                fighter.id === "scout" && "bottom-[6%]"
              )}
            />

            <div className="tilt-glare pointer-events-none absolute inset-0" />
            {/* Info plate */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/90 to-transparent px-5 pb-5 pt-16">
              <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.3em] text-lime">{fighter.role}</p>
              <h3 className="mt-1 font-display text-4xl font-extrabold uppercase leading-none">{fighter.name}</h3>
              <p className="mt-2 text-sm text-text-muted">{fighter.line}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
