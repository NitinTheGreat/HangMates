import GlassCard from "@/components/ui/GlassCard";
import { Users } from "lucide-react";
import Link from "next/link";
import GradientButton from "@/components/ui/GradientButton";

export default async function SquadBookingPlaceholder({
  params,
}: {
  params: Promise<{ squadId: string }>;
}) {
  const { squadId } = await params;

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <GlassCard className="text-center py-10 max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-tertiary/20 mx-auto mb-4 flex items-center justify-center">
          <Users className="w-8 h-8 text-tertiary" />
        </div>
        <h1 className="text-xl font-bold text-text-primary mb-2">
          Squad Booking
        </h1>
        <p className="text-text-secondary text-sm mb-6">
          Squad booking is coming in Phase 4. Stay tuned!
        </p>
        <Link href={`/squads/${squadId}`}>
          <GradientButton variant="outlined">Go Back</GradientButton>
        </Link>
      </GlassCard>
    </div>
  );
}
