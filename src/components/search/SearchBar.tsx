import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { todayISO, addDays } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", String(guests));
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "glass flex w-full flex-col gap-2 rounded-3xl border border-border/70 p-2 shadow-luxe-lg sm:flex-row sm:items-center sm:rounded-full sm:p-1.5",
        className
      )}
    >
      <Field icon={<MapPin size={16} />} label="Where">
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Search destinations"
          className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
        />
      </Field>

      <Divider />

      <Field icon={<Calendar size={16} />} label="Check in">
        <input
          type="date"
          min={todayISO()}
          value={checkIn}
          onChange={(e) => {
            setCheckIn(e.target.value);
            if (checkOut && new Date(e.target.value) >= new Date(checkOut)) {
              setCheckOut(addDays(e.target.value, 2));
            }
          }}
          className="w-full bg-transparent text-sm font-medium outline-none [color-scheme:light] dark:[color-scheme:dark]"
        />
      </Field>

      <Divider />

      <Field icon={<Calendar size={16} />} label="Check out">
        <input
          type="date"
          min={checkIn ? addDays(checkIn, 1) : todayISO()}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full bg-transparent text-sm font-medium outline-none [color-scheme:light] dark:[color-scheme:dark]"
        />
      </Field>

      <Divider />

      <Field icon={<Users size={16} />} label="Guests">
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full bg-transparent text-sm font-medium outline-none"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
          ))}
        </select>
      </Field>

      <button
        type="submit"
        className="group flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-transform hover:scale-[1.02] active:scale-95 sm:py-3"
      >
        <Search size={16} className="transition-transform group-hover:rotate-12" />
        <span className="sm:hidden">Search stays</span>
      </button>
    </motion.form>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-1 cursor-text items-center gap-3 rounded-full px-4 py-2 transition-colors hover:bg-secondary/60 sm:rounded-full">
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex flex-1 flex-col">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        {children}
      </span>
    </label>
  );
}

function Divider() {
  return <span className="hidden h-8 w-px bg-border sm:block" />;
}
