import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Bot, Play, Pause, BarChart3, MessageSquare,
  Globe, Activity, Settings,
} from "lucide-react";
import { Button } from "./ui/button";
import { type AgentConfig } from "@/lib/agentStore";
import { toast } from "@/hooks/use-toast";
import AgentDashboardOverview from "./agent-dashboard/AgentDashboardOverview";
import AgentDashboardChat from "./agent-dashboard/AgentDashboardChat";
import AgentDashboardAPI from "./agent-dashboard/AgentDashboardAPI";
import AgentDashboardAnalytics from "./agent-dashboard/AgentDashboardAnalytics";
import AgentDashboardSettings from "./agent-dashboard/AgentDashboardSettings";

type Tab = "dashboard" | "chat" | "api" | "analytics" | "settings";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "api", label: "API", icon: Globe },
  { id: "analytics", label: "Analytics", icon: Activity },
  { id: "settings", label: "Sozlamalar", icon: Settings },
];

interface AgentDashboardProps {
  agent: AgentConfig;
  onBack: () => void;
}

const AgentDashboard = ({ agent, onBack }: AgentDashboardProps) => {
  const [isRunning, setIsRunning] = useState(agent.status === "active");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const toggleAgent = () => {
    setIsRunning(!isRunning);
    toast({
      title: isRunning ? "⏸ Agent to'xtatildi" : "▶️ Agent ishga tushirildi",
      description: agent.name,
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      {/* Header */}
      <div className="px-6 pt-5 pb-0 border-b border-border/30">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">{agent.name}</h1>
              <p className="text-[11px] text-muted-foreground line-clamp-1">{agent.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                isRunning
                  ? "bg-green-500/10 text-green-400 border border-green-500/20 status-pulse"
                  : "bg-muted/40 text-muted-foreground border border-border/40"
              }`}
            >
              {isRunning ? "● Faol" : "○ To'xtatilgan"}
            </span>
            <Button
              onClick={toggleAgent}
              size="sm"
              variant={isRunning ? "outline" : "default"}
              className="gap-1.5 h-8 text-xs rounded-lg"
            >
              {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isRunning ? "To'xtatish" : "Ishga tushirish"}
            </Button>
          </div>
        </div>

        {/* Tabs with bottom indicator */}
        <div className="flex gap-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "text-primary tab-bottom-active"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "dashboard" && <AgentDashboardOverview agent={agent} />}
        {activeTab === "chat" && <AgentDashboardChat agent={agent} />}
        {activeTab === "api" && <AgentDashboardAPI agent={agent} />}
        {activeTab === "analytics" && <AgentDashboardAnalytics />}
        {activeTab === "settings" && <AgentDashboardSettings agent={agent} />}
      </div>
    </div>
  );
};

export default AgentDashboard;
