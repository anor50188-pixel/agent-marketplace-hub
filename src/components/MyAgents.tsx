import { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Clock } from "lucide-react";
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-sm">Hali agent yaratilmagan</p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              "Agent yaratish" bo'limidan boshlang
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="rounded-xl border border-border/40 bg-card/50 p-4 hover:border-primary/20 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm text-foreground">{agent.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  agent.status === "active" ? "bg-green-400" : "bg-muted-foreground/40"
                }`}
              />
              <span className="text-[11px] text-muted-foreground">
                {agent.status === "active" ? "Faol" : "Draft"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{agent.role}</p>

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
