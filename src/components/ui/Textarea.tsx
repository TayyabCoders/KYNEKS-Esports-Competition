import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/** Same look and behaviour as Input, for multi-line text. */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, helperText, className, rows = 4, ...props }, ref) => (
  <div className="flex flex-col gap-2">
    {label && (
      <label htmlFor={props.id} className="text-label font-medium text-text-secondary">
        {label}
      </label>
    )}
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={!!error}
      aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
      className={cn(
        "w-full resize-y rounded-lg border bg-surface-200 px-4 py-3 text-text-primary transition-all duration-fast ease-smooth placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        error ? "border-status-danger focus:border-status-danger focus:ring-status-danger" : "border-border hover:border-border-purple focus:border-lime focus:ring-lime",
        className
      )}
      {...props}
    />
    {error && (
      <p id={`${props.id}-error`} className="text-caption text-status-danger" role="alert">
        {error}
      </p>
    )}
    {helperText && !error && (
      <p id={`${props.id}-helper`} className="text-caption text-text-muted">
        {helperText}
      </p>
    )}
  </div>
));

Textarea.displayName = "Textarea";

export default Textarea;
