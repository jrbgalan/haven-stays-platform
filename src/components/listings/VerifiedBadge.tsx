import React, { useState } from "react";
import { ShieldCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export default function VerifiedBadge({ className, size = "sm" }: VerifiedBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowTooltip((prev) => !prev);
        }}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-champagne/40 bg-champagne/15 backdrop-blur-md transition-colors hover:bg-champagne/25",
          size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
          className
        )}
      >
        <ShieldCheck
          size={size === "sm" ? 12 : 14}
          className="text-champagne-dark dark:text-champagne-light shrink-0"
        />
        <span className="font-semibold tracking-wide text-foreground">Haven Verified</span>
        <Info size={10} className="text-muted-foreground opacity-70" />
      </div>

      {showTooltip && (
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="absolute bottom-full left-0 z-50 mb-2 w-72 rounded-2xl border border-border bg-popover/95 p-3.5 shadow-2xl backdrop-blur-xl animate-fade-in text-left pointer-events-auto"
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <ShieldCheck size={14} className="text-champagne-dark dark:text-champagne-light" />
            <span>Haven Luxury Verification</span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            Hand-inspected across 140+ luxury standards including acoustic serenity, bespoke bedding, and 24/7 dedicated concierge protection.
          </p>
          <div className="mt-2.5 flex items-center justify-between border-t border-border/60 pt-2 text-[10px] text-champagne-dark dark:text-champagne-light font-medium">
            <span>✓ In-person audit</span>
            <span>✓ 100% linen grade</span>
            <span>✓ Host certified</span>
          </div>
        </div>
      )}
    </div>
  );
}

