import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Bot, Play, Pause, Settings, Activity,
  TrendingUp, Clock, Zap, MessageSquare, BarChart3,
  CheckCircle2, AlertCircle, Globe, Brain, Search
} from "lucide-react";
import { Button } from "./ui/button";
import { type AgentConfig } from "@/lib/agentStore";
import { toast } from "@/hooks/use-toast";

const TOOL_META: Record<string, { icon: string; label: string }> = {
  "ai-brain": { icon: "🧠", label: "AI Brain" },
  "web-search": { icon: "🔍", label: "Web Search" },
  "social-search": { icon: "𝕏", label: "Social Media" },
  "code-execution": { icon: "⚡", label: "Code Execution" },
  "file-analysis": { icon: "📊", label: "File Analysis" },
  "http-request": { icon: "🌐", label: "HTTP Request" },
  "database": { icon: "🗄️", label: "Database" },
  "website-reader": { icon: "🌐", label: "Website Reader" },
};

interface AgentDashboardProps {
  agent: AgentConfig;
  onBack: () => void;
}

// Mock stats
const mockStats = {
  totalRuns: 247,
  successRate: 94.3,
  avgResponseTime: "1.2s",
  tokensUsed: 184320,
  lastRun: "2 soat oldin",
  uptime: "99.8%",
};

const mockActivityLog = [
  { id: 1, action: "Vazifa muvaffaqiyatli bajarildi", time: "2 soat oldin", status: "success" },
  { id: 2, action: "Web qidiruv amalga oshirildi", time: "2 soat oldin", status: "success" },
  { id: 3, action: "Ma'lumotlar tahlil qilindi", time: "5 soat oldin", status: "success" },
  { id: 4, action: "API so'rov xatolik berdi", time: "8 soat oldin", status: "error" },
  { id: 5, action: "Jadval bo'yicha ishga tushdi", time: "12 soat oldin", status: "success" },
  { id: 6, action: "Hisobot tayyorlandi", time: "1 kun oldin", status: "success" },
];

const mockWeeklyData = [
  { day: "Du", runs: 32 },
  { day: "Se", runs: 45 },
  { day: "Cho", runs: 28 },
  { day: "Pa", runs: 52 },
  { day: "Ju", runs: 38 },
  { day: "Sh", runs: 41 },
  { day: "Ya", runs: 11 },
];

const mockWorkflow = [
  { id: 1, label: "Trigger", desc: "Har 6 soatda", icon: Clock },
  { id: 2, label: "Ma'lumot yig'ish", desc: "Web Search API", icon: Search },
  { id: 3, label: "Tahlil", desc: "AI Brain orqali", icon: Brain },
  { id: 4, label: "Natija", desc: "Hisobot yuborish", icon: MessageSquare },
];

const AgentDashboard = ({ agent, onBack }: AgentDashboardProps) => {
  const [isRunning, setIsRunning] = useState(agent.status === "active");
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "settings">("overview");

  const toggleAgent = () => {
    setIsRunning(!isRunning);
    toast({
      title: isRunning ? "⏸ Agent to'xtatildi" : "▶️ Agent ishga tushirildi",
      description: agent.name,
    });
  };

  const maxRuns = Math.max(...mockWeeklyData.map((d) => d.runs));

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border/30">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">{agent.name}</h1>
                <p className="text-xs text-muted-foreground">{agent.role}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                isRunning
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
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

        {/* Tabs */}
        <div className="flex gap-1">
          {[
            { id: "overview" as const, label: "Umumiy", icon: BarChart3 },
            { id: "activity" as const, label: "Faoliyat", icon: Activity },
            { id: "settings" as const, label: "Sozlamalar", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
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
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Jami ishga tushish", value: mockStats.totalRuns, icon: Zap, color: "text-primary" },
                { label: "Muvaffaqiyat", value: `${mockStats.successRate}%`, icon: CheckCircle2, color: "text-green-400" },
                { label: "O'rtacha javob", value: mockStats.avgResponseTime, icon: Clock, color: "text-secondary" },
                { label: "Tokenlar", value: mockStats.tokensUsed.toLocaleString(), icon: Activity, color: "text-accent" },
                { label: "Oxirgi ishga tushish", value: mockStats.lastRun, icon: TrendingUp, color: "text-primary" },
                { label: "Uptime", value: mockStats.uptime, icon: Globe, color: "text-green-400" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border/30 bg-card/50 p-3"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                    <span className="text-[10px] text-muted-foreground">{stat.label}</span>
                  </div>
                  <p className="font-display font-bold text-lg text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Workflow + Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Workflow */}
              <div className="rounded-xl border border-border/30 bg-card/50 p-5">
                <h3 className="font-display font-semibold text-sm text-foreground mb-4">Ish tartibi</h3>
                <div className="space-y-1">
                  {mockWorkflow.map((step, i) => (
                    <div key={step.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <step.icon className="w-4 h-4 text-primary" />
                        </div>
                        {i < mockWorkflow.length - 1 && (
                          <div className="w-0.5 h-6 bg-border/40 my-1" />
                        )}
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-medium text-foreground">{step.label}</p>
                        <p className="text-[11px] text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Chart */}
              <div className="rounded-xl border border-border/30 bg-card/50 p-5">
                <h3 className="font-display font-semibold text-sm text-foreground mb-4">Haftalik statistika</h3>
                <div className="flex items-end gap-2 h-32">
                  {mockWeeklyData.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground font-medium">{d.runs}</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.runs / maxRuns) * 100}%` }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="w-full rounded-md bg-gradient-to-t from-primary to-primary/50 min-h-[4px]"
                      />
                      <span className="text-[10px] text-muted-foreground">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tools */}
            <div className="rounded-xl border border-border/30 bg-card/50 p-5">
              <h3 className="font-display font-semibold text-sm text-foreground mb-3">Ulangan toollar</h3>
              <div className="flex flex-wrap gap-2">
                {agent.tools.map((toolId) => {
                  const meta = TOOL_META[toolId];
                  return (
                    <div
                      key={toolId}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/30"
                    >
                      <span className="text-base">{meta?.icon || "🔧"}</span>
                      <span className="text-xs font-medium text-foreground">{meta?.label || toolId}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "activity" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            <h3 className="font-display font-semibold text-sm text-foreground mb-3">Faoliyat tarixi</h3>
            {mockActivityLog.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/30 bg-card/50"
              >
                {log.status === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                )}
                <span className="text-sm text-foreground flex-1">{log.action}</span>
                <span className="text-[11px] text-muted-foreground">{log.time}</span>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-lg">
            <h3 className="font-display font-semibold text-sm text-foreground mb-3">Agent sozlamalari</h3>
            <div className="space-y-3">
              <div className="rounded-xl border border-border/30 bg-card/50 p-4">
                <label className="text-xs text-muted-foreground mb-1.5 block">Agent nomi</label>
                <input
                  defaultValue={agent.name}
                  className="w-full h-9 rounded-lg border border-border/50 bg-muted/20 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="rounded-xl border border-border/30 bg-card/50 p-4">
                <label className="text-xs text-muted-foreground mb-1.5 block">Vazifasi</label>
                <textarea
                  defaultValue={agent.role}
                  rows={3}
                  className="w-full rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
              <div className="rounded-xl border border-border/30 bg-card/50 p-4">
                <label className="text-xs text-muted-foreground mb-1.5 block">Ishga tushirish jadvali</label>
                <select className="w-full h-9 rounded-lg border border-border/50 bg-muted/20 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option>Har 6 soatda</option>
                  <option>Har soatda</option>
                  <option>Har kuni</option>
                  <option>Har hafta</option>
                  <option>Qo'lda</option>
                </select>
              </div>
              <Button className="gradient-btn border-0 h-9 text-xs rounded-lg">
                Saqlash
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
