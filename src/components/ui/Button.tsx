import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-heading font-semibold uppercase tracking-wide transition-all duration-normal ease-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-lime text-background hover:scale-[1.03] hover:shadow-glow-lime before:absolute before:inset-y-0 before:left-0 before:w-1/3 before:-translate-x-[130%] before:bg-white/50 before:blur-sm hover:before:animate-sweep",
  secondary: "bg-purple text-white hover:bg-purple-hover hover:scale-[1.03] hover:shadow-glow-purple",
  ghost: "bg-transparent text-text-primary hover:bg-white/5 hover:text-lime",
  outline:
    "border border-white/20 bg-white/[0.02] text-text-primary hover:border-lime hover:text-lime hover:bg-lime/5",
  danger: "bg-status-danger text-white hover:bg-red-600 hover:scale-[1.03]",
};

const sizes: Record<Size, string> = {
  sm: "min-h-[40px] px-4 text-xs rounded-md",
  md: "min-h-[48px] px-6 text-sm rounded-md",
  lg: "min-h-[56px] px-8 text-base rounded-md",
};

/** Same look for <button> and <a>. Use this when you need a link that looks like a button. */
export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyles({ variant, size, className })}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Locking in…</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
