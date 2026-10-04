import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
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
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-fast ease-smooth focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-lime text-background hover:bg-lime-hover hover:scale-[1.02] hover:shadow-glow-lime focus:ring-2 focus:ring-lime focus:ring-offset-2 focus:ring-offset-background",
    secondary: "bg-purple text-white hover:bg-purple-hover hover:scale-[1.02] hover:shadow-glow-purple focus:ring-2 focus:ring-purple focus:ring-offset-2 focus:ring-offset-background",
    ghost: "bg-transparent text-text-primary hover:bg-surface-200 hover:text-lime focus:ring-2 focus:ring-lime focus:ring-offset-2 focus:ring-offset-background",
    outline: "bg-transparent border border-border text-text-primary hover:border-lime hover:text-lime focus:ring-2 focus:ring-lime focus:ring-offset-2 focus:ring-offset-background",
    danger: "bg-status-danger text-white hover:bg-red-600 hover:scale-[1.02] focus:ring-2 focus:ring-status-danger focus:ring-offset-2 focus:ring-offset-background",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-body rounded-lg",
    lg: "px-6 py-3 text-body-lg rounded-xl",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
