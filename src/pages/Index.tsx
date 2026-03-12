import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AgentTemplates from "@/components/AgentTemplates";
import Dashboard from "@/components/Dashboard";
import CosmicBackground from "@/components/CosmicBackground";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      <CosmicBackground />
      <div className="relative z-10">
        <Navbar />
        <HeroSection onStartClick={() => setShowDashboard(true)} />
        <AgentTemplates />
      </div>
      <AnimatePresence>
        {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
