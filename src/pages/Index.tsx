import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AgentTemplates from "@/components/AgentTemplates";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection onStartClick={() => setShowDashboard(true)} />
      <AgentTemplates />
      <AnimatePresence>
        {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
