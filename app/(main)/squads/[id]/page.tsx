import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import connectToDatabase from "@/lib/db";
import Squad from "@/models/Squad";
import User from "@/models/User";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import FIFACard from "@/components/cards/FIFACard";
import type { FIFACardUser } from "@/components/cards/FIFACard";
import {
  Star,
  Users,
  Pencil,
  Trash2,
} from "lucide-react";

export default async function SquadProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  await connectToDatabase();

  const squad = await Squad.findById(id)
    .populate(
      "members",
      "name age profileImage bio role stats isOnline ratePerHour occasionTags totalBookings rating badges department"
    )
    .populate("creatorId", "name profileImage");

  if (!squad || !squad.isActive) notFound();

  const currentUser = await User.findOne({ clerkId: userId });
  const isCreator =
    currentUser &&
    squad.creatorId._id.toString() === currentUser._id.toString();

  const plainSquad = JSON.parse(JSON.stringify(squad));
  const members = plainSquad.members || [];

  return (
    <div className="space-y-4 pb-8">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden">
        {plainSquad.bannerImage ? (
          <img
            src={plainSquad.bannerImage}
            alt={plainSquad.name}
            className="w-full aspect-video object-cover"
          />
        ) : (
          <div className="w-full aspect-video bg-gradient-to-br from-primary/40 to-tertiary/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-extrabold text-white drop-shadow-lg">
            {plainSquad.name}
          </h1>
          {plainSquad.tagline && (
            <p className="text-secondary text-sm font-medium mt-1">
              {plainSquad.tagline}
            </p>
          )}
        </div>

        {/* Creator actions */}
        {isCreator && (
          <div className="absolute top-3 right-3 flex gap-2">
            <Link
              href={`/squads/create`}
              className="glass-strong w-9 h-9 rounded-full flex items-center justify-center hover:bg-bg-surface-hover transition-colors"
            >
              <Pencil className="w-4 h-4 text-text-secondary" />
            </Link>
          </div>
        )}
      </div>

      {/* Synergy badge */}
      <div className="flex justify-center -mt-8 relative z-10">
        <div className="glass-strong rounded-full w-20 h-20 flex flex-col items-center justify-center border-2 border-primary/30 shadow-lg shadow-primary/10">
          <span className="text-[9px] text-text-secondary uppercase tracking-widest font-medium">
            Synergy
          </span>
          <span className="text-2xl font-extrabold text-primary leading-none">
            {Math.round(plainSquad.squadSynergy || 0)}
          </span>
        </div>
      </div>

      {/* Members */}
      <GlassCard>
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
          Members ({members.length})
        </h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
          {members.map((member: Record<string, unknown>) => (
            <Link
              key={member._id as string}
              href={`/profile/${member._id}`}
              className="flex-shrink-0 w-[280px]"
            >
              <FIFACard
                user={member as unknown as FIFACardUser}
                variant="full"
                showBookButton={false}
              />
            </Link>
          ))}
        </div>
      </GlassCard>

      {/* Badges */}
      <GlassCard>
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
          Squad Badges
        </h2>
        {(!plainSquad.badges || plainSquad.badges.length === 0) ? (
          <p className="text-text-muted text-sm">
            No squad badges yet — complete bookings as a squad to earn them!
          </p>
        ) : (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {plainSquad.badges.map(
              (badge: { badgeType: string; count: number }, i: number) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="relative w-14 h-14 rounded-full glass flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary" />
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
              )
            )}
          </div>
        )}
      </GlassCard>

      {/* Reviews */}
      <GlassCard>
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
          Reviews
        </h2>
        <p className="text-text-muted text-sm">No reviews yet</p>
      </GlassCard>

      {/* Stats */}
      <GlassCard>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="text-lg font-bold text-primary">
              {plainSquad.totalBookings || 0}
            </span>
            <p className="text-text-muted text-xs mt-0.5">Bookings</p>
          </div>
          <div>
            <span className="text-lg font-bold text-secondary">
              {plainSquad.overallRating?.toFixed(1) || "0.0"}
            </span>
            <p className="text-text-muted text-xs mt-0.5">Rating</p>
          </div>
          <div>
            <span className="text-lg font-bold text-tertiary">
              {plainSquad.ratePerHour || 50}
            </span>
            <p className="text-text-muted text-xs mt-0.5">FC/hr</p>
          </div>
        </div>
      </GlassCard>

      {/* Booking CTAs */}
      <div className="flex gap-3">
        <Link href={`/book/squad/${plainSquad._id}`} className="flex-1">
          <GradientButton fullWidth>Book Full Squad</GradientButton>
        </Link>
      </div>

      {/* Creator: Delete */}
      {isCreator && (
        <GlassCard className="border-error/20">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-error flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-text-primary">
                Delete Squad
              </h3>
              <p className="text-text-muted text-xs">
                This action cannot be undone
              </p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
