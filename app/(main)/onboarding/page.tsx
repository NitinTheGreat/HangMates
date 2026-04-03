"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import { compressImage } from "@/lib/image-utils";
import {
  Camera,
  Cake,
  Film,
  BookOpen,
  Music,
  Coffee,
  Heart,
  MessageCircle,
  Dumbbell,
  Compass,
  Sparkles,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  ChevronLeft,
} from "lucide-react";

// ─── Progress Bar ────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 px-4">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < current;
        const isCurrent = step === current;
        const isUpcoming = step > current;

        return (
          <div key={step} className="flex items-center">
            {/* Circle */}
            <div
              className={`
                flex items-center justify-center rounded-full font-bold text-xs transition-all duration-300
                ${isCurrent ? "w-10 h-10 bg-primary text-white shadow-lg shadow-primary/30" : ""}
                ${isCompleted ? "w-8 h-8 bg-primary text-white" : ""}
                ${isUpcoming ? "w-8 h-8 border-2 border-text-muted text-text-muted" : ""}
              `}
            >
              {step}
            </div>
            {/* Connecting line */}
            {step < total && (
              <div
                className={`w-12 h-0.5 transition-colors duration-300 ${
                  step < current ? "bg-primary" : "bg-text-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Occasions data ─────────────────────────────────
const OCCASIONS = [
  { id: "birthday", label: "Birthday", icon: Cake },
  { id: "movieBuddy", label: "Movie Buddy", icon: Film },
  { id: "studyPartner", label: "Study Partner", icon: BookOpen },
  { id: "festivalSquad", label: "Festival Squad", icon: Music },
  { id: "chillHangout", label: "Chill Hangout", icon: Coffee },
  { id: "wingman", label: "Wingman", icon: Heart },
  { id: "justTalk", label: "Just Talk", icon: MessageCircle },
  { id: "gymCompanion", label: "Gym Companion", icon: Dumbbell },
  { id: "explore", label: "Explore City", icon: Compass },
  { id: "custom", label: "Custom", icon: Sparkles },
];

// ─── Schedule data ──────────────────────────────────
const DAYS = [
  { key: 1, label: "Mon" },
  { key: 2, label: "Tue" },
  { key: 3, label: "Wed" },
  { key: 4, label: "Thu" },
  { key: 5, label: "Fri" },
  { key: 6, label: "Sat" },
  { key: 0, label: "Sun" },
];

const TIME_BLOCKS = [
  { id: "morning", label: "Morning", start: "06:00", end: "12:00", icon: Sun },
  { id: "afternoon", label: "Afternoon", start: "12:00", end: "17:00", icon: CloudSun },
  { id: "evening", label: "Evening", start: "17:00", end: "21:00", icon: Sunset },
  { id: "night", label: "Night", start: "21:00", end: "00:00", icon: Moon },
];

// ─── Stats config ───────────────────────────────────
const STAT_KEYS = [
  { key: "humor", label: "Humor" },
  { key: "energy", label: "Energy" },
  { key: "chillFactor", label: "Chill Factor" },
  { key: "foodieScore", label: "Foodie Score" },
  { key: "hypeFactor", label: "Hype Factor" },
  { key: "empathy", label: "Empathy" },
  { key: "photography", label: "Photography" },
  { key: "conversationDepth", label: "Conversation Depth" },
  { key: "punctuality", label: "Punctuality" },
  { key: "adventure", label: "Adventure" },
];

// ─── Types ──────────────────────────────────────────
interface FormData {
  profileImage: string;
  name: string;
  age: number | "";
  gender: string;
  department: string;
  year: number | "";
  university: string;
  bio: string;
  stats: Record<string, number>;
  occasionTags: string[];
  schedule: Record<string, string[]>; // dayKey -> timeBlockIds
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [animDir, setAnimDir] = useState<"forward" | "back">("forward");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [validationMsg, setValidationMsg] = useState("");

  const [form, setForm] = useState<FormData>({
    profileImage: "",
    name: "",
    age: "",
    gender: "",
    department: "",
    year: "",
    university: "",
    bio: "",
    stats: Object.fromEntries(STAT_KEYS.map((s) => [s.key, 50])),
    occasionTags: [],
    schedule: {},
  });

  // Pre-fill from existing user data
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const { user } = await res.json();
          if (user) {
            setForm((prev) => ({
              ...prev,
              name: user.name || prev.name,
              profileImage: user.profileImage || prev.profileImage,
              age: user.age || prev.age,
              gender: user.gender || prev.gender,
              department: user.department || prev.department,
              year: user.year || prev.year,
              university: user.university || prev.university,
              bio: user.bio || prev.bio,
              stats: user.stats
                ? { ...prev.stats, ...user.stats }
                : prev.stats,
              occasionTags: user.occasionTags?.length
                ? user.occasionTags
                : prev.occasionTags,
            }));

            // Rebuild schedule from availability
            if (user.availability?.length) {
              const sched: Record<string, string[]> = {};
              for (const a of user.availability) {
                const dayKey = String(a.dayOfWeek);
                if (!sched[dayKey]) sched[dayKey] = [];
                const block = TIME_BLOCKS.find(
                  (b) => b.start === a.startTime && b.end === a.endTime
                );
                if (block && !sched[dayKey].includes(block.id)) {
                  sched[dayKey].push(block.id);
                }
              }
              setForm((prev) => ({ ...prev, schedule: sched }));
            }
          }
        }
      } catch {
        // ignore
      }
    }
    fetchUser();
  }, []);

  const handleNext = () => {
    setValidationMsg("");

    if (currentStep === 1) {
      if (!form.name.trim()) {
        setValidationMsg("Name is required");
        return;
      }
    }

    if (currentStep === 3) {
      if (form.occasionTags.length === 0) {
        setValidationMsg("Select at least 1 occasion");
        return;
      }
    }

    if (currentStep < 4) {
      setAnimDir("forward");
      setCurrentStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setAnimDir("back");
      setCurrentStep((s) => s - 1);
      setValidationMsg("");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImage(file, 500, 0.8);
      setForm((prev) => ({ ...prev, profileImage: base64 }));
    } catch (err: unknown) {
      setValidationMsg(err instanceof Error ? err.message : "Image upload failed");
    }
  };

  const toggleOccasion = (id: string) => {
    setForm((prev) => ({
      ...prev,
      occasionTags: prev.occasionTags.includes(id)
        ? prev.occasionTags.filter((t) => t !== id)
        : [...prev.occasionTags, id],
    }));
  };

  const toggleTimeBlock = (dayKey: string, blockId: string) => {
    setForm((prev) => {
      const dayBlocks = prev.schedule[dayKey] || [];
      const updated = dayBlocks.includes(blockId)
        ? dayBlocks.filter((b) => b !== blockId)
        : [...dayBlocks, blockId];
      return {
        ...prev,
        schedule: { ...prev.schedule, [dayKey]: updated },
      };
    });
  };

  const selectAllDays = (dayKeys: number[]) => {
    setForm((prev) => {
      const newSchedule = { ...prev.schedule };
      const allBlockIds = TIME_BLOCKS.map((b) => b.id);
      for (const d of dayKeys) {
        newSchedule[String(d)] = [...allBlockIds];
      }
      return { ...prev, schedule: newSchedule };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    // Build availability array
    const availability: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }> = [];
    for (const [dayKey, blockIds] of Object.entries(form.schedule)) {
      for (const blockId of blockIds) {
        const block = TIME_BLOCKS.find((b) => b.id === blockId);
        if (block) {
          availability.push({
            dayOfWeek: Number(dayKey),
            startTime: block.start,
            endTime: block.end,
            isAvailable: true,
          });
        }
      }
    }

    const payload = {
      name: form.name,
      age: form.age || undefined,
      gender: form.gender || undefined,
      department: form.department || undefined,
      year: form.year || undefined,
      university: form.university || undefined,
      bio: form.bio || undefined,
      profileImage: form.profileImage || undefined,
      stats: form.stats,
      occasionTags: form.occasionTags,
      availability,
      onboardingComplete: true,
      role: "both" as const,
    };

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }

      router.push("/profile");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  const animClass =
    animDir === "forward" ? "step-enter" : "step-enter-back";

  return (
    <div className="space-y-4 pb-8">
      <ProgressBar current={currentStep} total={4} />

      {/* Step content */}
      <div key={currentStep} className={animClass}>
        {currentStep === 1 && (
          <Step1
            form={form}
            setForm={setForm}
            onPhotoUpload={handlePhotoUpload}
          />
        )}
        {currentStep === 2 && <Step2 form={form} setForm={setForm} />}
        {currentStep === 3 && (
          <Step3 form={form} toggleOccasion={toggleOccasion} />
        )}
        {currentStep === 4 && (
          <Step4
            form={form}
            toggleTimeBlock={toggleTimeBlock}
            selectAllDays={selectAllDays}
          />
        )}
      </div>

      {/* Validation / Error messages */}
      {validationMsg && (
        <p className="text-error text-sm text-center">{validationMsg}</p>
      )}
      {error && <p className="text-error text-sm text-center">{error}</p>}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        {currentStep > 1 && (
          <GradientButton variant="outlined" onClick={handleBack} size="md">
            <ChevronLeft className="w-4 h-4" />
            Back
          </GradientButton>
        )}
        <GradientButton
          fullWidth
          onClick={handleNext}
          loading={isSubmitting}
          size="md"
        >
          {currentStep === 4 ? "Complete Setup" : "Continue"}
        </GradientButton>
      </div>
    </div>
  );
}

// ─── Step 1: Who are you? ───────────────────────────
function Step1({
  form,
  setForm,
  onPhotoUpload,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const update = (field: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      <h2 className="text-2xl font-bold text-text-primary mb-1">
        Who are you?
      </h2>
      <p className="text-text-secondary text-sm mb-6">
        Let&apos;s set up your HangMate identity.
      </p>

      <GlassCard className="space-y-4">
        {/* Profile photo */}
        <div className="flex justify-center">
          <label className="cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={onPhotoUpload}
              className="hidden"
            />
            <div className="w-[120px] h-[120px] rounded-full border-2 border-dashed border-glass-border group-hover:border-primary transition-colors flex items-center justify-center overflow-hidden bg-bg-surface">
              {form.profileImage ? (
                <img
                  src={form.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-text-muted group-hover:text-primary transition-colors" />
              )}
            </div>
            <p className="text-center text-text-muted text-xs mt-2">
              Tap to upload
            </p>
          </label>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs text-text-secondary uppercase tracking-wider mb-1 block">
            Name
          </label>
          <input
            type="text"
            className="glass-input"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>

        {/* Age + Gender row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wider mb-1 block">
              Age
            </label>
            <input
              type="number"
              className="glass-input"
              placeholder="18"
              min={16}
              max={35}
              value={form.age}
              onChange={(e) =>
                update("age", e.target.value ? Number(e.target.value) : "")
              }
            />
          </div>
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wider mb-1 block">
              Gender
            </label>
            <select
              className="glass-input"
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Department + Year row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wider mb-1 block">
              Department
            </label>
            <input
              type="text"
              className="glass-input"
              placeholder="Computer Science"
              value={form.department}
              onChange={(e) => update("department", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wider mb-1 block">
              Year
            </label>
            <select
              className="glass-input"
              value={form.year}
              onChange={(e) =>
                update("year", e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">Select</option>
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
              <option value={5}>5th Year</option>
              <option value={6}>Postgrad</option>
            </select>
          </div>
        </div>

        {/* University */}
        <div>
          <label className="text-xs text-text-secondary uppercase tracking-wider mb-1 block">
            University
          </label>
          <input
            type="text"
            className="glass-input"
            placeholder="SRM University"
            value={form.university}
            onChange={(e) => update("university", e.target.value)}
          />
        </div>

        {/* Bio */}
        <div>
          <label className="text-xs text-text-secondary uppercase tracking-wider mb-1 block">
            Bio
          </label>
          <textarea
            className="glass-input"
            placeholder="Tell people what makes you a great HangMate..."
            maxLength={200}
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
          />
          <p className="text-right text-text-muted text-xs mt-1">
            {form.bio.length}/200
          </p>
        </div>
      </GlassCard>
    </>
  );
}

// ─── Step 2: Set your vibe ──────────────────────────
function Step2({
  form,
  setForm,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const updateStat = (key: string, value: number) => {
    setForm((prev) => ({
      ...prev,
      stats: { ...prev.stats, [key]: value },
    }));
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-text-primary mb-1">
        Set your vibe
      </h2>
      <p className="text-text-secondary text-sm mb-6">
        Rate yourself honestly — these evolve based on reviews later.
      </p>

      <GlassCard className="space-y-5">
        {STAT_KEYS.map((stat) => (
          <div key={stat.key}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase text-text-secondary tracking-widest font-medium">
                {stat.label}
              </span>
              <span className="text-sm font-bold text-primary">
                {form.stats[stat.key]}
              </span>
            </div>
            <input
              type="range"
              className="vibe-slider"
              min={0}
              max={100}
              step={5}
              value={form.stats[stat.key]}
              onChange={(e) => updateStat(stat.key, Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, #FF6B35 0%, #FF3F6C ${form.stats[stat.key]}%, rgba(255,255,255,0.06) ${form.stats[stat.key]}%)`,
              }}
            />
          </div>
        ))}
        <p className="text-text-muted text-xs text-center pt-2">
          Don&apos;t worry, you can change these anytime from your profile.
        </p>
      </GlassCard>
    </>
  );
}

// ─── Step 3: Pick your occasions ────────────────────
function Step3({
  form,
  toggleOccasion,
}: {
  form: FormData;
  toggleOccasion: (id: string) => void;
}) {
  return (
    <>
      <h2 className="text-2xl font-bold text-text-primary mb-1">
        Pick your occasions
      </h2>
      <p className="text-text-secondary text-sm mb-6">
        What are you available for? Select all that apply.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {OCCASIONS.map((occ) => {
          const selected = form.occasionTags.includes(occ.id);
          const Icon = occ.icon;
          return (
            <button
              key={occ.id}
              onClick={() => toggleOccasion(occ.id)}
              className={`
                glass p-4 rounded-xl flex flex-col items-center justify-center gap-2 min-h-[80px]
                transition-all duration-200 active:scale-95
                ${
                  selected
                    ? "border-2 border-primary bg-[rgba(255,107,53,0.05)] shadow-[0_0_20px_rgba(255,107,53,0.2)]"
                    : "border border-glass-border hover:bg-bg-surface-hover"
                }
              `}
            >
              <Icon
                className={`w-6 h-6 ${
                  selected ? "text-primary" : "text-text-secondary"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  selected ? "text-primary" : "text-text-secondary"
                }`}
              >
                {occ.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

// ─── Step 4: Set your schedule ──────────────────────
function Step4({
  form,
  toggleTimeBlock,
  selectAllDays,
}: {
  form: FormData;
  toggleTimeBlock: (dayKey: string, blockId: string) => void;
  selectAllDays: (dayKeys: number[]) => void;
}) {
  return (
    <>
      <h2 className="text-2xl font-bold text-text-primary mb-1">
        Set your schedule
      </h2>
      <p className="text-text-secondary text-sm mb-6">
        When are you free to hang?
      </p>

      <GlassCard className="space-y-3">
        {DAYS.map((day) => (
          <div key={day.key} className="flex items-center gap-2">
            <span className="w-10 text-sm text-text-secondary font-medium">
              {day.label}
            </span>
            <div className="flex gap-1.5 flex-1">
              {TIME_BLOCKS.map((block) => {
                const dayKey = String(day.key);
                const isSelected = form.schedule[dayKey]?.includes(block.id);
                const Icon = block.icon;
                return (
                  <button
                    key={block.id}
                    onClick={() => toggleTimeBlock(dayKey, block.id)}
                    className={`
                      flex-1 flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[10px] font-medium
                      transition-all duration-150
                      ${
                        isSelected
                          ? "bg-primary text-white shadow-sm shadow-primary/20"
                          : "bg-bg-surface text-text-muted hover:text-text-secondary"
                      }
                    `}
                    title={`${block.start}-${block.end}`}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{block.label.slice(0, 3)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </GlassCard>

      {/* Quick toggles */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => selectAllDays([1, 2, 3, 4, 5])}
          className="flex-1 glass px-3 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-primary hover:border-primary/30 transition-colors"
        >
          Select All Weekdays
        </button>
        <button
          onClick={() => selectAllDays([0, 6])}
          className="flex-1 glass px-3 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-primary hover:border-primary/30 transition-colors"
        >
          Select All Weekends
        </button>
      </div>
    </>
  );
}
