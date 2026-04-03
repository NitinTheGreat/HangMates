import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Logo({ size = "md", className }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-4xl",
  };

  return (
    <span
      className={cn(
        "font-extrabold tracking-tight",
        sizeClasses[size],
        className
      )}
    >
      <span className="text-primary">Hang</span>
      <span className="text-text-primary">Mates</span>
    </span>
  );
}
