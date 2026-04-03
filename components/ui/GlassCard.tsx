import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: React.ElementType;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className,
  onClick,
  as: Component = "div",
  hover = false,
}: GlassCardProps) {
  return (
    <Component
      onClick={onClick}
      className={cn(
        "glass p-4",
        hover &&
          "transition-all duration-200 hover:bg-bg-surface-hover hover:border-[rgba(255,255,255,0.12)] cursor-pointer",
        className
      )}
    >
      {children}
    </Component>
  );
}
