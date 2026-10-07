import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({ eyebrow, title, description, align = "left", className }: SectionHeadingProps) {
  const center = align === "center";
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      <Reveal>
        <p className={cn("mb-4 flex items-center gap-3 font-heading text-xs font-semibold uppercase tracking-[0.3em] text-lime", center && "justify-center")}>
          <span className="h-px w-8 bg-lime" aria-hidden="true" />
          {eyebrow}
          {center && <span className="h-px w-8 bg-lime" aria-hidden="true" />}
        </p>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl">{title}</h2>
      </Reveal>
      {description && (
        <Reveal delay={160}>
          <p className="mt-5 text-lg leading-relaxed text-text-muted">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
