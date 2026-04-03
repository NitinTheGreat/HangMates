import GlassCard from "@/components/ui/GlassCard";
import { Compass, Sparkles, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-4">
      {/* Welcome banner */}
      <div className="gradient-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <h1 className="text-2xl font-bold text-white mb-1">Welcome back! 👋</h1>
        <p className="text-white/80 text-sm">
          Find your perfect hangout companion
        </p>
      </div>

      {/* Discovery section */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Discovery Feed
            </h2>
            <p className="text-text-secondary text-sm">Coming in Phase 2</p>
          </div>
        </div>
        <p className="text-text-muted text-sm">
          Browse nearby mates, filter by occasion, and discover your perfect
          hangout partner.
        </p>
      </GlassCard>

      {/* Trending */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-tertiary/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-tertiary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Trending Now
            </h2>
            <p className="text-text-secondary text-sm">Coming in Phase 2</p>
          </div>
        </div>
        <p className="text-text-muted text-sm">
          See who&apos;s popular on campus and check out top-rated mates.
        </p>
      </GlassCard>

      {/* Quick actions */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Vibe Matching
            </h2>
            <p className="text-text-secondary text-sm">Coming in Phase 3</p>
          </div>
        </div>
        <p className="text-text-muted text-sm">
          AI-powered matching based on your personality stats and preferences.
        </p>
      </GlassCard>
    </div>
  );
}
