import GlassCard from "@/components/ui/GlassCard";
import { ClipboardList } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="space-y-4">
      <GlassCard className="py-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 mx-auto mb-4 flex items-center justify-center">
            <ClipboardList className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Onboarding
          </h1>
          <p className="text-text-secondary text-sm max-w-xs mx-auto">
            Coming in Phase 2 — Set up your vibe stats, profile details,
            availability, and preferences.
          </p>
        </div>
      </GlassCard>

      {/* Preview of steps */}
      <div className="space-y-3">
        {[
          { step: 1, title: "Basic Info", desc: "Name, age, university" },
          { step: 2, title: "Vibe Stats", desc: "Set your personality traits" },
          { step: 3, title: "Availability", desc: "When can you hang?" },
          { step: 4, title: "Occasion Tags", desc: "What do you enjoy?" },
        ].map((item) => (
          <GlassCard key={item.step} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-bg-surface-hover flex items-center justify-center text-text-muted font-bold text-sm">
              {item.step}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                {item.title}
              </h3>
              <p className="text-text-muted text-xs">{item.desc}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
