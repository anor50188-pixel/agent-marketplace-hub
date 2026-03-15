import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { ToolInfo } from "./ChatWorkspace";

interface ToolDockProps {
  tools: ToolInfo[];
  activeTools: string[];
  onToolClick: (toolId: string) => void;
  isToolUnlocked: (toolId: string) => boolean;
}

const ToolDock = ({ tools, activeTools, onToolClick, isToolUnlocked }: ToolDockProps) => {
  return (
    <div className="flex justify-center pb-5 px-4">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="tool-dock flex items-center gap-1.5 px-3 py-2 rounded-2xl"
      >
        {tools.map((tool) => {
          const isActive = activeTools.includes(tool.id);
          const isUnlocked = isToolUnlocked(tool.id);

          return (
            <motion.button
              key={tool.id}
              whileHover={{ scale: 1.15, y: -8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToolClick(tool.id)}
              className={`relative group flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                isActive
                  ? "tool-dock-item-active"
                  : isUnlocked
                  ? "tool-dock-item hover:bg-muted/20"
                  : "tool-dock-item-locked"
              }`}
              style={
                isActive
                  ? {
                      boxShadow: `0 0 20px hsl(${tool.glowColor} / 0.4), 0 0 40px hsl(${tool.glowColor} / 0.15)`,
                    }
                  : undefined
              }
            >
              <span className={`text-lg ${!isUnlocked ? "grayscale opacity-40" : ""}`}>
                {tool.icon}
              </span>

              {!isUnlocked && (
                <div className="absolute -top-0.5 -right-0.5">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </div>
              )}

              {isActive && (
                <motion.div
                  layoutId="dock-indicator"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                  style={{ backgroundColor: tool.color }}
                />
              )}

              {/* Tooltip */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="dock-tooltip px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap text-foreground">
                  {!isUnlocked && "🔒 "}
                  {tool.shortLabel}
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ToolDock;
