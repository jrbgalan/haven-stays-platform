import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Compass, CalendarCheck, LayoutDashboard, MessageSquare } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { client } from "@/api/client";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Explore", to: "/explore", icon: Compass },
  { label: "My Trips", to: "/dashboard", icon: CalendarCheck, auth: true },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) { setUnread(0); return; }
    let cancelled = false;
    client.entities.Conversation.filter({})
      .then((cs) => { if (!cancelled) setUnread(cs.reduce((s, c) => s + (c.unreadByGuest || 0), 0)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [isAuthenticated, location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout(false);
    navigate("/");
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass border-b border-border/60 shadow-luxe" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-2" aria-label="Haven home">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background">
            <span className="font-heading text-base font-semibold leading-none">H</span>
          </span>
          <span className="font-heading text-xl font-medium tracking-tight">Haven</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.filter((l) => !l.auth || isAuthenticated).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to="/messages"
              className="relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            >
              <MessageSquare size={15} /> Messages
              {unread > 0 && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">{unread}</span>
              )}
            </Link>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/host"
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LayoutDashboard size={15} /> Host
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-border py-1 pl-3 pr-1 transition-colors hover:shadow-luxe"
                aria-label="Account menu"
              >
                <Menu size={15} className="text-foreground/70" />
                <span className="grid h-7 w-7 place-items-center rounded-full bg-foreground text-xs font-medium text-background">
                  {(user?.full_name || user?.email || "U").charAt(0).toUpperCase()}
                </span>
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-popover shadow-luxe-lg"
                  >
                    <div className="border-b border-border px-4 py-3">
                      <p className="truncate text-sm font-medium">{user?.full_name || "Account"}</p>
                      <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary">
                      <CalendarCheck size={15} /> My Trips
                    </Link>
                    <Link to="/messages" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary">
                      <MessageSquare size={15} /> Messages
                      {unread > 0 && <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-foreground">{unread}</span>}
                    </Link>
                    {user?.role === "admin" && (
                      <Link to="/host" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary">
                        <LayoutDashboard size={15} /> Host Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 border-t border-border px-4 py-2.5 text-sm text-left hover:bg-secondary"
                    >
                      <LogOut size={15} /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:scale-[1.03] active:scale-95 md:inline-block"
            >
              Sign in
            </Link>
          )}

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-full border border-border md:hidden"
            aria-label="Open menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-b border-border glass md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              <Link to="/explore" className="flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm hover:bg-secondary">
                <Compass size={16} /> Explore
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm hover:bg-secondary">
                  <CalendarCheck size={16} /> My Trips
                </Link>
              )}
              {isAuthenticated && (
                <Link to="/messages" className="flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm hover:bg-secondary">
                  <MessageSquare size={16} /> Messages
                  {unread > 0 && <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-foreground">{unread}</span>}
                </Link>
              )}
              {isAuthenticated && user?.role === "admin" && (
                <Link to="/host" className="flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm hover:bg-secondary">
                  <LayoutDashboard size={16} /> Host Dashboard
                </Link>
              )}
              <div className="my-1 h-px bg-border" />
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-3 text-left text-sm hover:bg-secondary"
                >
                  <LogOut size={16} /> Sign out
                </button>
              ) : (
                <Link to="/login" className="flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm hover:bg-secondary">
                  <User size={16} /> Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}