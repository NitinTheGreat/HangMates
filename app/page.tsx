import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Logo from "@/components/shared/Logo";
import GradientButton from "@/components/ui/GradientButton";
import { Sparkles, Users, Calendar } from "lucide-react";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/home");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-base px-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-tertiary/15 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-[160px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <Logo size="lg" />
        </div>

        {/* Tagline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight mb-4">
          Never Hang{" "}
          <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
            Alone.
          </span>
        </h1>

        <p className="text-text-secondary text-lg leading-relaxed mb-10 max-w-sm">
          Rent friends for any occasion. From birthdays to study sessions
          — find your vibe.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <div className="glass px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-text-secondary">Vibe Matching</span>
          </div>
          <div className="glass px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-text-secondary">Squad Booking</span>
          </div>
          <div className="glass px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-tertiary" />
            <span className="text-text-secondary">Any Occasion</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <Link href="/sign-up" className="flex-1">
            <GradientButton fullWidth size="lg">
              Get Started
            </GradientButton>
          </Link>
          <Link href="/sign-in" className="flex-1">
            <GradientButton variant="outlined" fullWidth size="lg">
              Sign In
            </GradientButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
