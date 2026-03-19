import { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign, Eye, Star, MessageSquare, TrendingUp, TrendingDown,
  Bot, ShoppingCart, Users, BarChart3, ArrowUpRight, Clock, ChevronDown
} from "lucide-react";
import { agentStore, type AgentConfig } from "@/lib/agentStore";
import { subscriptionStore } from "@/lib/subscriptionStore";
import UpgradePrompt from "./UpgradePrompt";

// Mock seller stats
const overviewStats = {
  totalRevenue: 1284,
  totalSales: 47,
  totalViews: 12400,
  totalReviews: 89,
  revenueTrend: +23.5,
  salesTrend: +12,
  viewsTrend: +8.2,
  reviewsTrend: +15,
};

const weeklyData = [
  { day: "Dush", sales: 3, views: 420, revenue: 87 },
  { day: "Sesh", sales: 5, views: 580, revenue: 145 },
  { day: "Chor", sales: 2, views: 390, revenue: 58 },
  { day: "Pay", sales: 7, views: 710, revenue: 203 },
  { day: "Jum", sales: 8, views: 890, revenue: 232 },
  { day: "Shan", sales: 4, views: 520, revenue: 116 },
  { day: "Yak", sales: 6, views: 640, revenue: 174 },
];

const buyerMessages = [
  { id: 1, buyer: "Jasur M.", agent: "AI Trend Tracker", message: "Agent juda yaxshi ishlayapti, rahmat!", time: "2 soat oldin", read: false },
  { id: 2, buyer: "Nilufar K.", agent: "Social Monitor", message: "API limit haqida savol bor edi...", time: "5 soat oldin", read: false },
  { id: 3, buyer: "Sardor A.", agent: "AI Trend Tracker", message: "Yangi funksiya qo'shish mumkinmi?", time: "1 kun oldin", read: true },
  { id: 4, buyer: "Dilnoza R.", agent: "Social Monitor", message: "Ajoyib agent! 5 yulduz ⭐", time: "2 kun oldin", read: true },
  { id: 5, buyer: "Bekzod T.", agent: "AI Trend Tracker", message: "Telegram integratsiyasi bormi?", time: "3 kun oldin", read: true },
];

const recentReviews = [
  { buyer: "Alisher N.", agent: "AI Trend Tracker", rating: 5, text: "Eng yaxshi agent! Har kuni ishlataman.", time: "1 kun oldin" },
  { buyer: "Madina S.", agent: "Social Monitor", rating: 4, text: "Yaxshi, lekin tezlikni oshirsa bo'lardi.", time: "2 kun oldin" },
  { buyer: "Otabek J.", agent: "AI Trend Tracker", rating: 5, text: "Pulimga arzidi, tavsiya qilaman.", time: "3 kun oldin" },
];

const Statistics = ({ onSectionChange }: { onSectionChange?: (id: string) => void }) => {
  const agents = useSyncExternalStore(agentStore.subscribe, agentStore.getAgents);
  const canUseAnalytics = subscriptionStore.canUseAnalytics();
  const publishedAgents = agents.filter((a) => a.status === "published" || a.totalSales);
  const [period, setPeriod] = useState<"hafta" | "oy" | "yil">("hafta");

  const maxSales = Math.max(...weeklyData.map((d) => d.sales));
  const maxViews = Math.max(...weeklyData.map((d) => d.views));

  if (!canUseAnalytics) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-background">
        <div className="px-6 pt-8 pb-4">
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Marketplace <span className="gradient-text">Statistika</span>
          </h1>
          <p className="text-sm text-muted-foreground">Agentlaringiz statistikasi va analitikasi</p>
        </div>
        <div className="px-6">
          <UpgradePrompt
            title="Statistika uchun Pro reja kerak"
            description="Batafsil analitika, sotuvlar statistikasi va grafiklarni ko'rish uchun rejangizni yangilang."
            requiredPlan="Pro"
            onUpgrade={() => onSectionChange?.("subscriptions")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      <div className="px-6 pt-8 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-1">
              <span className="gradient-text">Statistika</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Marketplace'dagi agentlaringiz ko'rsatkichlari
            </p>
          </div>
          <div className="period-pill flex gap-0.5">
            {(["hafta", "oy", "yil"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                  period === p
                    ? "period-pill-active"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4 space-y-5">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Jami daromad", value: `$${overviewStats.totalRevenue}`, icon: DollarSign, trend: overviewStats.revenueTrend, color: "text-secondary" },
            { label: "Sotuvlar", value: overviewStats.totalSales, icon: ShoppingCart, trend: overviewStats.salesTrend, color: "text-primary" },
            { label: "Ko'rishlar", value: `${(overviewStats.totalViews / 1000).toFixed(1)}K`, icon: Eye, trend: overviewStats.viewsTrend, color: "text-accent" },
            { label: "Sharhlar", value: overviewStats.totalReviews, icon: Star, trend: overviewStats.reviewsTrend, color: "text-yellow-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="stat-card-gradient rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <div className={`flex items-center gap-0.5 text-[10px] font-semibold ${
                  stat.trend > 0 ? "text-emerald-400" : "text-destructive"
                }`}>
                  {stat.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.trend > 0 ? "+" : ""}{stat.trend}%
                </div>
              </div>
              <p className="font-display font-bold text-xl text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Sales chart */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-sm text-card-foreground">Haftalik sotuvlar</h3>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                Bu hafta: {weeklyData.reduce((s, d) => s + d.sales, 0)} ta
              </span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {weeklyData.map((d, i) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[9px] font-medium text-foreground">{d.sales}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.sales / maxSales) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="w-full rounded-md bg-gradient-to-t from-primary to-primary/30 min-h-[4px]"
                  />
                  <span className="text-[9px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Views chart */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-sm text-card-foreground">Haftalik ko'rishlar</h3>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Eye className="w-3 h-3 text-accent" />
                Bu hafta: {(weeklyData.reduce((s, d) => s + d.views, 0) / 1000).toFixed(1)}K
              </span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {weeklyData.map((d, i) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[9px] font-medium text-foreground">{d.views}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.views / maxViews) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="w-full rounded-md bg-gradient-to-t from-accent to-accent/30 min-h-[4px]"
                  />
                  <span className="text-[9px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm text-card-foreground">Haftalik daromad</h3>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-secondary" />
              Bu hafta: ${weeklyData.reduce((s, d) => s + d.revenue, 0)}
            </span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {weeklyData.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[9px] font-medium text-foreground">${d.revenue}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.revenue / Math.max(...weeklyData.map(w => w.revenue))) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="w-full rounded-md bg-gradient-to-t from-secondary to-secondary/30 min-h-[4px]"
                />
                <span className="text-[9px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Published Agents Performance */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold text-sm text-card-foreground mb-4">Agent ko'rsatkichlari</h3>
            {agents.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">Hali agent yo'q</p>
            ) : (
              <div className="space-y-3">
                {agents.slice(0, 5).map((agent, i) => {
                  const mockSales = Math.floor(Math.random() * 50 + 10);
                  const mockViews = Math.floor(Math.random() * 2000 + 500);
                  const mockRating = (Math.random() * 1.5 + 3.5).toFixed(1);
                  return (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20 border border-border"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{agent.name}</p>
                        <p className="text-[10px] text-muted-foreground">{agent.category || "General"}</p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <ShoppingCart className="w-3 h-3" /> {agent.totalSales || mockSales}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Eye className="w-3 h-3" /> {agent.totalViews || mockViews}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-yellow-500" /> {agent.reviews?.rating || mockRating}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Buyer Messages */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-sm text-card-foreground">Xaridor xabarlari</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/15 text-primary">
                {buyerMessages.filter((m) => !m.read).length} yangi
              </span>
            </div>
            <div className="space-y-2.5">
              {buyerMessages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`p-3 rounded-lg border transition-colors ${
                    msg.read
                      ? "border-border bg-muted/10"
                      : "border-primary/20 bg-primary/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                        {msg.buyer.charAt(0)}
                      </div>
                      <span className="text-[11px] font-semibold text-foreground">{msg.buyer}</span>
                      {!msg.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {msg.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed pl-8">{msg.message}</p>
                  <p className="text-[9px] text-primary/60 pl-8 mt-0.5">→ {msg.agent}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display font-semibold text-sm text-card-foreground mb-4">So'nggi sharhlar</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentReviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-lg border border-border bg-muted/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                      {review.buyer.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-foreground">{review.buyer}</p>
                      <p className="text-[9px] text-muted-foreground">{review.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        className={`w-3 h-3 ${si < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/20"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{review.text}</p>
                <p className="text-[9px] text-primary/60 mt-1.5">→ {review.agent}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
