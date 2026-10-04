import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "live" | "open" | "upcoming" | "full" | "completed" | "default";
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = "default", size = "md", children, className }: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded-md transition-colors";

  const variants = {
    live: "bg-lime/10 text-lime border border-lime/30",
    open: "bg-purple/10 text-purple border border-purple/30",
    upcoming: "bg-surface-300 text-text-muted border border-border",
    full: "bg-surface-300 text-text-disabled border border-border",
    completed: "bg-surface-300 text-text-muted border border-border",
    default: "bg-surface-300 text-text-secondary border border-border",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {variant === "live" && (
        <span className="w-1.5 h-1.5 bg-lime rounded-full mr-1.5 animate-pulse" />
      )}
      {children}
    </span>
  );
}
