import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AIConcierge from "@/components/ai/AIConcierge";
import BackToTop from "@/components/ui/BackToTop";
import DemoModeBanner from "@/components/presentation/DemoModeBanner";
import GuidedTour from "@/components/presentation/GuidedTour";

export default function Layout() {
  const [tourOpen, setTourOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DemoModeBanner onStartTour={() => setTourOpen(true)} />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <AIConcierge />
      <GuidedTour isOpen={tourOpen} onClose={() => setTourOpen(false)} />
    </div>
  );
}