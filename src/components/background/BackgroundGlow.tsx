import { cn } from "@/lib/utils";

interface BackgroundGlowProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center";
  color?: "lime" | "purple";
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export default function BackgroundGlow({
  position = "top-right",
  color = "lime",
  intensity = "medium",
  className,
}: BackgroundGlowProps) {
  const positions = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  const colors = {
    lime: "rgba(192,254,0",
    purple: "rgba(108,19,236",
  };

  const intensities = {
    low: "0.05)",
    medium: "0.10)",
    high: "0.15)",
  };

  const glowColor = `${colors[color]}, ${intensities[intensity]}`;

  return (
    <div
      className={cn(
        "absolute pointer-events-none rounded-full blur-3xl",
        positions[position],
        className
      )}
      style={{
        background: `radial-gradient(circle, ${glowColor}, transparent 50%)`,
        width: "600px",
        height: "600px",
      }}
    />
  );
}
