import { motion } from "framer-motion";
import { Plus, Sparkles, Layers } from "lucide-react";
import { Button } from "./ui/button";

interface AgentCreateCardProps {
  onCreateFromScratch: () => void;
  onCreateFromTemplate: () => void;
}

const AgentCreateCard = ({ onCreateFromScratch, onCreateFromTemplate }: AgentCreateCardProps) => {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg"
      >
        {/* Outer glow */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary via-accent to-secondary opacity-20 blur-xl animate-pulse-soft" />

        {/* Card */}
        <div className="relative glass rounded-3xl p-10 border border-primary/20 shadow-[0_0_40px_hsl(var(--primary)/0.1)]">
          {/* Neon border effect */}
          <div className="absolute inset-0 rounded-3xl border border-accent/30" />

          {/* Icon */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center mb-8 shadow-[0_0_30px_hsl(var(--accent)/0.3)]"
          >
            <Plus className="w-10 h-10 text-primary-foreground" />
          </motion.div>

          {/* Title with glow */}
          <h1
            className="font-display text-4xl md:text-5xl font-bold text-center mb-4"
            style={{
              background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--primary)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px hsl(var(--accent) / 0.4))",
            }}
          >
            Yangi Agent Yaratish
          </h1>

          {/* Description */}
          <p className="text-center text-muted-foreground text-lg mb-10 leading-relaxed">
            AI agentingizni noldan yarating yoki tayyor shablonlardan tanlang
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onCreateFromScratch}
              className="flex-1 h-14 text-base font-semibold rounded-xl gradient-btn border-0 gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Noldan yaratish
            </Button>
            <Button
              onClick={onCreateFromTemplate}
              variant="outline"
              className="flex-1 h-14 text-base font-semibold rounded-xl border-primary/30 hover:border-primary/50 hover:bg-primary/5 gap-2"
            >
              <Layers className="w-5 h-5" />
              Shablonlardan tanlash
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AgentCreateCard;
