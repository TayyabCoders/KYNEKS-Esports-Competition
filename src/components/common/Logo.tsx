import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: "h-8 w-auto",
    md: "h-10 w-auto",
    lg: "h-12 w-auto",
  };

  // Placeholder logo - replace with actual KYNEKS logo asset
  // This component is structured to easily swap in the real logo
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Replace this div with your actual logo image */}
      <div className={cn("font-heading font-bold text-lime", sizes[size])}>
        KYNEKS
      </div>
    </div>
  );
}
