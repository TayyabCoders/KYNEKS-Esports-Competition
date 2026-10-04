import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary"
          ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
          : "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
