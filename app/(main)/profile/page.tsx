import { getCurrentUser } from "@/lib/auth";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import CoinBadge from "@/components/ui/CoinBadge";
import Link from "next/link";
import { User, Mail, Star, Calendar } from "lucide-react";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-4">
      {/* Profile header */}
      <GlassCard className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-tertiary mx-auto mb-4 flex items-center justify-center">
          <User className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-xl font-bold text-text-primary mb-1">
          {user?.name ?? "Loading..."}
        </h1>
        <p className="text-text-secondary text-sm flex items-center justify-center gap-1">
          <Mail className="w-3.5 h-3.5" />
          {user?.email ?? "—"}
        </p>

        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="text-center">
            <CoinBadge balance={user?.friendCoins ?? 0} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="glass px-3 py-2 rounded-xl text-center">
            <div className="flex items-center gap-1 text-secondary">
              <Star className="w-3.5 h-3.5" />
              <span className="text-sm font-semibold">
                {user?.rating?.toFixed(1) ?? "0.0"}
              </span>
            </div>
            <span className="text-text-muted text-xs">Rating</span>
          </div>
          <div className="glass px-3 py-2 rounded-xl text-center">
            <div className="flex items-center gap-1 text-primary">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-sm font-semibold">
                {user?.totalBookings ?? 0}
              </span>
            </div>
            <span className="text-text-muted text-xs">Bookings</span>
          </div>
        </div>
      </GlassCard>

      {/* Complete profile CTA */}
      {user && !user.onboardingComplete && (
        <GlassCard className="border-primary/30">
          <p className="text-text-secondary text-sm mb-3">
            Complete your profile to start getting discovered by renters!
          </p>
          <Link href="/onboarding">
            <GradientButton fullWidth>Complete Profile</GradientButton>
          </Link>
        </GlassCard>
      )}

      {/* Role badge */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Your Role
        </h2>
        <div className="flex gap-2">
          {["mate", "renter", "both"].map((role) => (
            <div
              key={role}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                user?.role === role
                  ? "gradient-button text-white"
                  : "glass text-text-muted"
              }`}
            >
              {role}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
