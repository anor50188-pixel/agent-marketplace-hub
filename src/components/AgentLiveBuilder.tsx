import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Pencil, Check, X, Plus, Trash2, Rocket, Sparkles, CheckCircle2,
  Cpu, DollarSign, Globe, Search, Code, Send, BarChart3, Puzzle, Database
} from "lucide-react";
import { Button } from "./ui/button";
import type { AgentConfig } from "@/lib/agentStore";

interface AgentLiveBuilderProps {
  agent: Partial<AgentConfig>;
  onUpdate: (updates: Partial<AgentConfig>) => void;
  onPublish: () => void;
  isPublished: boolean;
}

const ALL_TOOLS: { id: string; icon: string; label: string }[] = [
  { id: "ai-brain", icon: "🧠", label: "AI Brain" },
  { id: "web-search", icon: "🔍", label: "Web Search" },
  { id: "code-execution", icon: "⚡", label: "Code Execution" },
  { id: "social-search", icon: "𝕏", label: "Social Media" },
  { id: "http-request", icon: "🌐", label: "HTTP Request" },
  { id: "database", icon: "🗄️", label: "Database" },
  { id: "file-analysis", icon: "📊", label: "File Analysis" },
];

const CATEGORIES = ["General", "Content", "Research", "Marketing", "SEO", "E-Commerce", "Data"];

const AgentLiveBuilder = ({ agent, onUpdate, onPublish, isPublished }: AgentLiveBuilderProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const saveEdit = (field: string) => {
    onUpdate({ [field]: editValue });
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const toggleTool = (toolId: string) => {
    if (toolId === "ai-brain") return; // always required
    const current = agent.tools || [];
    const updated = current.includes(toolId)
      ? current.filter((t) => t !== toolId)
      : [...current, toolId];
    onUpdate({ tools: updated });
  };

  if (isPublished) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-400/10 flex items-center justify-center mb-5"
        >
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </motion.div>
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Agent nashr qilindi! 🎉</h2>
        <p className="text-sm text-muted-foreground max-w-[280px]">
          Agentingiz "Agentlarim" bo'limida tayyor. Yangi agent yaratish uchun chatga yozing.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold text-sm text-foreground">Agent Builder</h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
          Live Preview
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-5 space-y-5">
        {/* Agent Card Preview */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-primary/20 bg-card/80 p-5 space-y-4"
          style={{ boxShadow: "0 0 30px hsl(var(--primary) / 0.08)" }}
        >
          {/* Name */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              {editingField === "name" ? (
                <div className="flex items-center gap-1.5">
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 h-8 rounded-lg border border-primary/30 bg-muted/30 px-2.5 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && saveEdit("name")}
                  />
                  <button onClick={() => saveEdit("name")} className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </button>
                  <button onClick={cancelEdit} className="w-7 h-7 rounded-lg bg-muted/30 flex items-center justify-center hover:bg-muted/50 transition-colors">
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h3 className="font-display font-bold text-base text-foreground">{agent.name}</h3>
                  <button
                    onClick={() => startEdit("name", agent.name || "")}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md flex items-center justify-center hover:bg-muted/40 transition-all"
                  >
                    <Pencil className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              )}
              {/* Category */}
              <div className="flex items-center gap-2 mt-1">
                <select
                  value={agent.category || "General"}
                  onChange={(e) => onUpdate({ category: e.target.value })}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border-0 appearance-none cursor-pointer focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description / Role */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1.5 block">
              Vazifasi
            </label>
            {editingField === "role" ? (
              <div className="space-y-1.5">
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-primary/30 bg-muted/30 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  autoFocus
                />
                <div className="flex gap-1.5">
                  <button onClick={() => saveEdit("role")} className="h-7 px-3 rounded-lg bg-primary/10 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors">
                    Saqlash
                  </button>
                  <button onClick={cancelEdit} className="h-7 px-3 rounded-lg bg-muted/30 text-[11px] font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
                    Bekor
                  </button>
                </div>
              </div>
            ) : (
              <p
                onClick={() => startEdit("role", agent.role || "")}
                className="text-xs text-muted-foreground leading-relaxed cursor-pointer hover:text-foreground transition-colors rounded-lg hover:bg-muted/20 p-2 -m-2"
              >
                {agent.role || "Vazifani yozing..."}
              </p>
            )}
          </div>

          {/* Tools */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2 block">
              Toollar
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_TOOLS.map((tool) => {
                const isActive = (agent.tools || []).includes(tool.id);
                const isRequired = tool.id === "ai-brain";
                return (
                  <motion.button
                    key={tool.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTool(tool.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      isActive
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : "bg-muted/30 text-muted-foreground border border-border/30 hover:bg-muted/50"
                    } ${isRequired ? "opacity-70 cursor-default" : "cursor-pointer"}`}
                  >
                    <span>{tool.icon}</span>
                    {tool.label}
                    {isActive && !isRequired && (
                      <X className="w-3 h-3 ml-0.5 opacity-50" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Cost info */}
          <div className="flex gap-4 pt-2 border-t border-border/30">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <DollarSign className="w-3.5 h-3.5 text-secondary" />
              ~${agent.apiCostPerMonth}/oy
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              ~{agent.apiRequestsPerMonth} so'rov/oy
            </div>
          </div>
        </motion.div>
      </div>

      {/* Publish button */}
      <div className="p-4 border-t border-border/30">
        <Button
          onClick={onPublish}
          className="w-full h-12 text-sm font-semibold rounded-xl gradient-btn border-0 shadow-[0_0_25px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_35px_hsl(var(--primary)/0.3)] transition-shadow gap-2"
        >
          <Rocket className="w-4 h-4" />
          Nashr qilish
        </Button>
      </div>
    </div>
  );
};

export default AgentLiveBuilder;
