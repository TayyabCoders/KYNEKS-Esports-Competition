import { cn } from "@/lib/utils";

interface DividerProps {
  variant?: "solid" | "gradient";
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export default function Divider({ variant = "solid", orientation = "horizontal", className }: DividerProps) {
  const baseStyles = orientation === "horizontal" ? "w-full h-px" : "h-full w-px";

  const variants = {
    solid: "bg-border",
    gradient: "bg-gradient-to-r from-purple via-lime to-purple",
  };

  return <div className={cn(baseStyles, variants[variant], className)} />;
}
