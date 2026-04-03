import GlassCard from "@/components/ui/GlassCard";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="glass flex items-center gap-3 px-4 py-3 rounded-2xl">
        <SearchIcon className="w-5 h-5 text-text-muted" />
        <input
          type="text"
          placeholder="Search mates, squads, occasions..."
          className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-sm"
          disabled
        />
        <button className="w-9 h-9 rounded-xl bg-bg-surface-hover flex items-center justify-center">
          <SlidersHorizontal className="w-4 h-4 text-text-secondary" />
        </button>
      </div>

      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
            <SearchIcon className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Vibe Matching
            </h2>
            <p className="text-text-secondary text-sm">Coming in Phase 3</p>
          </div>
        </div>
        <p className="text-text-muted text-sm">
          Find mates based on vibe stats, occasion type, availability, and
          location. Advanced filters coming soon.
        </p>
      </GlassCard>
    </div>
  );
}
