import GlassCard from "@/components/ui/GlassCard";
import { Users, MapPin } from "lucide-react";

export default function HangoutsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-text-primary">Open Hangouts</h1>
        <div className="glass px-3 py-1.5 rounded-full text-xs text-text-secondary">
          0 live
        </div>
      </div>

      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Open Hangouts
            </h2>
            <p className="text-text-secondary text-sm">Coming in Phase 4</p>
          </div>
        </div>
        <p className="text-text-muted text-sm">
          Host or join public hangouts on campus. Meet new people, explore
          together, and build your squad.
        </p>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-tertiary/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-tertiary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Nearby Events
            </h2>
            <p className="text-text-secondary text-sm">Coming in Phase 4</p>
          </div>
        </div>
        <p className="text-text-muted text-sm">
          Discover hangouts happening near you with live location tracking.
        </p>
      </GlassCard>
    </div>
  );
}
