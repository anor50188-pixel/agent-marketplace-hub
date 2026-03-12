import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AgentTemplates from "@/components/AgentTemplates";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AgentTemplates />
    </div>
  );
};

export default Index;
