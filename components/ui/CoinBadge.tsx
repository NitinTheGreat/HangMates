"use client";

import { cn } from "@/lib/utils";

interface CoinBadgeProps {
  balance: number;
  className?: string;
}

export default function CoinBadge({ balance, className }: CoinBadgeProps) {
  return (
    <div
      className={cn(
        "glass inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
        className
      )}
    >
      <span className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-bg-base">
        ₣
      </span>
      <span className="text-text-primary">{balance}</span>
      <span className="text-text-secondary text-xs">FC</span>
    </div>
  );
}
