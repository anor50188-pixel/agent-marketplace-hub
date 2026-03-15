import { Crown, Lock } from "lucide-react";
import { Button } from "./ui/button";

interface UpgradePromptProps {
  title: string;
  description: string;
  requiredPlan?: string;
  onUpgrade: () => void;
  compact?: boolean;
}

const UpgradePrompt = ({ title, description, requiredPlan, onUpgrade, compact }: UpgradePromptProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/20 bg-primary/5">
        <Lock className="w-4 h-4 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground">{title}</p>
          <p className="text-[11px] text-muted-foreground">{description}</p>
        </div>
        <Button onClick={onUpgrade} size="sm" className="h-7 text-[11px] rounded-lg gradient-btn border-0 shrink-0">
          <Crown className="w-3 h-3 mr-1" />
          Upgrade
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Lock className="w-7 h-7 text-primary" />
      </div>
      <h3 className="font-display font-bold text-lg text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-1 max-w-sm">{description}</p>
      {requiredPlan && (
        <p className="text-xs text-primary font-medium mb-4">
          Kamida <span className="font-bold">{requiredPlan}</span> reja kerak
        </p>
      )}
      <Button onClick={onUpgrade} className="h-10 px-6 rounded-xl gradient-btn border-0">
        <Crown className="w-4 h-4 mr-2" />
        Rejani yangilash
      </Button>
    </div>
  );
};

export default UpgradePrompt;
