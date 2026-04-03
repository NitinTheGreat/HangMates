"use client";

import Logo from "@/components/shared/Logo";
import CoinBadge from "./CoinBadge";
import { Menu } from "lucide-react";

interface TopBarProps {
  friendCoins?: number;
}

export default function TopBar({ friendCoins = 0 }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14">
      <div className="h-full mx-auto max-w-[430px] px-4 flex items-center justify-between glass-strong rounded-none border-x-0 border-t-0">
        <button
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-bg-surface-hover transition-colors"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5 text-text-secondary" />
        </button>

        <Logo size="md" />

        <CoinBadge balance={friendCoins} />
      </div>
    </header>
  );
}
