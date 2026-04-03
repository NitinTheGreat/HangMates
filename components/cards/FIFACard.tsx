"use client";

import { cn } from "@/lib/utils";
import { User as UserIcon, Wifi, WifiOff } from "lucide-react";
import GradientButton from "@/components/ui/GradientButton";
import Link from "next/link";

interface FIFACardUser {
  _id: string;
  name: string;
  age?: number;
  profileImage?: string;
  bio?: string;
  role: string;
  stats: Record<string, number>;
  isOnline: boolean;
  ratePerHour: number;
  occasionTags: string[];
  totalBookings: number;
  rating: number;
  badges: Array<{ badgeType: string; count: number }>;
}

interface FIFACardProps {
  user: FIFACardUser;
  variant?: "full" | "compact";
  showBookButton?: boolean;
  onBook?: () => void;
  className?: string;
}

const STAT_LABELS: Record<string, string> = {
  humor: "HUM",
  energy: "ENR",
  chillFactor: "CHL",
  foodieScore: "FOD",
  hypeFactor: "HYP",
  empathy: "EMP",
  photography: "PHO",
  conversationDepth: "CNV",
  punctuality: "PNC",
  adventure: "ADV",
};

function getTopStats(stats: Record<string, number>, count: number) {
  return Object.entries(stats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([key, value]) => ({
      key,
      label: STAT_LABELS[key] || key.toUpperCase().slice(0, 3),
      value,
    }));
}

function FullCard({ user, showBookButton, onBook }: Omit<FIFACardProps, "variant" | "className">) {
  const topStats = getTopStats(user.stats, 4);
  const displayName = user.name?.toUpperCase() || "UNKNOWN";
  const tagline = user.bio || user.occasionTags?.[0] || "Ready to hang";

  return (
    <>
      {/* Image section */}
      <div className="relative aspect-[3/4] max-h-[320px] overflow-hidden">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-tertiary/30 flex items-center justify-center">
            <UserIcon className="w-20 h-20 text-text-muted" />
          </div>
        )}
        {/* Bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0F0F1A] to-transparent" />

        {/* Online badge - top left */}
        <div className="absolute top-3 left-3">
          {user.isOnline ? (
            <div className="glass-strong flex items-center gap-1.5 px-2.5 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-online-green animate-pulse" />
              <span className="text-[10px] font-semibold text-white uppercase tracking-wider">
                Online Now
              </span>
            </div>
          ) : (
            <div className="glass-strong flex items-center gap-1.5 px-2.5 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-text-muted" />
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                Away
              </span>
            </div>
          )}
        </div>

        {/* Rate badge - top right */}
        <div className="absolute top-3 right-3">
          <div className="glass-strong rounded-full w-14 h-14 flex flex-col items-center justify-center border border-primary/30">
            <span className="text-[8px] text-text-secondary uppercase tracking-wider leading-none">
              Rate
            </span>
            <span className="text-sm font-bold text-primary leading-tight">
              {user.ratePerHour}
            </span>
            <span className="text-[8px] text-text-secondary leading-none">FC</span>
          </div>
        </div>
      </div>

      {/* Name section */}
      <div className="px-4 pt-1 pb-2">
        <h3 className="text-2xl font-extrabold text-text-primary tracking-tight">
          {displayName}
          {user.age ? <span className="text-text-secondary font-bold">, {user.age}</span> : null}
        </h3>
        <p className="text-sm text-tertiary italic truncate">{tagline}</p>
      </div>

      {/* Stats section */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {topStats.map((stat) => (
            <div key={stat.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] uppercase text-text-secondary tracking-widest font-medium">
                  {stat.label}
                </span>
                <span className="text-sm font-bold text-secondary">
                  {stat.value}
                </span>
              </div>
              <div className="h-[3px] rounded-full bg-bg-surface overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${stat.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA section */}
      {showBookButton && (
        <div className="px-4 pb-4">
          {user.isOnline ? (
            <GradientButton fullWidth onClick={onBook}>
              BOOK NOW
            </GradientButton>
          ) : (
            <Link href={`/profile/${user._id}`}>
              <GradientButton variant="outlined" fullWidth>
                VIEW SCHEDULE
              </GradientButton>
            </Link>
          )}
        </div>
      )}
    </>
  );
}

function CompactCard({ user }: { user: FIFACardUser }) {
  const topStats = getTopStats(user.stats, 2);

  return (
    <div className="flex items-center gap-3 p-1">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-20 h-20 rounded-xl object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/30 to-tertiary/30 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-text-muted" />
          </div>
        )}
        {user.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-online-green border-2 border-bg-base" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-bold text-text-primary truncate">
          {user.name}
          {user.age ? <span className="text-text-secondary font-semibold">, {user.age}</span> : null}
        </h4>
        <div className="flex gap-2 mt-1">
          {topStats.map((stat) => (
            <span
              key={stat.key}
              className="text-[10px] uppercase tracking-wider text-text-secondary bg-bg-surface px-2 py-0.5 rounded-full"
            >
              {stat.label} <span className="text-secondary font-bold">{stat.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Rate */}
      <div className="flex-shrink-0 text-center">
        <div className="glass px-3 py-1.5 rounded-full">
          <span className="text-sm font-bold text-primary">{user.ratePerHour}</span>
          <span className="text-[10px] text-text-secondary ml-0.5">FC</span>
        </div>
      </div>
    </div>
  );
}

export default function FIFACard({
  user,
  variant = "full",
  showBookButton = false,
  onBook,
  className,
}: FIFACardProps) {
  const Wrapper = variant === "full" ? "div" : "div";

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden border border-glass-border",
        variant === "full" ? "bg-bg-surface" : "glass",
        className
      )}
    >
      {variant === "full" ? (
        <FullCard user={user} showBookButton={showBookButton} onBook={onBook} />
      ) : (
        <CompactCard user={user} />
      )}
    </div>
  );
}

export type { FIFACardUser, FIFACardProps };
