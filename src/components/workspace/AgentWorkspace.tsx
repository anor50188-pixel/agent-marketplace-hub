import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ExplorerPanel from "./ExplorerPanel";
import CanvasPanel from "./CanvasPanel";
import AssistantPanel from "./AssistantPanel";

export type ActiveNode = "info" | "knowledge" | "tools" | "model" | "output";

export interface ModelSettings {
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface WorkspaceState {
  agentName: string;
  agentDescription: string;
  selectedTools: string[];
  activeNode: ActiveNode;
  modelSettings: ModelSettings;
  outputChannels: string[];
}

const AgentWorkspace = () => {
  const [state, setState] = useState<WorkspaceState>({
    agentName: "",
    agentDescription: "",
    selectedTools: [],
    activeNode: "info",
    modelSettings: { model: "minimax", temperature: 0.7, maxTokens: 4096 },
    outputChannels: [],
  });
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const update = (partial: Partial<WorkspaceState>) =>
    setState((s) => ({ ...s, ...partial }));

  const canDeploy = state.agentName.trim() && state.selectedTools.length > 0;

  const handleDeploy = () => {
    if (!canDeploy) return;
    setDeploying(true);
    setTimeout(() => {
      setDeploying(false);
      setDeployed(true);
    }, 2500);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0f172a] text-slate-100 overflow-hidden">
      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-14 shrink-0 flex items-center justify-between px-5 border-b border-white/10 bg-white/[0.03] backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <Input
            value={state.agentName}
            onChange={(e) => update({ agentName: e.target.value })}
            placeholder="Nomsiz Agent"
            className="bg-transparent border-none text-lg font-semibold text-slate-100 placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 w-64 h-9 px-0"
          />
        </div>
        <Button
          onClick={handleDeploy}
          disabled={!canDeploy || deploying || deployed}
          className="h-9 px-5 text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-40 disabled:shadow-none transition-all gap-2"
        >
          {deploying ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Deploying...</>
          ) : deployed ? (
            "✓ Deployed"
          ) : (
            <><Rocket className="w-4 h-4" /> Deploy to Marketplace</>
          )}
        </Button>
      </motion.div>

      {/* 3-Panel Layout */}
      <div className="flex-1 flex min-h-0">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ExplorerPanel
            activeNode={state.activeNode}
            onNodeSelect={(node) => update({ activeNode: node })}
            selectedToolCount={state.selectedTools.length}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 min-w-0"
        >
          <CanvasPanel state={state} onUpdate={update} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AssistantPanel state={state} />
        </motion.div>
      </div>
    </div>
  );
};

export default AgentWorkspace;
