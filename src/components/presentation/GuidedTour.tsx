import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Search,
  ShieldCheck,
  Bot,
  Building,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TourStep {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ElementType;
  actionLabel?: string;
  actionUrl?: string;
  onAction?: () => void;
}

export default function GuidedTour({ isOpen, onClose }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { loginAsHost } = useAuth();

  const STEPS: TourStep[] = [
    {
      id: "search",
      eyebrow: "MULTI-PRODUCT PLATFORM",
      title: "8 Search Verticals in One Hero Engine",
      description:
        "Switch effortlessly between Hotels, Homes & Apartments, Overnight Stays, 8-hour Day Use blocks, Curated Activities, Airport Transfers, Flights, and Flight + Stay bundle savings with live pricing.",
      icon: Search,
      actionLabel: "Try Search Tabs",
      actionUrl: "/",
    },
    {
      id: "trust",
      eyebrow: "TRUST & CONVERSION",
      title: "Haven Verified Standards & Compare",
      description:
        "Every stay is inspected against 140+ luxury criteria. Toggle all-inclusive total pricing, review live scarcity indicators, and select up to 3 listings to launch an animated side-by-side comparison drawer.",
      icon: ShieldCheck,
      actionLabel: "Explore Stays & Compare",
      actionUrl: "/explore",
    },
    {
      id: "ai",
      eyebrow: "INTELLIGENT ASSISTANT",
      title: "AI Trip Concierge & Smart Search",
      description:
        "Powered by OpenAI, Haven's floating AI Concierge designs bespoke multi-day itineraries and matches mood-based queries ('romantic cliffside villa under $500') directly with live properties.",
      icon: Bot,
      actionLabel: "Chat with AI Concierge",
      actionUrl: "/concierge",
    },
    {
      id: "host",
      eyebrow: "MARKETPLACE DUALITY",
      title: "Host Dashboard & Viewing Engine",
      description:
        "Inspect the host side of the luxury marketplace: manage reservations, set calendar availability slots, arrange private viewing appointments, and message prospective guests in real-time.",
      icon: Building,
      actionLabel: "Switch to Host View",
      onAction: async () => {
        await loginAsHost();
        navigate("/host");
      },
    },
    {
      id: "demo",
      eyebrow: "SEAMLESS PRESENTATION",
      title: "Presentation Bar & Seeded Datasets",
      description:
        "Use the top presentation bar anytime to toggle between Eleanor Vance (Guest) and Marcus Reed (Host). All bookings, real-time chats, and appointments are seeded so every page looks completely alive.",
      icon: Sparkles,
      actionLabel: "Back to Home",
      actionUrl: "/",
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
      }
      if (e.key === "ArrowLeft") {
        setCurrentStep((s) => Math.max(s - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, STEPS.length]);

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const StepIcon = step.icon;
  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem("haven_tour_completed", "true");
      onClose();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleAction = () => {
    if (step.onAction) {
      step.onAction();
    } else if (step.actionUrl) {
      navigate(step.actionUrl);
    }
    handleNext();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-md"
      />

      {/* Tour Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-champagne/40 bg-card p-6 shadow-2xl sm:p-8"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X size={16} />
        </button>

        {/* Top Progress bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? "w-8 bg-champagne"
                    : i < currentStep
                    ? "w-3 bg-champagne/50"
                    : "w-3 bg-secondary"
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-semibold text-muted-foreground">
            Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>

        {/* Step Icon & Eyebrow */}
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-champagne/30 bg-champagne/10 text-champagne-dark dark:text-champagne-light shadow-sm">
            <StepIcon size={22} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-champagne-dark dark:text-champagne-light">
              {step.eyebrow}
            </span>
            <h3 className="font-heading text-xl font-medium tracking-tight text-foreground sm:text-2xl">
              {step.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {step.description}
        </p>

        {/* Feature Action Button */}
        {step.actionLabel && (
          <div className="mt-6">
            <button
              type="button"
              onClick={handleAction}
              className="inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-champagne/10 px-4 py-2 text-xs font-semibold text-champagne-dark dark:text-champagne-light transition-all hover:bg-champagne/20 active:scale-95"
            >
              <span>{step.actionLabel}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-border/80 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-secondary active:scale-95"
              >
                <ChevronLeft size={14} /> Back
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background transition-transform hover:scale-[1.02] active:scale-95"
            >
              {isLast ? (
                <>
                  <CheckCircle2 size={14} /> Done
                </>
              ) : (
                <>
                  Next <ChevronRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
