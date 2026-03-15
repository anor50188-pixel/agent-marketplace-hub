import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PopularAgents from "@/components/landing/PopularAgents";
import Testimonials from "@/components/landing/Testimonials";
import PricingSection from "@/components/landing/PricingSection";
import LandingFooter from "@/components/landing/LandingFooter";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection onStartClick={() => setShowDashboard(true)} />
      <PopularAgents onOpenDashboard={() => setShowDashboard(true)} />
      <Testimonials />
      <PricingSection onOpenDashboard={() => setShowDashboard(true)} />
      <LandingFooter />
      <AnimatePresence>
        {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
