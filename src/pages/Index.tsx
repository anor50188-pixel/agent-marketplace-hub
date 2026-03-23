import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import PopularAgents from "@/components/landing/PopularAgents";
import Testimonials from "@/components/landing/Testimonials";
import PricingSection from "@/components/landing/PricingSection";
import LandingFooter from "@/components/landing/LandingFooter";

const Index = () => {
  const navigate = useNavigate();
  const goToDashboard = () => navigate("/dashboard");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection onStartClick={goToDashboard} />
      <HowItWorks />
      <PopularAgents onOpenDashboard={goToDashboard} />
      <Testimonials />
      <PricingSection onOpenDashboard={goToDashboard} />
      <LandingFooter />
    </div>
  );
};

export default Index;
