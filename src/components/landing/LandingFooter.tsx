import { Bot } from "lucide-react";

const LandingFooter = () => {
  return (
    <footer className="border-t border-border/40 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-btn flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-sm text-foreground">Agentus</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2025 Agentus. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;
