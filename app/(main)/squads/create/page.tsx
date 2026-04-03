"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import FIFACardMini from "@/components/cards/FIFACardMini";
import { compressImage } from "@/lib/image-utils";
import {
  ImagePlus,
  Search,
  Plus,
  X,
  Users,
} from "lucide-react";

interface SearchUser {
  _id: string;
  name: string;
  department?: string;
  profileImage?: string;
  isOnline?: boolean;
  ratePerHour?: number;
  university?: string;
  squadId?: string;
}

export default function CreateSquadPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [ratePerHour, setRatePerHour] = useState(50);
  const [selectedMembers, setSelectedMembers] = useState<SearchUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<SearchUser | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch current user
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const { user } = await res.json();
          setCurrentUser(user);
          setSelectedMembers([user]); // Auto-include creator
        }
      } catch {}
    }
    fetchMe();
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const params = new URLSearchParams({
          search: searchQuery,
          excludeSquad: "true",
          limit: "10",
        });
        if (currentUser?.university) {
          params.set("university", currentUser.university);
        }
        const res = await fetch(`/api/users?${params}`);
        if (res.ok) {
          const { users } = await res.json();
          // Exclude already-selected members
          const selectedIds = selectedMembers.map((m) => m._id);
          setSearchResults(
            users.filter((u: SearchUser) => !selectedIds.includes(u._id))
          );
        }
      } catch {}
      setIsSearching(false);
    }, 300);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery, currentUser?.university, selectedMembers]);

  const addMember = (user: SearchUser) => {
    if (selectedMembers.length >= 10) return;
    if (user.squadId) return;
    setSelectedMembers((prev) => [...prev, user]);
    setSearchResults((prev) => prev.filter((u) => u._id !== user._id));
    setSearchQuery("");
  };

  const removeMember = (userId: string) => {
    if (userId === currentUser?._id) return; // Can't remove creator
    setSelectedMembers((prev) => prev.filter((m) => m._id !== userId));
  };

  const handleBannerUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImage(file, 1200, 0.8);
      setBannerImage(base64);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!name.trim()) {
      setError("Squad name is required");
      return;
    }
    if (selectedMembers.length < 2) {
      setError("Add at least 1 more member");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/squads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          tagline: tagline.trim() || undefined,
          bannerImage: bannerImage || undefined,
          ratePerHour,
          memberIds: selectedMembers
            .filter((m) => m._id !== currentUser?._id)
            .map((m) => m._id),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create squad");
      }

      const { squad } = await res.json();
      router.push(`/squads/${squad._id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pb-8">
      <h1 className="text-2xl font-bold text-text-primary">
        Create Your Squad
      </h1>

      {/* Squad Info */}
      <GlassCard className="space-y-4">
        {/* Banner */}
        <div>
          <label className="text-xs text-text-secondary uppercase tracking-wider mb-1 block">
            Banner Image
          </label>
          <label className="cursor-pointer block">
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="hidden"
            />
            <div className="aspect-video rounded-xl border-2 border-dashed border-glass-border hover:border-primary transition-colors flex items-center justify-center overflow-hidden bg-bg-surface">
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-text-muted">
                  <ImagePlus className="w-8 h-8" />
                  <span className="text-xs">Upload banner (16:9)</span>
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs text-text-secondary uppercase tracking-wider mb-1 block">
            Squad Name
          </label>
          <input
            type="text"
            className="glass-input"
            placeholder="The Vibe Squad"
            maxLength={30}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="text-right text-text-muted text-xs mt-1">
            {name.length}/30
          </p>
        </div>

        {/* Tagline */}
        <div>
          <label className="text-xs text-text-secondary uppercase tracking-wider mb-1 block">
            Tagline
          </label>
          <input
            type="text"
            className="glass-input"
            placeholder="e.g., The Vibe Masters"
            maxLength={60}
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>

        {/* Rate */}
        <div>
          <label className="text-xs text-text-secondary uppercase tracking-wider mb-1 block">
            Rate Per Hour (FC)
          </label>
          <input
            type="number"
            className="glass-input"
            min={10}
            max={500}
            value={ratePerHour}
            onChange={(e) => setRatePerHour(Number(e.target.value))}
          />
        </div>
      </GlassCard>

      {/* Add Members */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">
            Add Members
          </h2>
          <span className="text-xs text-text-muted">
            ({selectedMembers.length}/10)
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            className="glass-input pl-10"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={selectedMembers.length >= 10}
          />
        </div>

        {/* Search results */}
        {searchResults.length > 0 && (
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {searchResults.map((user) => (
              <FIFACardMini
                key={user._id}
                user={user}
                action={
                  user.squadId ? (
                    <span className="text-[10px] text-text-muted">
                      In a squad
                    </span>
                  ) : (
                    <button
                      onClick={() => addMember(user)}
                      className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-primary" />
                    </button>
                  )
                }
              />
            ))}
          </div>
        )}

        {isSearching && (
          <p className="text-text-muted text-xs text-center">Searching...</p>
        )}

        {/* Selected members */}
        {selectedMembers.length > 0 && (
          <div>
            <h3 className="text-xs text-text-secondary uppercase tracking-wider mb-2">
              Selected Members
            </h3>
            <div className="space-y-2">
              {selectedMembers.map((member) => (
                <FIFACardMini
                  key={member._id}
                  user={member}
                  action={
                    member._id === currentUser?._id ? (
                      <span className="text-[10px] text-primary font-medium">
                        Creator
                      </span>
                    ) : (
                      <button
                        onClick={() => removeMember(member._id)}
                        className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center hover:bg-error/30 transition-colors"
                      >
                        <X className="w-4 h-4 text-error" />
                      </button>
                    )
                  }
                />
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Error */}
      {error && <p className="text-error text-sm text-center">{error}</p>}

      {/* Submit */}
      <GradientButton
        fullWidth
        size="lg"
        onClick={handleSubmit}
        loading={isSubmitting}
      >
        <Users className="w-5 h-5" />
        Create Squad
      </GradientButton>
    </div>
  );
}
