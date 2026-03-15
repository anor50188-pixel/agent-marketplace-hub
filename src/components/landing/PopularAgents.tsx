import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye, Bot, ShieldCheck, ArrowRight } from "lucide-react";
import { marketplaceAgents } from "@/lib/marketplaceData";
import { Button } from "../ui/button";

const TOOL_ICONS: Record<string, string> = {
  "ai-brain": "🧠",
  "web-search": "🔍",
  "social-search": "𝕏",
  "code-execution": "⚡",
  "file-analysis": "📊",
  "http-request": "🌐",
  "database": "🗄️",
};

interface PopularAgentsProps {
  onOpenDashboard?: () => void;
}

const PopularAgents = ({ onOpenDashboard }: PopularAgentsProps) => {
  const topAgents = [...marketplaceAgents]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 4);

  return (
    <section id="marketplace" className="relative py-24 overflow-hidden scroll-mt-20">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card/50 text-muted-foreground mb-4">
            <ShoppingCart className="w-3.5 h-3.5 text-secondary" />
            Marketplace
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Eng <span className="gradient-text">mashhur</span> agentlar
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Marketplace'dan tayyor agentlarni sotib oling yoki o'zingiznikini yarating
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topAgents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(250_85%_65%_/_0.08)] transition-all group"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-sm text-card-foreground truncate">
                    {agent.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] text-muted-foreground">{agent.seller}</span>
                    {agent.verified && <ShieldCheck className="w-3 h-3 text-secondary" />}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                {agent.role}
              </p>

              {/* Tools */}
              <div className="flex flex-wrap gap-1 mb-3">
                {agent.tools.slice(0, 3).map((t) => (
                  <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground">
                    {TOOL_ICONS[t] || "🔧"} {t.replace("-", " ")}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-primary" />
                  {agent.rating} ({agent.reviewCount})
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {(agent.totalViews || 0).toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingCart className="w-3 h-3" />
                  {agent.downloads}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-secondary">${agent.price}</span>
                <span className="text-[10px] text-muted-foreground/60">~${agent.apiCostPerMonth}/oy API</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <Button
            onClick={onOpenDashboard}
            variant="outline"
            className="rounded-xl border-border hover:border-primary/30 hover:bg-primary/5"
          >
            Marketplace'ni ko'rish
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularAgents;
