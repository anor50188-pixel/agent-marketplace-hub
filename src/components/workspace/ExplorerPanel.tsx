import { motion } from "framer-motion";
import { FileText, Database, Wrench, Settings, Monitor } from "lucide-react";
import type { ActiveNode } from "./AgentWorkspace";

interface ExplorerPanelProps {
  activeNode: ActiveNode;
  onNodeSelect: (node: ActiveNode) => void;
  selectedToolCount: number;
}

const nodes: { id: ActiveNode; label: string; icon: React.ElementType }[] = [
  { id: "info", label: "Agent ma'lumotlari", icon: FileText },
  { id: "knowledge", label: "Bilimlar bazasi", icon: Database },
  { id: "tools", label: "Toollar", icon: Wrench },
  { id: "model", label: "Model sozlamalari", icon: Settings },
  { id: "output", label: "Chiqish kanallari", icon: Monitor },
];

const ExplorerPanel = ({ activeNode, onNodeSelect, selectedToolCount }: ExplorerPanelProps) => {
  return (
    <div className="w-56 h-full border-r border-white/10 bg-white/[0.03] backdrop-blur-xl flex flex-col">
      <div className="px-4 py-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Boshqaruv</p>
      </div>
      <nav className="flex-1 px-2 space-y-0.5">
        {nodes.map((node) => {
          const isActive = activeNode === node.id;
          return (
            <button
              key={node.id}
              onClick={() => onNodeSelect(node.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                isActive
                  ? "text-white bg-white/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="explorer-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-purple-500 shadow-[0_0_10px_#a855f7]"
                />
              )}
              <node.icon className={`w-4 h-4 ${isActive ? "text-purple-400" : ""}`} />
              <span>{node.label}</span>
              {node.id === "tools" && selectedToolCount > 0 && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                  {selectedToolCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Auto-saving
        </div>
      </div>
    </div>
  );
};

export default ExplorerPanel;
