"use client";

import { cn } from "@/lib/utils";
import { User as UserIcon } from "lucide-react";

interface FIFACardMiniProps {
  user: {
    _id: string;
    name: string;
    department?: string;
    profileImage?: string;
    isOnline?: boolean;
    ratePerHour?: number;
  };
  action?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function FIFACardMini({
  user,
  action,
  className,
  onClick,
}: FIFACardMiniProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass flex items-center gap-3 p-3 rounded-xl",
        onClick && "cursor-pointer hover:bg-bg-surface-hover transition-colors",
        className
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-tertiary/30 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-text-muted" />
          </div>
        )}
        {user.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-online-green border-2 border-bg-base" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-text-primary truncate">
          {user.name}
        </h4>
        {user.department && (
          <p className="text-xs text-text-secondary truncate">
            {user.department}
          </p>
        )}
      </div>

      {/* Rate or Action */}
      {action ? (
        action
      ) : user.ratePerHour ? (
        <div className="flex-shrink-0 glass px-2.5 py-1 rounded-full">
          <span className="text-xs font-bold text-primary">
            {user.ratePerHour}
          </span>
          <span className="text-[10px] text-text-secondary ml-0.5">FC</span>
        </div>
      ) : null}
    </div>
  );
}
