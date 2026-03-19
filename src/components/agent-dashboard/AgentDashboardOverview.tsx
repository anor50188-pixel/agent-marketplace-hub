import { motion } from "framer-motion";
import {
  Zap, CheckCircle2, Clock, Activity, TrendingUp, Globe,
  Search, Brain, MessageSquare,
} from "lucide-react";
import { type AgentConfig } from "@/lib/agentStore";

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

const mockStats = {
  totalRuns: 247,
  successRate: 94.3,
  avgResponseTime: "1.2s",
  tokensUsed: 184320,
  lastRun: "2 soat oldin",
  uptime: "99.8%",
};

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

interface Props {
  agent: AgentConfig;
}

const AgentDashboardOverview = ({ agent }: Props) => {
  const maxRuns = Math.max(...mockWeeklyData.map((d) => d.runs));

  const stats = [
    { label: "Jami ishga tushish", value: mockStats.totalRuns, icon: Zap, color: "text-primary", bgGradient: "from-primary/10 to-primary/5" },
    { label: "Muvaffaqiyat", value: `${mockStats.successRate}%`, icon: CheckCircle2, color: "text-green-400", bgGradient: "from-green-500/10 to-green-500/5" },
    { label: "O'rtacha javob", value: mockStats.avgResponseTime, icon: Clock, color: "text-secondary", bgGradient: "from-secondary/10 to-secondary/5" },
    { label: "Tokenlar", value: mockStats.tokensUsed.toLocaleString(), icon: Activity, color: "text-accent", bgGradient: "from-accent/10 to-accent/5" },
    { label: "Oxirgi ishga tushish", value: mockStats.lastRun, icon: TrendingUp, color: "text-primary", bgGradient: "from-primary/10 to-primary/5" },
    { label: "Uptime", value: mockStats.uptime, icon: Globe, color: "text-green-400", bgGradient: "from-green-500/10 to-green-500/5" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`stat-card-gradient rounded-xl p-3 bg-gradient-to-br ${stat.bgGradient}`}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
              <span className="text-[10px] text-muted-foreground">{stat.label}</span>
            </div>
            <p className="font-display font-bold text-lg text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Workflow + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border/30 bg-card/50 p-5">
          <h3 className="font-display font-semibold text-sm text-foreground mb-4">Ish tartibi</h3>
          <div className="space-y-1">
            {mockWorkflow.map((step, i) => (
              <div key={step.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center">
                    <step.icon className="w-4 h-4 text-primary" />
                  </div>
                  {i < mockWorkflow.length - 1 && <div className="w-0.5 h-6 bg-gradient-to-b from-primary/20 to-transparent my-1" />}
                </div>
                <div className="pt-1">
                  <p className="text-sm font-medium text-foreground">{step.label}</p>
                  <p className="text-[11px] text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/30 bg-card/50 p-5">
          <h3 className="font-display font-semibold text-sm text-foreground mb-4">Haftalik statistika</h3>
          <div className="flex items-end gap-2 h-32">
            {mockWeeklyData.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground font-medium">{d.runs}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.runs / maxRuns) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.04 }}
                  className="w-full rounded-md bg-gradient-to-t from-primary to-primary/30 min-h-[4px]"
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
              <div key={toolId} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/30 agent-card-glow">
                <span className="text-base">{meta?.icon || "🔧"}</span>
                <span className="text-xs font-medium text-foreground">{meta?.label || toolId}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default AgentDashboardOverview;
