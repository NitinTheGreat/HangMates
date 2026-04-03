import GlassCard from "@/components/ui/GlassCard";
import { Calendar } from "lucide-react";
import Link from "next/link";
import GradientButton from "@/components/ui/GradientButton";

export default async function BookingPlaceholder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <GlassCard className="text-center py-10 max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 mx-auto mb-4 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-text-primary mb-2">
          Booking Flow
        </h1>
        <p className="text-text-secondary text-sm mb-6">
          The booking system is coming in Phase 4. Stay tuned!
        </p>
        <Link href={`/profile/${id}`}>
          <GradientButton variant="outlined">Go Back</GradientButton>
        </Link>
      </GlassCard>
    </div>
  );
}
