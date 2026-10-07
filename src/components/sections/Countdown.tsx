"use client";

import { cn } from "@/lib/utils";
import { formatLaunch } from "@/lib/countdown";
import { useCountdown } from "@/hooks/useCountdown";

interface CountdownProps {
  target: string;
  size?: "lg" | "sm";
  className?: string;
}

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown({ target, size = "lg", className }: CountdownProps) {
  const time = useCountdown(target);
  const label = formatLaunch(target);

  if (time?.done) {
    return (
      <p className={cn("font-display text-3xl font-extrabold uppercase tracking-wide text-lime", className)} role="status">
        Registrations are open
      </p>
    );
  }

  return (
    <div className={className}>
      <div role="timer" aria-label={`Time until registrations open${label ? `: ${label}` : ""}`} className="flex gap-2 sm:gap-3">
        {UNITS.map(({ key, label: unit }, i) => {
          const value = time ? time[key] : null;
          return (
            <div key={key} className="chamfer-sm relative bg-gradient-to-b from-white/25 to-white/5 p-px">
              <div
                className={cn(
                  "chamfer-sm flex flex-col items-center bg-surface-100/95 backdrop-blur",
                  size === "lg" ? "min-w-[64px] px-3 pb-2 pt-3 sm:min-w-[92px] sm:px-5 sm:pb-3 sm:pt-4" : "min-w-[56px] px-3 pb-2 pt-2.5"
                )}
              >
                <span
                  key={value ?? "init"}
                  className={cn(
                    "block overflow-hidden font-display font-extrabold leading-none tabular-nums",
                    size === "lg" ? "text-4xl sm:text-6xl" : "text-3xl",
                    i === 3 ? "text-lime" : "text-white",
                    value !== null && "animate-tick"
                  )}
                >
                  {value === null ? "--" : pad(value)}
                </span>
                <span className="mt-1.5 font-heading text-[9px] font-semibold uppercase tracking-[0.25em] text-text-muted sm:text-[10px]">{unit}</span>
              </div>
            </div>
          );
        })}
      </div>
      {label && <p className="mt-3 font-heading text-[11px] uppercase tracking-[0.25em] text-text-muted">Registrations open {label}</p>}
    </div>
  );
}
