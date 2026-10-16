import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, LogOut, CalendarCheck, LayoutDashboard,
  MessageSquare, Globe, Bell, Check, Sparkles, ChevronDown, ArrowRight,
  Palmtree, Waves, Mountain, Landmark, Utensils,
  User as UserIcon, Building2, RotateCcw, Heart, HelpCircle
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { getConversations } from "@/services";
import { resetDemoData } from "@/lib/seedDemoData";
import { useToast } from "@/components/ui/use-toast";
import ThemeToggle from "@/components/ui/ThemeToggle";
import MegaMenuFeaturedImage from "@/components/layout/MegaMenuFeaturedImage";
import { cn } from "@/lib/utils";

export interface NavbarProps {
  onStartTour?: () => void;
}

// PRIMARY TABS: Stays, Experiences, Destinations
const PRIMARY_TABS = [
  { id: "stays", label: "Stays", to: "/explore", hasMega: true },
  { id: "experiences", label: "Experiences", to: "/experiences", hasMega: true },
  { id: "destinations", label: "Destinations", to: "/destinations", hasMega: true },
];

// SAMPLE NOTIFICATIONS
const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Reservation Confirmed",
    desc: "Your sanctuary at Villa Calamian, Coron is confirmed for Nov 12.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "notif-2",
    title: "Haven Concierge Update",
    desc: "Private sunset catamaran departure finalized with Captain Torres.",
    time: "1 day ago",
    read: false,
  },
  {
    id: "notif-3",
    title: "New Seasonal Privilege",
    desc: "Haven members receive complimentary 4th night in Palawan this season.",
    time: "3 days ago",
    read: true,
  },
];

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($) - US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR (€) - Euro" },
  { code: "GBP", symbol: "£", label: "GBP (£) - British Pound" },
  { code: "PHP", symbol: "₱", label: "PHP (₱) - Philippine Peso" },
  { code: "JPY", symbol: "¥", label: "JPY (¥) - Japanese Yen" },
];

const LANGUAGES = [
  { code: "en", label: "English (US)" },
  { code: "fr", label: "Français" },
  { code: "ja", label: "日本語" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
];

export default function Navbar({ onStartTour }: NavbarProps) {
  const { isAuthenticated, user, logout, loginAsGuest, loginAsHost } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  // Scroll visibility state
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // Popover menus state
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const megaTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Currency & Language preference state
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Notifications
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Unread messages count
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Refs for outside click closing
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);

  // Dynamic Mega-Menu Hover State for Photo Crossfade
  const [megaStaysItem, setMegaStaysItem] = useState({
    topic: "beachfront villa",
    title: "Beachfront Estates",
    subtitle: "Private ocean coves & panoramic infinity pools",
    to: "/explore?category=Beachfront",
  });

  const [megaExpItem, setMegaExpItem] = useState({
    topic: "sunset cruise",
    title: "Sunset Catamaran Charter",
    subtitle: "El Nido, Palawan · Private onboard chef",
    to: "/experiences/exp-1",
  });

  const [megaDestItem, setMegaDestItem] = useState({
    topic: "Palawan",
    title: "Palawan Archipelago",
    subtitle: "Limestone towers, hidden lagoons & untouched atolls",
    to: "/destinations",
  });

  const hoverDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleLinkHover = (setter: React.Dispatch<React.SetStateAction<any>>, item: any) => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
      return;
    }
    if (hoverDebounceRef.current) clearTimeout(hoverDebounceRef.current);
    hoverDebounceRef.current = setTimeout(() => {
      setter(item);
    }, 80);
  };

  // Touch handling for mobile drawer swipe to close
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadMessages(0);
      return;
    }
    let cancelled = false;
    getConversations()
      .then((cs) => {
        if (!cancelled) {
          setUnreadMessages(cs.reduce((s, c) => s + (c.unreadByGuest || 0), 0));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, location.pathname]);

  // SMART SCROLL: Hide on scroll down past 90px, show on scroll up, transparent at top
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 40);

      if (currentY <= 40) {
        setVisible(true);
      } else if (currentY > lastScrollY.current && currentY > 90) {
        // Scrolling down past threshold -> hide
        setVisible(false);
        setActiveMega(null);
      } else if (currentY < lastScrollY.current) {
        // Scrolling up -> show
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close menus on route navigation
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setActiveMega(null);
    setNotifOpen(false);
    setLangModalOpen(false);
  }, [location.pathname]);

  // Close popovers on ESC and click outside
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMega(null);
        setUserMenuOpen(false);
        setNotifOpen(false);
        setMobileOpen(false);
        setLangModalOpen(false);
      }
    };
    const onMouseDown = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  const handleMegaEnter = (tabId: string) => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setActiveMega(tabId);
  };

  const handleMegaLeave = () => {
    megaTimeoutRef.current = setTimeout(() => {
      setActiveMega(null);
    }, 180);
  };

  const handleLogout = () => {
    logout(false);
    navigate("/");
  };

  const handleGuestSwitch = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    await loginAsGuest();
    toast({
      title: "Switched to Guest Persona",
      description: "Signed in as Eleanor Vance. My Trips, Wishlists, and Messages are active.",
    });
  };

  const handleHostSwitch = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    await loginAsHost();
    toast({
      title: "Switched to Host Persona",
      description: "Signed in as Marcus Reed. Host Dashboard, Availability, and Inquiries are active.",
    });
    if (location.pathname !== "/host") {
      navigate("/host");
    }
  };

  const handleResetData = () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    resetDemoData();
    toast({
      title: "Demo Data Re-seeded",
      description: "Sample bookings, verified chats, and reviews restored.",
    });
    window.location.reload();
  };

  const markAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const isTabActive = (tab: typeof PRIMARY_TABS[0]) => {
    if (tab.to === "/explore" && (location.pathname === "/explore" || location.pathname.startsWith("/listing/"))) return true;
    return location.pathname === tab.to;
  };

  // Whether navbar is in hero transparent state
  const isHeroTransparent = isHomePage && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out",
          visible ? "translate-y-0" : "-translate-y-full",
          // Height: 80px (h-20) at top, shrinking to 64px (h-16) on scroll
          scrolled ? "h-16 shadow-luxe" : "h-20",
          // Background & border transition
          isHeroTransparent
            ? "bg-transparent bg-gradient-to-b from-black/60 via-black/25 to-transparent text-white"
            : "bg-[#F8F7F4]/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] text-foreground"
        )}
      >
        <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* BRAND LOGO (Left) */}
          <Link to="/" className="group flex items-center gap-2.5 shrink-0 z-10" aria-label="Haven home">
            <span
              className={cn(
                "grid h-9 w-9 place-items-center rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105",
                isHeroTransparent
                  ? "bg-white/15 text-white border border-white/25 backdrop-blur-md"
                  : "bg-foreground text-background"
              )}
            >
              <span className="font-heading text-lg font-semibold leading-none">H</span>
            </span>
            <span
              className={cn(
                "font-heading text-2xl font-medium tracking-tight transition-colors duration-300",
                isHeroTransparent ? "text-white" : "text-foreground"
              )}
            >
              Haven
            </span>
          </Link>

          {/* DESKTOP CENTER TABS (Stays, Experiences, Destinations) */}
          <nav
            ref={megaRef}
            className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-2"
            onMouseLeave={handleMegaLeave}
          >
            {PRIMARY_TABS.map((tab) => {
              const active = isTabActive(tab);
              return (
                <div
                  key={tab.id}
                  className="relative"
                  onMouseEnter={() => handleMegaEnter(tab.id)}
                >
                  <Link
                    to={tab.to}
                    className={cn(
                      "relative flex h-10 items-center gap-1.5 rounded-full px-4 text-[15px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      isHeroTransparent
                        ? (active ? "text-white font-semibold bg-white/15" : "text-white/85 hover:text-white hover:bg-white/10")
                        : (active ? "text-foreground font-semibold bg-secondary/80" : "text-foreground/75 hover:text-foreground hover:bg-secondary/60")
                    )}
                  >
                    <span>{tab.label}</span>
                    <ChevronDown
                      size={13}
                      className={cn(
                        "transition-transform duration-200 opacity-60",
                        activeMega === tab.id ? "rotate-180" : ""
                      )}
                    />

                    {/* SLIDING ACTIVE TAB INDICATOR */}
                    {active && (
                      <motion.div
                        layoutId="navActiveUnderline"
                        className={cn(
                          "absolute inset-x-4 -bottom-1 h-[2px] rounded-full",
                          isHeroTransparent ? "bg-white" : "bg-champagne-dark dark:bg-champagne"
                        )}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </Link>
                </div>
              );
            })}

            {/* ANIMATED MEGA MENU POPOVER */}
            <AnimatePresence>
              {activeMega && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.99 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onMouseEnter={() => {
                    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
                  }}
                  onMouseLeave={handleMegaLeave}
                  className="absolute left-1/2 top-full mt-3 -translate-x-1/2 w-[720px] overflow-hidden rounded-[20px] border border-border/80 bg-popover/95 p-6 shadow-2xl backdrop-blur-xl"
                >
                  {/* MEGA MENU: STAYS */}
                  {activeMega === "stays" && (
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-7 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Explore by Sanctuary Type
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Beachfront Estates", sub: "Private ocean coves & reefs", topic: "beachfront villa", icon: Waves, to: "/explore?category=Beachfront" },
                            { label: "Mountain Cabins", sub: "Pine hearth & alpine quiet", topic: "mountain cabin", icon: Mountain, to: "/explore?category=Cabins" },
                            { label: "Island Sanctuaries", sub: "Secluded atolls & lagoons", topic: "infinity pool", icon: Palmtree, to: "/explore?category=Beachfront" },
                            { label: "Historic Châteaux", sub: "Architectural estates & heritage", topic: "countryside estate", icon: Landmark, to: "/explore?category=Villas" },
                          ].map((cat, idx) => (
                            <Link
                              key={idx}
                              to={cat.to}
                              onMouseEnter={() => handleLinkHover(setMegaStaysItem, { topic: cat.topic, title: cat.label, subtitle: cat.sub, to: cat.to })}
                              onFocus={() => setMegaStaysItem({ topic: cat.topic, title: cat.label, subtitle: cat.sub, to: cat.to })}
                              className="group flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-secondary focus:bg-secondary focus:outline-none"
                            >
                              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                                <cat.icon size={16} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground leading-tight group-hover:text-champagne-dark dark:group-hover:text-champagne-light">
                                  {cat.label}
                                </p>
                                <p className="text-xs text-muted-foreground">{cat.sub}</p>
                              </div>
                            </Link>
                          ))}
                        </div>

                        <div className="border-t border-border/60 pt-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Popular this week
                          </p>
                          <div className="flex items-center gap-2 text-xs">
                            <Link
                              to="/explore?location=Palawan"
                              onMouseEnter={() => handleLinkHover(setMegaStaysItem, { topic: "Palawan", title: "Palawan Archipelago", subtitle: "Limestone towers, hidden lagoons & private islands", to: "/explore?location=Palawan" })}
                              onFocus={() => setMegaStaysItem({ topic: "Palawan", title: "Palawan Archipelago", subtitle: "Limestone towers, hidden lagoons & private islands", to: "/explore?location=Palawan" })}
                              className="rounded-full bg-secondary px-3 py-1 text-foreground/80 hover:bg-secondary/80 focus:bg-secondary/80 focus:outline-none"
                            >
                              Palawan, Philippines
                            </Link>
                            <Link
                              to="/explore?location=Kyoto"
                              onMouseEnter={() => handleLinkHover(setMegaStaysItem, { topic: "Kyoto", title: "Kyoto Zen Pavilions", subtitle: "Preserved cedar machiyas & maple courtyards", to: "/explore?location=Kyoto" })}
                              onFocus={() => setMegaStaysItem({ topic: "Kyoto", title: "Kyoto Zen Pavilions", subtitle: "Preserved cedar machiyas & maple courtyards", to: "/explore?location=Kyoto" })}
                              className="rounded-full bg-secondary px-3 py-1 text-foreground/80 hover:bg-secondary/80 focus:bg-secondary/80 focus:outline-none"
                            >
                              Kyoto, Japan
                            </Link>
                            <Link
                              to="/explore?location=Santorini"
                              onMouseEnter={() => handleLinkHover(setMegaStaysItem, { topic: "Santorini", title: "Santorini Cliff Suites", subtitle: "Whitewashed Cycladic vaults & cobalt Aegean vistas", to: "/explore?location=Santorini" })}
                              onFocus={() => setMegaStaysItem({ topic: "Santorini", title: "Santorini Cliff Suites", subtitle: "Whitewashed Cycladic vaults & cobalt Aegean vistas", to: "/explore?location=Santorini" })}
                              className="rounded-full bg-secondary px-3 py-1 text-foreground/80 hover:bg-secondary/80 focus:bg-secondary/80 focus:outline-none"
                            >
                              Santorini, Greece
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* FEATURED CROSSFADE CARD */}
                      <div className="col-span-5">
                        <MegaMenuFeaturedImage
                          topic={megaStaysItem.topic}
                          title={megaStaysItem.title}
                          subtitle={megaStaysItem.subtitle}
                          badge="Featured Sanctuary"
                          linkTo={megaStaysItem.to}
                        />
                      </div>
                    </div>
                  )}

                  {/* MEGA MENU: EXPERIENCES */}
                  {activeMega === "experiences" && (
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-7 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Curated Expeditions
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Private Yachting", sub: "Secret lagoon charters & cruises", topic: "sunset cruise", icon: Waves, to: "/experiences/exp-1" },
                            { label: "Master Omakase", sub: "Private dining & tea rituals", topic: "private chef dining", icon: Utensils, to: "/experiences/exp-2" },
                            { label: "Alpine Expeditions", sub: "Glacier landings & ridge hikes", topic: "hiking adventure", icon: Mountain, to: "/experiences/exp-3" },
                            { label: "Holistic Healing", sub: "Balinese sound baths & ayurveda", topic: "spa and wellness", icon: Sparkles, to: "/experiences/exp-4" },
                          ].map((cat, idx) => (
                            <Link
                              key={idx}
                              to={cat.to}
                              onMouseEnter={() => handleLinkHover(setMegaExpItem, { topic: cat.topic, title: cat.label, subtitle: cat.sub, to: cat.to })}
                              onFocus={() => setMegaExpItem({ topic: cat.topic, title: cat.label, subtitle: cat.sub, to: cat.to })}
                              className="group flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-secondary focus:bg-secondary focus:outline-none"
                            >
                              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                                <cat.icon size={16} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground leading-tight group-hover:text-champagne-dark dark:group-hover:text-champagne-light">
                                  {cat.label}
                                </p>
                                <p className="text-xs text-muted-foreground">{cat.sub}</p>
                              </div>
                            </Link>
                          ))}
                        </div>

                        <div className="border-t border-border/60 pt-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Popular this week
                          </p>
                          <div className="flex items-center gap-2 text-xs">
                            <Link
                              to="/experiences/exp-7"
                              onMouseEnter={() => handleLinkHover(setMegaExpItem, { topic: "snorkeling and diving", title: "Coral Snorkeling Safari", subtitle: "Protected reef dives with marine naturalists", to: "/experiences/exp-7" })}
                              className="rounded-full bg-secondary px-3 py-1 text-foreground/80 hover:bg-secondary/80 focus:bg-secondary/80 focus:outline-none"
                            >
                              Coral Snorkeling
                            </Link>
                            <Link
                              to="/experiences/exp-5"
                              onMouseEnter={() => handleLinkHover(setMegaExpItem, { topic: "wine tasting", title: "Caldera Wine Tasting", subtitle: "Volcanic Assyrtiko varietals in private cliffside cellars", to: "/experiences/exp-5" })}
                              className="rounded-full bg-secondary px-3 py-1 text-foreground/80 hover:bg-secondary/80 focus:bg-secondary/80 focus:outline-none"
                            >
                              Volcanic Wine Tasting
                            </Link>
                            <Link
                              to="/experiences/exp-8"
                              onMouseEnter={() => handleLinkHover(setMegaExpItem, { topic: "hot air balloon", title: "Sunrise Balloon Flight", subtitle: "Silent dawn floats over misty valleys", to: "/experiences/exp-8" })}
                              className="rounded-full bg-secondary px-3 py-1 text-foreground/80 hover:bg-secondary/80 focus:bg-secondary/80 focus:outline-none"
                            >
                              Sunrise Balloon
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* FEATURED CROSSFADE CARD */}
                      <div className="col-span-5">
                        <MegaMenuFeaturedImage
                          topic={megaExpItem.topic}
                          title={megaExpItem.title}
                          subtitle={megaExpItem.subtitle}
                          badge="Most Requested"
                          linkTo={megaExpItem.to}
                        />
                      </div>
                    </div>
                  )}

                  {/* MEGA MENU: DESTINATIONS */}
                  {activeMega === "destinations" && (
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-7 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Regions of Stillness
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Southeast Asia", sub: "Palawan, Cebu, Siargao", topic: "Palawan", icon: Palmtree, to: "/destinations" },
                            { label: "East Asia", sub: "Tokyo, Kyoto, Hakone", topic: "Tokyo", icon: Landmark, to: "/destinations" },
                            { label: "The Mediterranean", sub: "Santorini, Amalfi Coast", topic: "Santorini", icon: Waves, to: "/destinations" },
                            { label: "Swiss Alps & Beyond", sub: "Zermatt, Swiss Alps", topic: "Zermatt", icon: Mountain, to: "/destinations" },
                          ].map((cat, idx) => (
                            <Link
                              key={idx}
                              to={cat.to}
                              onMouseEnter={() => handleLinkHover(setMegaDestItem, { topic: cat.topic, title: cat.label, subtitle: cat.sub, to: cat.to })}
                              onFocus={() => setMegaDestItem({ topic: cat.topic, title: cat.label, subtitle: cat.sub, to: cat.to })}
                              className="group flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-secondary focus:bg-secondary focus:outline-none"
                            >
                              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                                <cat.icon size={16} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground leading-tight group-hover:text-champagne-dark dark:group-hover:text-champagne-light">
                                  {cat.label}
                                </p>
                                <p className="text-xs text-muted-foreground">{cat.sub}</p>
                              </div>
                            </Link>
                          ))}
                        </div>

                        <div className="border-t border-border/60 pt-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Seasonal Spotlight
                          </p>
                          <div className="flex items-center gap-2 text-xs">
                            <button
                              type="button"
                              onMouseEnter={() => handleLinkHover(setMegaDestItem, { topic: "Kyoto", title: "Kyoto Heritage", subtitle: "Ancient Zen gardens & preserved cedar pavilions", to: "/destinations" })}
                              className="rounded-full bg-secondary px-3 py-1 text-foreground/80 hover:bg-secondary/80 focus:bg-secondary/80 focus:outline-none"
                            >
                              Best now: Kyoto
                            </button>
                            <button
                              type="button"
                              onMouseEnter={() => handleLinkHover(setMegaDestItem, { topic: "Palawan", title: "Palawan Lagoons", subtitle: "Crystal turquoise waters & private frontier coves", to: "/destinations" })}
                              className="rounded-full bg-secondary px-3 py-1 text-foreground/80 hover:bg-secondary/80 focus:bg-secondary/80 focus:outline-none"
                            >
                              Palawan (Calm Seas)
                            </button>
                            <button
                              type="button"
                              onMouseEnter={() => handleLinkHover(setMegaDestItem, { topic: "Bali", title: "Bali Sanctuaries", subtitle: "Cliffside infinity pools & lush holistic valleys", to: "/destinations" })}
                              className="rounded-full bg-secondary px-3 py-1 text-foreground/80 hover:bg-secondary/80 focus:bg-secondary/80 focus:outline-none"
                            >
                              Bali
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* FEATURED CROSSFADE CARD */}
                      <div className="col-span-5">
                        <MegaMenuFeaturedImage
                          topic={megaDestItem.topic}
                          title={megaDestItem.title}
                          subtitle={megaDestItem.subtitle}
                          badge="Curated Haven"
                          linkTo={megaDestItem.to}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          {/* DESKTOP RIGHT UTILITIES (40px height each) */}
          <div className="hidden lg:flex items-center gap-2.5 z-10">
            {/* CURRENCY / LANGUAGE SELECTOR */}
            <button
              onClick={() => setLangModalOpen(true)}
              className={cn(
                "h-10 inline-flex items-center gap-1.5 rounded-full px-3.5 text-xs font-medium transition-colors",
                isHeroTransparent
                  ? "border border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                  : "border border-border/70 bg-card/60 text-foreground/80 hover:bg-secondary"
              )}
              title="Currency & Language"
              aria-label="Currency and Language Settings"
            >
              <Globe size={14} className={isHeroTransparent ? "text-white/80" : "text-foreground/70"} />
              <span>{selectedCurrency} · {selectedLanguage.toUpperCase()}</span>
            </button>

            {/* NOTIFICATION BELL WITH BADGE */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className={cn(
                  "relative grid h-10 w-10 place-items-center rounded-full transition-colors",
                  isHeroTransparent
                    ? "border border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                    : "border border-border/70 bg-card/60 text-foreground hover:bg-secondary"
                )}
                aria-label="Notifications"
              >
                <Bell size={16} />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground shadow-sm">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-80 overflow-hidden rounded-[20px] border border-border/80 bg-popover shadow-2xl z-50"
                  >
                    <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5">
                      <span className="text-sm font-semibold text-foreground">Notifications</span>
                      {unreadNotifsCount > 0 && (
                        <button
                          onClick={markAllNotifsRead}
                          className="text-xs text-champagne-dark dark:text-champagne-light hover:underline font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-border/40">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={cn(
                            "p-4 transition-colors hover:bg-secondary/60",
                            !n.read ? "bg-secondary/30" : ""
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-foreground">{n.title}</p>
                            <span className="text-[10px] text-muted-foreground">{n.time}</span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* THEME TOGGLE */}
            <ThemeToggle
              className={cn(
                "h-10 w-10",
                isHeroTransparent
                  ? "border border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                  : "border border-border/70 bg-card/60 text-foreground hover:bg-secondary"
              )}
            />

            {/* USER PROFILE DROPDOWN */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className={cn(
                  "h-10 flex items-center gap-2 rounded-full py-1 pl-3 pr-1.5 transition-all focus-visible:ring-2 focus-visible:ring-accent",
                  isHeroTransparent
                    ? "border border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                    : "border border-border/70 bg-card/60 text-foreground hover:bg-secondary"
                )}
                aria-label="Account menu"
              >
                <Menu size={15} className={isHeroTransparent ? "text-white/80" : "text-foreground/75"} />
                <span
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-full text-xs font-semibold shadow-sm",
                    isHeroTransparent ? "bg-white text-black" : "bg-foreground text-background"
                  )}
                >
                  {(user?.full_name || user?.email || "G").charAt(0).toUpperCase()}
                </span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-72 overflow-hidden rounded-[20px] border border-border/80 bg-popover shadow-2xl z-50 p-1.5"
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 border-b border-border/60">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {user?.full_name || "Guest Traveler"}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
                          >
                            <CalendarCheck size={16} /> My Trips
                          </Link>
                          <Link
                            to="/messages"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
                          >
                            <span className="flex items-center gap-3">
                              <MessageSquare size={16} /> Messages
                            </span>
                            {unreadMessages > 0 && (
                              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-accent-foreground">
                                {unreadMessages}
                              </span>
                            )}
                          </Link>
                          <Link
                            to="/dashboard?tab=wishlists"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
                          >
                            <Heart size={16} /> Wishlists
                          </Link>
                          <Link
                            to="/help"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
                          >
                            <HelpCircle size={16} /> Help Center
                          </Link>
                          {(user?.role === "host" || user?.role === "admin") && (
                            <Link
                              to="/host"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
                            >
                              <LayoutDashboard size={16} /> Host dashboard
                            </Link>
                          )}
                        </div>

                        {/* Switch demo user section */}
                        <div className="border-t border-border/60 bg-muted/20 rounded-xl px-2.5 py-2 my-1">
                          <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Switch demo user
                          </p>
                          <button
                            type="button"
                            onClick={handleGuestSwitch}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors",
                              user && user.role !== "host"
                                ? "bg-secondary font-semibold text-foreground"
                                : "text-foreground/75 hover:bg-secondary hover:text-foreground"
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <UserIcon size={14} className="text-champagne-dark dark:text-champagne" /> Eleanor Vance (Guest)
                            </span>
                            {user && user.role !== "host" && (
                              <span className="text-[10px] font-semibold text-champagne-dark dark:text-champagne-light">Active</span>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={handleHostSwitch}
                            className={cn(
                              "mt-0.5 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors",
                              user?.role === "host"
                                ? "bg-secondary font-semibold text-foreground"
                                : "text-foreground/75 hover:bg-secondary hover:text-foreground"
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <Building2 size={14} className="text-champagne-dark dark:text-champagne" /> Marcus Reed (Host)
                            </span>
                            {user?.role === "host" && (
                              <span className="text-[10px] font-semibold text-champagne-dark dark:text-champagne-light">Active</span>
                            )}
                          </button>
                          {onStartTour && (
                            <button
                              type="button"
                              onClick={() => {
                                setUserMenuOpen(false);
                                onStartTour();
                              }}
                              className="mt-0.5 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-foreground/75 hover:bg-secondary hover:text-foreground transition-colors"
                            >
                              <Sparkles size={14} className="text-champagne-dark dark:text-champagne" /> Guided Product Tour
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={handleResetData}
                            className="mt-0.5 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                          >
                            <RotateCcw size={13} /> Reset Demo Data
                          </button>
                        </div>

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl border-t border-border/60 px-4 py-2.5 text-left text-sm text-foreground/70 hover:bg-secondary hover:text-foreground transition-colors"
                        >
                          <LogOut size={16} /> Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="p-3">
                          <p className="text-sm font-semibold text-foreground">Welcome to Haven</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Explore curated luxury stays and experiences.</p>
                          <div className="mt-3 flex flex-col gap-2">
                            <Link
                              to="/login"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex h-10 items-center justify-center rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                              Sign in
                            </Link>
                            <Link
                              to="/register"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex h-10 items-center justify-center rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
                            >
                              Join Haven
                            </Link>
                          </div>
                        </div>

                        <div className="border-t border-border/60 bg-muted/20 rounded-xl px-2.5 py-2 m-1">
                          <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Switch demo user
                          </p>
                          <button
                            type="button"
                            onClick={handleGuestSwitch}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                          >
                            <UserIcon size={14} className="text-champagne-dark dark:text-champagne" /> Eleanor Vance (Guest)
                          </button>
                          <button
                            type="button"
                            onClick={handleHostSwitch}
                            className="mt-0.5 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                          >
                            <Building2 size={14} className="text-champagne-dark dark:text-champagne" /> Marcus Reed (Host)
                          </button>
                          {onStartTour && (
                            <button
                              type="button"
                              onClick={() => {
                                setUserMenuOpen(false);
                                onStartTour();
                              }}
                              className="mt-0.5 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                            >
                              <Sparkles size={14} className="text-champagne-dark dark:text-champagne" /> Guided Product Tour
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* MOBILE CONTROLS (Below 1024px: Logo on left, Bell & Menu button on right only) */}
          <div className="flex items-center gap-2 lg:hidden z-10">
            {/* Bell button on mobile */}
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className={cn(
                "relative grid h-10 w-10 place-items-center rounded-full transition-colors",
                isHeroTransparent
                  ? "border border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                  : "border border-border/70 bg-card/60 text-foreground hover:bg-secondary"
              )}
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground shadow-sm">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Menu button on mobile */}
            <button
              onClick={() => setMobileOpen(true)}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full transition-colors",
                isHeroTransparent
                  ? "border border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                  : "border border-border/70 bg-card/60 text-foreground hover:bg-secondary"
              )}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN MOBILE SLIDE-IN PANEL */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onTouchStart={(e) => {
              touchStartXRef.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartXRef.current !== null) {
                const diff = e.changedTouches[0].clientX - touchStartXRef.current;
                if (diff > 75) {
                  setMobileOpen(false);
                }
                touchStartXRef.current = null;
              }
            }}
            className="fixed inset-0 z-50 flex flex-col bg-background/98 backdrop-blur-2xl lg:hidden p-6 overflow-y-auto"
          >
            {/* Mobile Header Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-border/60 shrink-0">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background font-heading font-semibold text-lg">
                  H
                </span>
                <span className="font-heading text-2xl font-medium tracking-tight">Haven</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-border hover:bg-secondary transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Large Staggered Links */}
            <div className="mt-6 flex flex-col space-y-1">
              {[
                { label: "Stays", to: "/explore" },
                { label: "Experiences", to: "/experiences" },
                { label: "Destinations", to: "/destinations" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[48px] items-center justify-between rounded-2xl px-4 font-heading text-2xl font-medium text-foreground transition-colors hover:bg-secondary active:scale-[0.99]"
                >
                  <span>{link.label}</span>
                  <ArrowRight size={18} className="text-muted-foreground" />
                </Link>
              ))}

              <div className="my-3 border-t border-border/60" />

              {/* User / Trips links */}
              {[
                { label: "My Trips", to: "/dashboard", icon: CalendarCheck },
                { label: "Messages", to: "/messages", icon: MessageSquare, badge: unreadMessages },
                { label: "Wishlists", to: "/dashboard?tab=wishlists", icon: Heart },
                { label: "Help Center", to: "/help", icon: HelpCircle },
                ...((user?.role === "host" || user?.role === "admin")
                  ? [{ label: "Host dashboard", to: "/host", icon: LayoutDashboard }]
                  : []),
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[44px] items-center justify-between rounded-xl px-4 text-base font-medium text-foreground/80 transition-colors hover:bg-secondary"
                >
                  <span className="flex items-center gap-3">
                    <link.icon size={18} /> {link.label}
                  </span>
                  {link.badge && link.badge > 0 ? (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                      {link.badge}
                    </span>
                  ) : (
                    <ArrowRight size={14} className="text-muted-foreground/60" />
                  )}
                </Link>
              ))}
            </div>

            {/* Bottom Section */}
            <div className="mt-auto pt-6 border-t border-border/60">
              {/* Switch Demo User (Mobile) */}
              <div className="mb-4 rounded-2xl border border-border/70 bg-card/60 p-3">
                <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Switch demo user
                </p>
                <button
                  type="button"
                  onClick={handleGuestSwitch}
                  className={cn(
                    "flex min-h-[44px] w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors",
                    user && user.role !== "host"
                      ? "bg-secondary font-semibold text-foreground"
                      : "text-foreground/75 hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <UserIcon size={15} className="text-champagne-dark dark:text-champagne" /> Eleanor Vance (Guest)
                  </span>
                  {user && user.role !== "host" && (
                    <span className="text-[10px] font-semibold text-champagne-dark dark:text-champagne-light">Active</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleHostSwitch}
                  className={cn(
                    "mt-1 flex min-h-[44px] w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors",
                    user?.role === "host"
                      ? "bg-secondary font-semibold text-foreground"
                      : "text-foreground/75 hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Building2 size={15} className="text-champagne-dark dark:text-champagne" /> Marcus Reed (Host)
                  </span>
                  {user?.role === "host" && (
                    <span className="text-[10px] font-semibold text-champagne-dark dark:text-champagne-light">Active</span>
                  )}
                </button>
                {onStartTour && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      onStartTour();
                    }}
                    className="mt-1 flex min-h-[44px] w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-foreground/75 hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <Sparkles size={15} className="text-champagne-dark dark:text-champagne" /> Guided Product Tour
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleResetData}
                  className="mt-1 flex min-h-[44px] w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <RotateCcw size={14} /> Reset Demo Data
                </button>
              </div>

              {/* Auth links or Sign out */}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-destructive hover:bg-secondary transition-colors"
                >
                  <LogOut size={16} /> Sign out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-[44px] items-center justify-center rounded-full border border-border font-medium text-sm hover:bg-secondary"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-[44px] items-center justify-center rounded-full bg-foreground text-background font-medium text-sm"
                  >
                    Join Haven
                  </Link>
                </div>
              )}

              {/* Mobile Bottom Utilities (Currency/Language & ThemeToggle) */}
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-border/40">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setLangModalOpen(true);
                  }}
                  className="flex min-h-[44px] items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <Globe size={16} /> {selectedCurrency} · {selectedLanguage.toUpperCase()}
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Theme</span>
                  <ThemeToggle className="h-10 w-10 border-border/70" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CURRENCY & LANGUAGE MODAL */}
      <AnimatePresence>
        {langModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLangModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg rounded-3xl border border-border bg-popover p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="font-heading text-xl font-medium text-foreground">
                  Language & Currency
                </h3>
                <button
                  onClick={() => setLangModalOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* CURRENCY SELECT */}
              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Choose Currency
                </label>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setSelectedCurrency(c.code)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border p-3 text-left text-sm transition-all",
                        selectedCurrency === c.code
                          ? "border-accent bg-accent/10 font-medium text-foreground"
                          : "border-border hover:bg-secondary"
                      )}
                    >
                      <span>{c.label}</span>
                      {selectedCurrency === c.code && <Check size={14} className="text-accent" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* LANGUAGE SELECT */}
              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Choose Language
                </label>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setSelectedLanguage(l.code)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border p-3 text-left text-sm transition-all",
                        selectedLanguage === l.code
                          ? "border-accent bg-accent/10 font-medium text-foreground"
                          : "border-border hover:bg-secondary"
                      )}
                    >
                      <span>{l.label}</span>
                      {selectedLanguage === l.code && <Check size={14} className="text-accent" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setLangModalOpen(false)}
                  className="rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background hover:opacity-90"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}