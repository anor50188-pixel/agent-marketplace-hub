import { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Clock, Zap, CheckCircle2, ArrowRight, Plus } from "lucide-react";
import { agentStore, type AgentConfig } from "@/lib/agentStore";
import AgentDashboard from "./AgentDashboard";

const TOOL_ICONS: Record<string, string> = {
  "ai-brain": "🧠",
  "web-search": "🔍",
  "social-search": "𝕏",
  "code-execution": "⚡",
  "file-analysis": "📊",
  "http-request": "🌐",
  "database": "🗄️",
  "website-reader": "🌐",
};

const MyAgents = () => {
  const agents = useSyncExternalStore(agentStore.subscribe, agentStore.getAgents);
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);

  if (selectedAgent) {
    return <AgentDashboard agent={selectedAgent} onBack={() => setSelectedAgent(null)} />;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      <div className="px-6 pt-8 pb-4">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Agentlarim</h1>
        <p className="text-sm text-muted-foreground">
          Yaratilgan agentlarni boshqaring va kuzating.
        </p>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        {agents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-5 shadow-lg">
              <Bot className="w-10 h-10 text-primary/60" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground mb-2">Hali agent yaratilmagan</h3>
            <p className="text-muted-foreground text-sm max-w-[280px] mb-5">
              AI agentingizni yarating — u siz uchun avtomatik ishlar bajaradi.
            </p>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-btn text-sm font-semibold">
              <Plus className="w-4 h-4" />
              Agent yaratish
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <AnimatePresence>
              {agents.map((agent, i) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  index={i}
                  onClick={() => setSelectedAgent(agent)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

const AgentCard = ({
  agent,
  index,
  onClick,
}: {
  agent: AgentConfig;
  index: number;
  onClick: () => void;
}) => {
  // Mock mini-stats
  const mockRuns = 120 + index * 47;
  const mockSuccessRate = 92 + (index % 4) * 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="rounded-xl border border-border/40 bg-card/50 p-4 agent-card-glow cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center transition-transform group-hover:scale-110">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm text-foreground">{agent.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  agent.status === "active" ? "bg-green-400 status-pulse" : "bg-muted-foreground/40"
                }`}
              />
              <span className="text-[11px] text-muted-foreground">
                {agent.status === "active" ? "Faol" : "Draft"}
              </span>
            </div>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-all group-hover:translate-x-0.5" />
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{agent.role}</p>

      {/* Mini stats */}
      <div className="flex gap-3 mb-3">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Zap className="w-3 h-3 text-primary/60" />
          <span className="font-medium text-foreground">{mockRuns}</span> ishga tushish
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <CheckCircle2 className="w-3 h-3 text-green-400/60" />
          <span className="font-medium text-foreground">{mockSuccessRate}%</span> muvaffaqiyat
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {agent.tools.map((tool) => (
            <span
              key={tool}
              className="w-6 h-6 rounded-md bg-muted/40 flex items-center justify-center text-xs"
              title={tool}
            >
              {TOOL_ICONS[tool] || "🔧"}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          {agent.createdAt}
        </div>
      </div>
    </motion.div>
  );
};

export default MyAgents;
