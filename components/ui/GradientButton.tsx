import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "outlined";
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function GradientButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  fullWidth = false,
  size = "md",
  className,
  type = "button",
}: GradientButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "rounded-full font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2",
        sizeClasses[size],
        fullWidth && "w-full",
        variant === "primary" &&
          "gradient-button text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]",
        variant === "outlined" &&
          "bg-transparent border-2 border-primary text-primary hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98]",
        (disabled || loading) && "opacity-50 pointer-events-none",
        className
      )}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
