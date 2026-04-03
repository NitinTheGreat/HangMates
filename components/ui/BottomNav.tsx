"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/hangouts", icon: PlusCircle, label: "Create", isCreate: true },
  { href: "/hangouts", icon: Users, label: "Hangouts" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[430px] glass-strong rounded-none border-x-0 border-b-0 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-[72px]">
          {tabs.map((tab) => {
            const isActive =
              !tab.isCreate && pathname.startsWith(tab.href);
            const Icon = tab.icon;

            if (tab.isCreate) {
              return (
                <Link
                  key="create"
                  href={tab.href}
                  className="flex flex-col items-center justify-center gap-0.5 -mt-4"
                >
                  <div className="w-12 h-12 rounded-full gradient-button flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 transition-transform active:scale-95">
                    <PlusCircle className="w-6 h-6 text-white" />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={tab.href + tab.label}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 w-16 py-2 rounded-xl transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
