import React from "react";
import { useSearchParams } from "react-router-dom";
import { Waves, TreePine, Castle, Building2, Mountain, Sparkles, LucideIcon } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = { Waves, TreePine, Castle, Building2, Mountain };

export interface CategoryChipsProps {
  active?: string;
  onSelect?: (category: string) => void;
  className?: string;
}

export default function CategoryChips({ active, onSelect, className }: CategoryChipsProps) {
  const [params] = useSearchParams();
  const current = active ?? params.get("category") ?? "All";

  return (
    <div className={cn("no-scrollbar flex gap-2.5 overflow-x-auto pb-1", className)}>
      <Chip label="All" active={current === "All"} onClick={() => onSelect?.("All")} />
      {CATEGORIES.map((c) => {
        const Icon = ICONS[c.icon] ?? Sparkles;
        return (
          <Chip
            key={c.id}
            label={c.label}
            icon={<Icon size={15} />}
            active={current.toLowerCase() === c.id.toLowerCase()}
            onClick={() => onSelect?.(c.id)}
          />
        );
      })}
    </div>
  );
}

interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

function Chip({ label, icon, active, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-foreground/70 hover:border-foreground/40 hover:bg-secondary"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
