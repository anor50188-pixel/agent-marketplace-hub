import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { ToolInfo } from "./ChatWorkspace";

interface TopToolbarProps {
  tools: ToolInfo[];
  activeTools: string[];
  onToolClick: (toolId: string) => void;
  isToolUnlocked: (toolId: string) => boolean;
}

const TopToolbar = ({ tools, activeTools, onToolClick, isToolUnlocked }: TopToolbarProps) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
      className="top-toolbar flex items-center gap-1 px-4 py-2 border-b border-border/30"
    >
      {tools.map((tool) => {
        const isActive = activeTools.includes(tool.id);
        const isUnlocked = isToolUnlocked(tool.id);

        return (
          <motion.button
            key={tool.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToolClick(tool.id)}
            className={`toolbar-chip relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              isActive
                ? "toolbar-chip-active"
                : isUnlocked
                ? "toolbar-chip-idle hover:bg-muted/30"
                : "toolbar-chip-locked"
            }`}
            style={
              isActive
                ? {
                    background: `hsl(${tool.glowColor} / 0.15)`,
                    borderColor: `hsl(${tool.glowColor} / 0.4)`,
                    boxShadow: `0 0 12px hsl(${tool.glowColor} / 0.25), inset 0 0 8px hsl(${tool.glowColor} / 0.05)`,
                  }
                : undefined
            }
          >
            <span className={`text-sm ${!isUnlocked ? "grayscale opacity-40" : ""}`}>
              {tool.icon}
            </span>
            <span
              className={`${
                isActive ? "text-foreground" : isUnlocked ? "text-muted-foreground" : "text-muted-foreground/50"
              }`}
            >
              {tool.shortLabel}
            </span>

            {!isUnlocked && (
              <Lock className="w-3 h-3 text-muted-foreground/50" />
            )}

            {isActive && (
              <motion.div
                layoutId="toolbar-glow"
                className="absolute inset-0 rounded-lg"
                style={{
                  background: `hsl(${tool.glowColor} / 0.08)`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}

            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-1.5 h-1.5 rounded-full ml-0.5"
                style={{ backgroundColor: tool.color }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default TopToolbar;
