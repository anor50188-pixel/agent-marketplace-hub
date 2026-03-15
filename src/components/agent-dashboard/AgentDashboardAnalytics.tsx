import { motion } from "framer-motion";
import {
  BarChart3, Users, Zap, AlertTriangle, TrendingUp, TrendingDown,
} from "lucide-react";

const mockAnalytics = {
  totalRequests: 3842,
  activeUsers: 28,
  tokensUsed: 1243800,
  errorRate: 2.1,
  requestsTrend: +18.4,
  usersTrend: +5,
  tokensTrend: +22.1,
  errorTrend: -0.8,
};

const mockDailyRequests = [
  { date: "10-Mar", value: 120 },
  { date: "11-Mar", value: 185 },
  { date: "12-Mar", value: 142 },
  { date: "13-Mar", value: 210 },
  { date: "14-Mar", value: 198 },
  { date: "15-Mar", value: 245 },
  { date: "16-Mar", value: 178 },
];

const mockSuccessRate = [
  { date: "10-Mar", rate: 96.2 },
  { date: "11-Mar", rate: 97.8 },
  { date: "12-Mar", rate: 94.1 },
  { date: "13-Mar", rate: 98.5 },
  { date: "14-Mar", rate: 97.2 },
  { date: "15-Mar", rate: 99.1 },
  { date: "16-Mar", rate: 97.9 },
];

const mockTopEndpoints = [
  { endpoint: "/chat", calls: 1820, pct: 47 },
  { endpoint: "/run", calls: 1102, pct: 29 },
  { endpoint: "/status", calls: 640, pct: 17 },
  { endpoint: "/history", calls: 280, pct: 7 },
];

const AgentDashboardAnalytics = () => {
  const maxReq = Math.max(...mockDailyRequests.map((d) => d.value));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Jami so'rovlar", value: mockAnalytics.totalRequests.toLocaleString(), icon: Zap, trend: mockAnalytics.requestsTrend, color: "text-primary" },
          { label: "Faol foydalanuvchilar", value: mockAnalytics.activeUsers, icon: Users, trend: mockAnalytics.usersTrend, color: "text-secondary" },
          { label: "Tokenlar ishlatildi", value: `${(mockAnalytics.tokensUsed / 1000).toFixed(0)}K`, icon: BarChart3, trend: mockAnalytics.tokensTrend, color: "text-accent" },
          { label: "Xatolik darajasi", value: `${mockAnalytics.errorRate}%`, icon: AlertTriangle, trend: mockAnalytics.errorTrend, color: "text-destructive" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border/30 bg-card/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <div className={`flex items-center gap-0.5 text-[10px] font-medium ${
                stat.trend > 0 ? "text-green-400" : "text-destructive"
              }`}>
                {stat.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend > 0 ? "+" : ""}{stat.trend}%
              </div>
            </div>
            <p className="font-display font-bold text-xl text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Requests chart */}
        <div className="rounded-xl border border-border/30 bg-card/50 p-5">
          <h3 className="font-display font-semibold text-sm text-foreground mb-4">Kunlik so'rovlar</h3>
          <div className="flex items-end gap-2 h-36">
            {mockDailyRequests.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[9px] text-muted-foreground">{d.value}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / maxReq) * 100}%` }}
                  transition={{ duration: 0.6 }}
                  className="w-full rounded-md bg-gradient-to-t from-primary to-primary/40 min-h-[4px]"
                />
                <span className="text-[9px] text-muted-foreground">{d.date.split("-")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Success rate */}
        <div className="rounded-xl border border-border/30 bg-card/50 p-5">
          <h3 className="font-display font-semibold text-sm text-foreground mb-4">Muvaffaqiyat darajasi</h3>
          <div className="flex items-end gap-2 h-36">
            {mockSuccessRate.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[9px] text-muted-foreground">{d.rate}%</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${d.rate}%` }}
                  transition={{ duration: 0.6 }}
                  className="w-full rounded-md bg-gradient-to-t from-green-500 to-green-400/40 min-h-[4px]"
                />
                <span className="text-[9px] text-muted-foreground">{d.date.split("-")[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top endpoints */}
      <div className="rounded-xl border border-border/30 bg-card/50 p-5">
        <h3 className="font-display font-semibold text-sm text-foreground mb-4">Eng ko'p ishlatiladigan endpointlar</h3>
        <div className="space-y-3">
          {mockTopEndpoints.map((ep) => (
            <div key={ep.endpoint} className="flex items-center gap-3">
              <code className="text-xs font-mono text-foreground w-20">{ep.endpoint}</code>
              <div className="flex-1 h-2 rounded-full bg-muted/30 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ep.pct}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full bg-gradient-to-r from-secondary to-primary"
                />
              </div>
              <span className="text-xs text-muted-foreground w-16 text-right">{ep.calls.toLocaleString()}</span>
              <span className="text-[10px] text-muted-foreground w-8">{ep.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AgentDashboardAnalytics;
