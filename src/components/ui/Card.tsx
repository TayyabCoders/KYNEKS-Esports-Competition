import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered";
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hover = true, children, ...props }, ref) => {
    const baseStyles = "rounded-xl transition-all duration-normal ease-smooth";

    const variants = {
      default: "bg-surface-200 border border-border shadow-card",
      elevated: "bg-surface-300 border border-border shadow-card",
      bordered: "bg-surface-200 border-2 border-border shadow-card",
    };

    const hoverStyles = hover
      ? "hover:-translate-y-1 hover:border-border-hover hover:shadow-card-hover"
      : "";

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
