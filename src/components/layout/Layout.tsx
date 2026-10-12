import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AIConcierge from "@/components/ai/AIConcierge";
import BackToTop from "@/components/ui/BackToTop";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <AIConcierge />
    </div>
  );
}