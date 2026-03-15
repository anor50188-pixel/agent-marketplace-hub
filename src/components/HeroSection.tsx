import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

const phrases = [
  "Nima xohlayapsiz?",
  "Nimani o'ylayapsiz?",
  "Qanday agent kerak?",
  "Qanday muammo bor?",
  "Nima yaratamiz bugun?",
];

interface HeroSectionProps {
  onStartClick?: () => void;
}

const HeroSection = ({ onStartClick }: HeroSectionProps) => {
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/8 blur-[100px] animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-secondary/6 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/4 blur-[140px] animate-pulse-soft" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(225_15%_15%_/_0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(225_15%_15%_/_0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 border border-border bg-card/50 backdrop-blur-sm"
          >
            <Zap className="w-3.5 h-3.5 text-secondary" />
            <span className="text-xs font-medium text-muted-foreground">AI Agent Platformasi</span>
          </motion.div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            <span className="text-foreground">O'z </span>
            <span className="gradient-text">AI Agentingizni</span>
            <br />
            <span className="text-foreground">yarating</span>
          </h1>

          <div className="h-16 flex items-center justify-center mb-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentPhrase}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.5 }}
                className="text-xl md:text-2xl text-muted-foreground font-light"
              >
                {phrases[currentPhrase]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onStartClick}
              className="gradient-btn px-8 py-4 rounded-2xl text-base font-semibold inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Yaratamiz
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-2xl text-base font-semibold text-foreground inline-flex items-center justify-center gap-2 border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all"
            >
              Marketplace ko'rish
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
