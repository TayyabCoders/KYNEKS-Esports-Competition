"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger in ms */
  delay?: number;
  from?: "bottom" | "left" | "right";
  as?: ElementType;
}

/** Fades/slides its children in the first time they scroll into view. */
export default function Reveal({ children, className, delay = 0, from = "bottom", as: Tag = "div" }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={cn("reveal", from === "left" && "reveal-left", from === "right" && "reveal-right", inView && "reveal-in", className)}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
