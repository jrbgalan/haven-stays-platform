import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  User,
  Building,
  RotateCcw,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { resetDemoData } from "@/lib/seedDemoData";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export interface DemoModeBannerProps {
  onStartTour?: () => void;
}

export default function DemoModeBanner({ onStartTour }: DemoModeBannerProps) {
  const { user, loginAsGuest, loginAsHost } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("haven_demo_banner_collapsed") === "true";
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("haven_demo_banner_collapsed", String(next));
      return next;
    });
  };

  const handleGuestLogin = async () => {
    await loginAsGuest();
    toast({
      title: "Switched to Guest Persona",
      description: "Signed in as Eleanor Vance. My Trips, Wishlist, and Guest Messages are active.",
    });
  };

  const handleHostLogin = async () => {
    await loginAsHost();
    toast({
      title: "Switched to Host Persona",
      description: "Signed in as Marcus Reed. Host Dashboard, Availability Calendar, and Inquiries are active.",
    });
    if (location.pathname !== "/host") {
      navigate("/host");
    }
  };

  const handleResetData = () => {
    resetDemoData();
    toast({
      title: "Demo Data Re-seeded",
      description: "Sample bookings, verified chats, appointments, and reviews restored.",
    });
    window.location.reload();
  };

  const isHost = user?.role === "host";
  const isGuest = user && !isHost;

  return (
    <aside aria-label="Demo mode control banner" className="sticky top-0 z-[60] w-full border-b border-champagne/30 bg-background/95 backdrop-blur-xl shadow-sm transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-8">
        {/* Left: Persona badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-full bg-champagne/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-champagne-dark dark:text-champagne-light">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">PRESENTATION</span> MODE
          </div>

          <span className="hidden text-xs text-muted-foreground md:inline">
            Active:{" "}
            <strong className="font-medium text-foreground">
              {user ? user.full_name || user.email : "Visitor"}
            </strong>{" "}
            ({user?.role === "host" ? "Host" : user ? "Guest" : "Unauthenticated"})
          </span>
        </div>

        {/* Center / Right: Action Pills */}
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <button
                type="button"
                onClick={handleGuestLogin}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
                  isGuest
                    ? "bg-foreground text-background shadow-xs ring-1 ring-champagne/40"
                    : "bg-secondary text-foreground/80 hover:bg-secondary/80 hover:text-foreground"
                )}
                title="Log in as Eleanor Vance (Guest Persona with active trips & messages)"
              >
                <User size={12} className={isGuest ? "text-champagne" : "text-muted-foreground"} />
                <span>Guest Persona</span>
              </button>

              <button
                type="button"
                onClick={handleHostLogin}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
                  isHost
                    ? "bg-foreground text-background shadow-xs ring-1 ring-champagne/40"
                    : "bg-secondary text-foreground/80 hover:bg-secondary/80 hover:text-foreground"
                )}
                title="Log in as Marcus Reed (Host Persona with active listings & bookings)"
              >
                <Building size={12} className={isHost ? "text-champagne" : "text-muted-foreground"} />
                <span>Host Persona</span>
              </button>

              {onStartTour && (
                <button
                  type="button"
                  onClick={onStartTour}
                  className="flex items-center gap-1.5 rounded-full border border-champagne/40 bg-champagne/10 px-3 py-1 text-xs font-semibold text-champagne-dark dark:text-champagne-light transition-all hover:bg-champagne/20"
                >
                  <Sparkles size={12} className="text-champagne" />
                  <span>Guided Tour</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleResetData}
                className="hidden md:flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                title="Reset seeded demo bookings, chats, and appointments"
              >
                <RotateCcw size={11} />
                <span>Reset Data</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Toggle button */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expand demo banner" : "Collapse demo banner"}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title={isCollapsed ? "Expand demo controls" : "Collapse demo controls"}
          >
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
