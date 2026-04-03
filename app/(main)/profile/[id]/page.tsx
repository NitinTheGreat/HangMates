import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import GlassCard from "@/components/ui/GlassCard";
import FIFACard from "@/components/cards/FIFACard";
import RadarChart from "@/components/cards/RadarChart";
import {
  Star,
  Calendar,
  Clock,
  Users,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  PartyPopper,
  Laugh,
  Ear,
  Cake,
  Camera,
  Zap,
  Lightbulb,
  RefreshCw,
  HeartHandshake,
  Mountain,
  Shirt,
  Diamond,
} from "lucide-react";

const BADGE_ICONS: Record<string, React.ElementType> = {
  "Life of the Party": PartyPopper,
  "Made Me Laugh": Laugh,
  "Best Listener": Ear,
  "Showed Up With Cake": Cake,
  "Photography God": Camera,
  "Hype Machine": Zap,
  "Gave Great Advice": Lightbulb,
  "Would Book Again": RefreshCw,
  "Great Listener": HeartHandshake,
  "Adventure Seeker": Mountain,
  "Fashion Icon": Shirt,
  "Hidden Gem": Diamond,
};

const TIME_BLOCK_ICONS: Record<string, React.ElementType> = {
  "06:00": Sun,
  "12:00": CloudSun,
  "17:00": Sunset,
  "21:00": Moon,
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const OCCASION_LABELS: Record<string, string> = {
  birthday: "Birthday",
  movieBuddy: "Movie Buddy",
  studyPartner: "Study Partner",
  festivalSquad: "Festival Squad",
  chillHangout: "Chill Hangout",
  wingman: "Wingman",
  justTalk: "Just Talk",
  gymCompanion: "Gym Companion",
  explore: "Explore City",
  custom: "Custom",
};

export default async function OtherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  await connectToDatabase();
  const user = await User.findById(id);

  if (!user) notFound();

  const plainUser = JSON.parse(JSON.stringify(user));

  const availGrid: Record<number, string[]> = {};
  if (user.availability) {
    for (const a of user.availability) {
      if (!availGrid[a.dayOfWeek]) availGrid[a.dayOfWeek] = [];
      availGrid[a.dayOfWeek].push(a.startTime);
    }
  }

  return (
    <div className="space-y-4 pb-28">
      {/* FIFA Card */}
      <FIFACard user={plainUser} variant="full" showBookButton={false} />

      {/* Radar */}
      <RadarChart stats={plainUser.stats || {}} />

      {/* About */}
      {plainUser.bio && (
        <GlassCard>
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-2">
            About
          </h2>
          <p className="text-text-primary text-sm leading-relaxed">
            {plainUser.bio}
          </p>
        </GlassCard>
      )}

      {/* Badges */}
      <GlassCard>
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
          Badges Earned
        </h2>
        {!plainUser.badges?.length ? (
          <p className="text-text-muted text-sm">No badges yet</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {plainUser.badges.map(
              (badge: { badgeType: string; count: number }, i: number) => {
                const Icon = BADGE_ICONS[badge.badgeType] || Star;
                return (
                  <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className="relative w-14 h-14 rounded-full glass flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                      {badge.count > 1 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                          {badge.count}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-text-muted text-center max-w-[60px] truncate">
                      {badge.badgeType}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        )}
      </GlassCard>

      {/* Availability */}
      <GlassCard>
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
          Availability
        </h2>
        <div className="space-y-2">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <div key={day} className="flex items-center gap-2">
              <span className="w-10 text-xs text-text-secondary font-medium">
                {DAY_LABELS[day]}
              </span>
              <div className="flex gap-1.5 flex-1">
                {["06:00", "12:00", "17:00", "21:00"].map((time) => {
                  const isActive = availGrid[day]?.includes(time);
                  const Icon = TIME_BLOCK_ICONS[time] || Sun;
                  return (
                    <div
                      key={time}
                      className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-medium ${
                        isActive ? "bg-primary text-white" : "bg-bg-surface text-text-muted"
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Occasions */}
      {plainUser.occasionTags?.length > 0 && (
        <GlassCard>
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
            Available For
          </h2>
          <div className="flex flex-wrap gap-2">
            {plainUser.occasionTags.map((tag: string) => (
              <span
                key={tag}
                className="bg-bg-surface text-primary text-xs font-medium px-3 py-1.5 rounded-full"
              >
                {OCCASION_LABELS[tag] || tag}
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Reviews */}
      <GlassCard>
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
          Reviews
        </h2>
        <p className="text-text-muted text-sm">No reviews yet</p>
      </GlassCard>

      {/* Squad */}
      {plainUser.squadId && (
        <Link href={`/squads/${plainUser.squadId}`}>
          <GlassCard hover className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-text-primary">
                View Squad
              </h3>
              <p className="text-text-muted text-xs">See their squad →</p>
            </div>
          </GlassCard>
        </Link>
      )}

      {/* Stats */}
      <GlassCard>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-lg font-bold">{plainUser.totalBookings || 0}</span>
            </div>
            <span className="text-text-muted text-xs">Bookings</span>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-secondary mb-1">
              <Star className="w-4 h-4" />
              <span className="text-lg font-bold">{plainUser.rating?.toFixed(1) || "0.0"}</span>
            </div>
            <span className="text-text-muted text-xs">Rating</span>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-tertiary mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-lg font-bold">
                {new Date(plainUser.createdAt).toLocaleDateString("en", { month: "short", year: "2-digit" })}
              </span>
            </div>
            <span className="text-text-muted text-xs">Joined</span>
          </div>
        </div>
      </GlassCard>

      {/* Sticky Book CTA */}
      <div className="fixed bottom-[72px] left-0 right-0 z-40">
        <div className="mx-auto max-w-[430px] p-4">
          <Link href={`/book/${plainUser._id}`}>
            <button className="w-full gradient-button text-white font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-primary/30">
              Book This Friend · {plainUser.ratePerHour} FC/hr
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
