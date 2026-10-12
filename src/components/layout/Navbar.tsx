import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, LogOut, CalendarCheck, LayoutDashboard,
  MessageSquare, Globe, Bell, Check, Sparkles, ChevronDown, ArrowRight,
  Palmtree, Waves, Mountain, Landmark, Utensils
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { client } from "@/api/client";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

// NAV ITEMS CONFIG
const PRIMARY_TABS = [
  { id: "stays", label: "Stays", to: "/explore", hasMega: true },
  { id: "experiences", label: "Experiences", to: "/experiences", hasMega: true },
  { id: "destinations", label: "Destinations", to: "/destinations", hasMega: true },
  { id: "concierge", label: "Concierge", to: "/concierge", hasMega: false },
  { id: "deals", label: "Deals", to: "/deals", hasMega: false },
  { id: "journal", label: "Journal", to: "/journal", hasMega: false },
  { id: "host", label: "Host", to: "/host", hasMega: false },
  { id: "help", label: "Help", to: "/help", hasMega: false },
];

// SAMPLE NOTIFICATIONS
const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Reservation Confirmed",
    desc: "Your sanctuary at Villa Calamian, Coron is confirmed for Nov 12.",
    time: "2 hours ago",
    read: false
  },
  {
    id: "notif-2",
    title: "Haven Concierge Update",
    desc: "Private sunset catamaran departure finalized with Captain Torres.",
    time: "1 day ago",
    read: false
  },
  {
    id: "notif-3",
    title: "New Seasonal Privilege",
    desc: "Haven members receive complimentary 4th night in Palawan this season.",
    time: "3 days ago",
    read: true
  }
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

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll visibility state
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // Popover menus state
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [megaTimeout, setMegaTimeout] = useState<NodeJS.Timeout | null>(null);
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

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadMessages(0);
      return;
    }
    let cancelled = false;
    client.entities.Conversation.filter({})
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

  // SMART SCROLL: Hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 16);

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

  // Close menus on route navigation
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setActiveMega(null);
    setNotifOpen(false);
    setLangModalOpen(false);
  }, [location.pathname]);

  const handleMegaEnter = (tabId: string) => {
    if (megaTimeout) clearTimeout(megaTimeout);
    setActiveMega(tabId);
  };

  const handleMegaLeave = () => {
    const timeout = setTimeout(() => {
      setActiveMega(null);
    }, 180);
    setMegaTimeout(timeout);
  };

  const handleLogout = () => {
    logout(false);
    navigate("/");
  };

  const markAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const isTabActive = (tab: typeof PRIMARY_TABS[0]) => {
    if (tab.to === "/explore" && (location.pathname === "/explore" || location.pathname.startsWith("/listing/"))) return true;
    return location.pathname === tab.to;
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out",
          visible ? "translate-y-0" : "-translate-y-full",
          scrolled ? "glass border-b border-border/70 shadow-luxe py-2" : "bg-background/80 backdrop-blur-md border-b border-border/30 py-3.5"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* BRAND LOGO */}
          <Link to="/" className="group flex items-center gap-2.5 shrink-0" aria-label="Haven home">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background shadow-sm transition-transform duration-200 group-hover:scale-105">
              <span className="font-heading text-lg font-semibold leading-none">H</span>
            </span>
            <span className="font-heading text-2xl font-medium tracking-tight text-foreground">
              Haven
            </span>
          </Link>

          {/* DESKTOP NAV TABS */}
          <nav className="hidden lg:flex items-center gap-1 relative" onMouseLeave={handleMegaLeave}>
            {PRIMARY_TABS.map((tab) => {
              const active = isTabActive(tab);
              return (
                <div
                  key={tab.id}
                  className="relative"
                  onMouseEnter={() => (tab.hasMega ? handleMegaEnter(tab.id) : setActiveMega(null))}
                >
                  <Link
                    to={tab.to}
                    className={cn(
                      "relative flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      active ? "text-foreground font-semibold" : "text-foreground/70 hover:text-foreground hover:bg-secondary/60"
                    )}
                  >
                    <span>{tab.label}</span>
                    {tab.hasMega && (
                      <ChevronDown
                        size={12}
                        className={cn(
                          "transition-transform duration-200 opacity-60",
                          activeMega === tab.id ? "rotate-180" : ""
                        )}
                      />
                    )}

                    {/* SLIDING ACTIVE TAB INDICATOR */}
                    {active && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute inset-x-3 -bottom-1 h-[2px] bg-champagne-dark dark:bg-champagne rounded-full"
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
                    if (megaTimeout) clearTimeout(megaTimeout);
                  }}
                  onMouseLeave={handleMegaLeave}
                  className="absolute left-1/2 top-full mt-3 -translate-x-1/2 w-[720px] overflow-hidden rounded-3xl border border-border/80 bg-popover/95 p-6 shadow-2xl backdrop-blur-xl"
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
                            { label: "Beachfront Estates", sub: "Private ocean coves", icon: Waves, to: "/explore?category=Beachfront" },
                            { label: "Mountain Cabins", sub: "Pine hearth retreats", icon: Mountain, to: "/explore?category=Cabins" },
                            { label: "Island Sanctuaries", sub: "Secluded atolls", icon: Palmtree, to: "/explore?category=Islands" },
                            { label: "Historic Châteaux", sub: "Architectural soul", icon: Landmark, to: "/explore?category=Historic" },
                          ].map((cat, idx) => (
                            <Link
                              key={idx}
                              to={cat.to}
                              className="group flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-secondary"
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
                            <Link to="/explore?location=Palawan" className="rounded-full bg-secondary px-3 py-1 text-foreground/80 hover:bg-secondary/80">
                              Palawan, Philippines
                            </Link>
                            <Link to="/explore?location=Kyoto" className="rounded-full bg-secondary px-3 py-1 text-foreground/80 hover:bg-secondary/80">
                              Kyoto, Japan
                            </Link>
                            <Link to="/explore?location=Santorini" className="rounded-full bg-secondary px-3 py-1 text-foreground/80 hover:bg-secondary/80">
                              Santorini, Greece
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* FEATURED CARD */}
                      <div className="col-span-5">
                        <Link
                          to="/explore"
                          className="group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl bg-muted p-4 shadow-sm"
                        >
                          <img
                            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
                            alt="Villa Calamian"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 scrim-card" />
                          <div className="relative z-10 text-white">
                            <span className="rounded-full bg-foreground/85 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide backdrop-blur">
                              Featured Sanctuary
                            </span>
                            <h4 className="mt-2 font-heading text-lg font-medium">Villa Calamian</h4>
                            <p className="text-xs text-white/80">Coron, Palawan · Private Beachfront</p>
                            <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-champagne-light">
                              View stay <ArrowRight size={12} />
                            </p>
                          </div>
                        </Link>
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
                            { label: "Private Yachting", sub: "Secret lagoon charters", icon: Waves, to: "/experiences" },
                            { label: "Master Omakase", sub: "Private garden tastings", icon: Utensils, to: "/experiences" },
                            { label: "Glacier Landings", sub: "Alpine helicopter tours", icon: Mountain, to: "/experiences" },
                            { label: "Holistic Healing", sub: "Balinese sound baths", icon: Sparkles, to: "/experiences" },
                          ].map((cat, idx) => (
                            <Link
                              key={idx}
                              to={cat.to}
                              className="group flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-secondary"
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
                            <span className="text-muted-foreground">Kyoto Tea Ceremony</span>
                            <span>•</span>
                            <span className="text-muted-foreground">Santorini Aegean Sail</span>
                            <span>•</span>
                            <span className="text-muted-foreground">Matterhorn Heli-Picnic</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-5">
                        <Link
                          to="/experiences"
                          className="group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl bg-muted p-4 shadow-sm"
                        >
                          <img
                            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80"
                            alt="Sunset Catamaran"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 scrim-card" />
                          <div className="relative z-10 text-white">
                            <span className="rounded-full bg-foreground/85 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide backdrop-blur">
                              Most Requested
                            </span>
                            <h4 className="mt-2 font-heading text-lg font-medium">Sunset Catamaran Charter</h4>
                            <p className="text-xs text-white/80">El Nido, Palawan · Private Chef</p>
                            <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-champagne-light">
                              Discover <ArrowRight size={12} />
                            </p>
                          </div>
                        </Link>
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
                            { label: "Southeast Asia", sub: "Palawan, Cebu, Siargao", icon: Palmtree, to: "/destinations" },
                            { label: "East Asia", sub: "Tokyo, Kyoto, Hakone", icon: Landmark, to: "/destinations" },
                            { label: "The Mediterranean", sub: "Santorini, Amalfi", icon: Waves, to: "/destinations" },
                            { label: "Swiss Alps & Beyond", sub: "Zermatt, Matterhorn", icon: Mountain, to: "/destinations" },
                          ].map((cat, idx) => (
                            <Link
                              key={idx}
                              to={cat.to}
                              className="group flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-secondary"
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
                            <span className="text-muted-foreground">Best now: Kyoto (Autumn)</span>
                            <span>•</span>
                            <span className="text-muted-foreground">Palawan (Calm Seas)</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-5">
                        <Link
                          to="/destinations"
                          className="group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl bg-muted p-4 shadow-sm"
                        >
                          <img
                            src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80"
                            alt="Santorini"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 scrim-card" />
                          <div className="relative z-10 text-white">
                            <span className="rounded-full bg-foreground/85 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide backdrop-blur">
                              Featured Region
                            </span>
                            <h4 className="mt-2 font-heading text-lg font-medium">Santorini Caldera</h4>
                            <p className="text-xs text-white/80">18 Handpicked Cliffside Suites</p>
                            <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-champagne-light">
                              View region <ArrowRight size={12} />
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          {/* RIGHT UTILITIES & USER PROFILE */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* CURRENCY / LANGUAGE SELECTOR */}
            <button
              onClick={() => setLangModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-medium text-foreground/80 hover:bg-secondary transition-colors"
              title="Currency & Language"
              aria-label="Currency and Language Settings"
            >
              <Globe size={13} className="text-foreground/70" />
              <span>{selectedCurrency} · {selectedLanguage.toUpperCase()}</span>
            </button>

            {/* NOTIFICATION BELL WITH BADGE */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative grid h-9 w-9 place-items-center rounded-full border border-border/70 bg-card/60 text-foreground transition-colors hover:bg-secondary"
                aria-label="Notifications"
              >
                <Bell size={16} />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground shadow-sm">
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
                    className="absolute right-0 mt-2 w-80 overflow-hidden rounded-3xl border border-border/80 bg-popover shadow-2xl z-50"
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
            <ThemeToggle />

            {/* USER PROFILE DROPDOWN */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full border border-border/70 bg-card/60 py-1 pl-3 pr-1.5 transition-all hover:shadow-luxe focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Account menu"
                >
                  <Menu size={14} className="text-foreground/70" />
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
                    {(user?.full_name || user?.email || "U").charAt(0).toUpperCase()}
                  </span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-64 overflow-hidden rounded-3xl border border-border/80 bg-popover shadow-2xl z-50"
                    >
                      <div className="border-b border-border/60 px-5 py-3.5">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {user?.full_name || "Guest Traveler"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
                        >
                          <CalendarCheck size={16} /> My Trips
                        </Link>
                        <Link
                          to="/messages"
                          className="flex items-center justify-between px-5 py-2.5 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
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
                        {user?.role === "admin" && (
                          <Link
                            to="/host"
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
                          >
                            <LayoutDashboard size={16} /> Host Dashboard
                          </Link>
                        )}
                        <Link
                          to="/concierge"
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
                        >
                          <Sparkles size={16} className="text-champagne" /> Concierge Services
                        </Link>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 border-t border-border/60 px-5 py-3 text-left text-sm text-foreground/70 hover:bg-secondary hover:text-foreground transition-colors"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:scale-[1.03] active:scale-95 shadow-sm"
                >
                  Join Haven
                </Link>
              </div>
            )}

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-card/60 text-foreground lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN MOBILE SLIDE-IN DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-2xl lg:hidden p-6 overflow-y-auto"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between pb-6 border-b border-border/60">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background font-heading font-semibold">
                  H
                </span>
                <span className="font-heading text-xl font-medium tracking-tight">Haven</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Staggered Navigation Links */}
            <div className="mt-8 flex flex-col space-y-1">
              {[
                { label: "Stays", to: "/explore" },
                { label: "Experiences", to: "/experiences" },
                { label: "Destinations", to: "/destinations" },
                { label: "Concierge", to: "/concierge" },
                { label: "Deals & Privileges", to: "/deals" },
                { label: "Journal", to: "/journal" },
                { label: "Host a Sanctuary", to: "/host" },
                { label: "Help Center", to: "/help" },
              ].map((link, idx) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex h-12 items-center justify-between rounded-2xl px-4 font-heading text-xl font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <span>{link.label}</span>
                  <ArrowRight size={16} className="text-muted-foreground" />
                </Link>
              ))}
            </div>

            {/* Bottom Sheet for User / Account */}
            <div className="mt-auto pt-8 border-t border-border/60">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-2 mb-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">
                      {(user?.full_name || user?.email || "U").charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{user?.full_name || "Account"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-11 items-center gap-3 rounded-2xl px-4 text-sm font-medium hover:bg-secondary"
                  >
                    <CalendarCheck size={16} /> My Trips
                  </Link>
                  <Link
                    to="/messages"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-11 items-center justify-between rounded-2xl px-4 text-sm font-medium hover:bg-secondary"
                  >
                    <span className="flex items-center gap-3">
                      <MessageSquare size={16} /> Messages
                    </span>
                    {unreadMessages > 0 && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                        {unreadMessages}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="flex h-11 w-full items-center gap-3 rounded-2xl px-4 text-left text-sm font-medium text-destructive hover:bg-secondary"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-12 items-center justify-center rounded-full border border-border font-medium text-sm"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-12 items-center justify-center rounded-full bg-foreground text-background font-medium text-sm"
                  >
                    Join Haven
                  </Link>
                </div>
              )}

              {/* Currency & Language Button in mobile */}
              <div className="mt-6 flex items-center justify-between px-2 pt-4 border-t border-border/40 text-xs text-muted-foreground">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setLangModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 hover:text-foreground"
                >
                  <Globe size={14} /> {selectedCurrency} · {selectedLanguage.toUpperCase()}
                </button>
                <span>Haven Luxury Collection</span>
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