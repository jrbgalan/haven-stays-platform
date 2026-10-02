import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  value?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  count?: number;
}

export default function StarRating({
  value = 0,
  size = 14,
  className = "",
  showValue = false,
  count,
}: StarRatingProps) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= Math.floor(rounded);
          const half = !filled && i - 0.5 === rounded;
          return (
            <span key={i} className="relative">
              <Star size={size} className="text-foreground/20" strokeWidth={1.5} />
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? "100%" : "50%" }}
                >
                  <Star size={size} className="text-accent fill-accent" strokeWidth={1.5} />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-foreground tabular-nums">
          {value > 0 ? value.toFixed(1) : "New"}
        </span>
      )}
      {count != null && (
        <span className="text-sm text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
