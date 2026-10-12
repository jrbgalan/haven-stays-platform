import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toISODate, todayISO } from "@/lib/format";
import { cn } from "@/lib/utils";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["S", "M", "T", "W", "T", "F", "S"];

export default function DateRangePicker({ bookedRanges = [], checkIn, checkOut, onChange, minNights = 1 }) {
  const today = todayISO();
  const [view, setView] = useState(() => {
    const d = checkIn ? new Date(checkIn) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const disabledSet = useMemo(() => {
    const s = new Set();
    for (const r of bookedRanges) {
      if (!r?.checkIn || !r?.checkOut) continue;
      const cur = new Date(r.checkIn);
      const end = new Date(r.checkOut);
      while (cur < end) {
        s.add(toISODate(cur));
        cur.setDate(cur.getDate() + 1);
      }
    }
    return s;
  }, [bookedRanges]);

  const isDisabled = (iso) => iso < today || disabledSet.has(iso);

  const hasBookedBetween = (start, end) => {
    const cur = new Date(start);
    cur.setDate(cur.getDate() + 1);
    while (cur < new Date(end)) {
      if (disabledSet.has(toISODate(cur))) return true;
      cur.setDate(cur.getDate() + 1);
    }
    return false;
  };

  const handleClick = (iso) => {
    if (isDisabled(iso)) return;
    if (!checkIn || (checkIn && checkOut)) {
      onChange(iso, null);
      return;
    }
    if (iso <= checkIn) {
      onChange(iso, null);
      return;
    }
    if (hasBookedBetween(checkIn, iso)) {
      onChange(iso, null);
      return;
    }
    onChange(checkIn, iso);
  };

  const months = [view, new Date(view.getFullYear(), view.getMonth() + 1, 1)];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} aria-label="Previous month" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary">
          <ChevronLeft size={16} />
        </button>
        <button onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} aria-label="Next month" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="no-scrollbar flex gap-6 overflow-x-auto sm:gap-10">
        {months.map((m, mi) => (
          <MonthGrid
            key={mi}
            month={m}
            checkIn={checkIn}
            checkOut={checkOut}
            isDisabled={isDisabled}
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
}

function MonthGrid({ month, checkIn, checkOut, isDisabled, onClick }) {
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="shrink-0">
      <h4 className="mb-3 text-center text-sm font-semibold">{MONTHS[m]} {year}</h4>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {DOW.map((d, i) => (
          <div key={i} className="pb-2 text-[11px] font-medium uppercase text-muted-foreground">{d}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const iso = toISODate(new Date(year, m, d));
          const disabled = isDisabled(iso);
          const isStart = iso === checkIn;
          const isEnd = iso === checkOut;
          const inRange = checkIn && checkOut && iso > checkIn && iso < checkOut;
          const isAfterStart = checkIn && !checkOut && iso > checkIn && !disabled;
          return (
            <div key={i} className="relative">
              {(inRange || (isAfterStart)) && (
                <span className={cn("absolute inset-y-1 -inset-x-px rounded-full", inRange ? "bg-accent/15" : "bg-accent/10")} />
              )}
              <button
                disabled={disabled}
                onClick={() => onClick(iso)}
                className={cn(
                  "relative grid h-9 w-9 place-items-center rounded-full text-sm transition-colors",
                  disabled && "cursor-not-allowed text-muted-foreground/40 line-through",
                  !disabled && !isStart && !isEnd && "hover:bg-secondary",
                  isStart && "bg-foreground text-background font-medium",
                  isEnd && "bg-foreground text-background font-medium"
                )}
              >
                {d}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}