"use client";

import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, helperText, className, type = "text", disabled, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasError = !!error;
    const hasSuccess = !!success;

    const baseStyles = "w-full px-4 py-3 rounded-lg bg-surface-200 border transition-all duration-fast ease-smooth text-text-primary placeholder:text-text-disabled focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const stateStyles = hasError
      ? "border-status-danger focus:border-status-danger focus:ring-2 focus:ring-status-danger focus:ring-offset-2 focus:ring-offset-background"
      : hasSuccess
      ? "border-status-success focus:border-status-success focus:ring-2 focus:ring-status-success focus:ring-offset-2 focus:ring-offset-background"
      : isFocused
      ? "border-lime focus:border-lime focus:ring-2 focus:ring-lime focus:ring-offset-2 focus:ring-offset-background"
      : "border-border hover:border-border-purple";

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-label font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(baseStyles, stateStyles, className)}
            ref={ref}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={hasError}
            aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            {...props}
          />
        </div>
        {(error || success || helperText) && (
          <div className="flex flex-col gap-1">
            {error && (
              <p id={`${props.id}-error`} className="text-caption text-status-danger" role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className="text-caption text-status-success">
                ✓ {success}
              </p>
            )}
            {helperText && !error && !success && (
              <p id={`${props.id}-helper`} className="text-caption text-text-muted">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
