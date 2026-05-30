import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Zap, Bot, Brain, Code, MessageSquare } from "lucide-react";

const phrases = [
  "Nima xohlayapsiz?",
  "Nimani o'ylayapsiz?",
  "Qanday agent kerak?",
  "Qanday muammo bor?",
  "Nima yaratamiz bugun?",
];

const floatingIcons = [
  { icon: Bot, x: "15%", y: "20%", delay: 0, size: 20 },
  { icon: Brain, x: "80%", y: "25%", delay: 1.2, size: 18 },
  { icon: Code, x: "10%", y: "70%", delay: 0.6, size: 16 },
  { icon: MessageSquare, x: "85%", y: "65%", delay: 1.8, size: 14 },
  { icon: Sparkles, x: "70%", y: "80%", delay: 2.4, size: 16 },
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
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(250_85%_65%_/_0.08),transparent_60%)]" />
      </div>

      {/* Floating icons */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-muted-foreground/15 pointer-events-none"
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [0, -12, 0],
            rotate: [0, 5, -5, 0],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 6,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <item.icon style={{ width: item.size, height: item.size }} />
        </motion.div>
      ))}

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
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
            </span>
            <span className="text-xs font-medium text-muted-foreground">AI Agent Platformasi</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mb-6"
          >
            <img
              src="/agentus-logo.png"
              alt="Agentus"
              className="h-32 sm:h-40 md:h-52 lg:h-64 w-auto mx-auto mix-blend-screen drop-shadow-[0_0_50px_hsl(250_85%_65%_/_0.5)]"
            />
          </motion.div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight mb-6">
            <span className="text-foreground">O'z </span>
            <span className="gradient-text">AI Agentingizni</span>
            <br />
            <span className="text-foreground">yarating</span>
          </h1>

          <div className="h-14 flex items-center justify-center mb-10">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentPhrase}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.5 }}
                className="text-lg md:text-xl text-muted-foreground font-light"
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
              className="gradient-btn px-8 py-4 rounded-2xl text-base font-semibold inline-flex items-center justify-center gap-2 shadow-[0_0_40px_hsl(250_85%_65%_/_0.25)]"
            >
              <Sparkles className="w-5 h-5" />
              Yaratamiz
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onStartClick?.()}
              className="px-8 py-4 rounded-2xl text-base font-semibold text-foreground inline-flex items-center justify-center gap-2 border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all backdrop-blur-sm"
            >
              Marketplace ko'rish
            </motion.button>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 inline-flex items-center gap-8 px-8 py-4 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm"
          >
            {[
              { label: "Agentlar", value: "500+" },
              { label: "Foydalanuvchilar", value: "10K+" },
              { label: "So'rovlar/kun", value: "1M+" },
            ].map((stat, i) => (
              <div key={stat.label} className={`text-center ${i > 0 ? "border-l border-border/50 pl-8" : ""}`}>
                <p className="font-display text-xl font-bold gradient-text">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
