import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Eye, EyeOff, RefreshCw, Globe, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { type AgentConfig } from "@/lib/agentStore";

const mockApiKey = "agts_sk_7f3k9x2m4n8p1q5r6t0w";

const mockEndpoints = [
  { method: "POST", path: "/api/agent/{id}/chat", desc: "Agent bilan suhbat yuborish", status: "active" },
  { method: "GET", path: "/api/agent/{id}/status", desc: "Agent holatini tekshirish", status: "active" },
  { method: "POST", path: "/api/agent/{id}/run", desc: "Agentni ishga tushirish", status: "active" },
  { method: "GET", path: "/api/agent/{id}/history", desc: "Suhbat tarixini olish", status: "active" },
  { method: "DELETE", path: "/api/agent/{id}/sessions", desc: "Sessiyalarni tozalash", status: "beta" },
];

const mockUsage = {
  requestsToday: 142,
  requestsLimit: 1000,
  rateLimit: "60 req/min",
  latency: "~320ms",
};

interface Props {
  agent: AgentConfig;
}

const AgentDashboardAPI = ({ agent }: Props) => {
  const [showKey, setShowKey] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(mockApiKey);
    toast({ title: "📋 API kalit nusxalandi" });
  };

  const regenerateKey = () => {
    toast({ title: "🔄 Yangi API kalit yaratildi", description: "Eskilari endi ishlamaydi." });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
      {/* API Key */}
      <div className="rounded-xl border border-border/30 bg-card/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold text-sm text-foreground">API Kalit</h3>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-9 rounded-lg border border-border/50 bg-muted/20 px-3 flex items-center">
            <code className="text-xs text-foreground font-mono">
              {showKey ? mockApiKey : "agts_sk_••••••••••••••••••••"}
            </code>
          </div>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => setShowKey(!showKey)}>
            {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={copyKey}>
            <Copy className="w-3.5 h-3.5" />
          </Button>
        </div>
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={regenerateKey}>
          <RefreshCw className="w-3 h-3" />
          Qayta yaratish
        </Button>
      </div>

      {/* Usage */}
      <div className="rounded-xl border border-border/30 bg-card/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-accent" />
          <h3 className="font-display font-semibold text-sm text-foreground">Foydalanish</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Bugungi so'rovlar", value: `${mockUsage.requestsToday} / ${mockUsage.requestsLimit}` },
            { label: "Rate limit", value: mockUsage.rateLimit },
            { label: "O'rtacha kechikish", value: mockUsage.latency },
            { label: "Holat", value: "✅ Faol" },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-lg bg-muted/20 border border-border/20">
              <p className="text-[10px] text-muted-foreground mb-1">{item.label}</p>
              <p className="text-sm font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Kunlik limit</span>
            <span>{Math.round((mockUsage.requestsToday / mockUsage.requestsLimit) * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(mockUsage.requestsToday / mockUsage.requestsLimit) * 100}%` }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
        </div>
      </div>

      {/* Endpoints */}
      <div className="rounded-xl border border-border/30 bg-card/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-secondary" />
          <h3 className="font-display font-semibold text-sm text-foreground">Endpointlar</h3>
        </div>
        <div className="space-y-2">
          {mockEndpoints.map((ep) => (
            <div
              key={ep.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border/20 bg-muted/10 hover:bg-muted/20 transition-colors"
            >
              <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                ep.method === "POST" ? "bg-primary/10 text-primary"
                : ep.method === "DELETE" ? "bg-destructive/10 text-destructive"
                : "bg-accent/10 text-accent"
              }`}>
                {ep.method}
              </span>
              <code className="text-xs text-foreground font-mono flex-1">{ep.path}</code>
              <span className="text-[11px] text-muted-foreground hidden md:block">{ep.desc}</span>
              {ep.status === "beta" && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                  BETA
                </span>
              )}
            </div>
          ))}
        </div>
        {/* Code example */}
        <div className="mt-4 p-3 rounded-lg bg-muted/20 border border-border/20">
          <p className="text-[10px] text-muted-foreground mb-2">Namuna so'rov:</p>
          <pre className="text-xs text-foreground font-mono overflow-x-auto whitespace-pre">
{`curl -X POST https://agentus.ai/api/agent/${agent.id}/chat \\
  -H "Authorization: Bearer ${showKey ? mockApiKey : "YOUR_API_KEY"}" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Bugungi trendlarni tahlil qil"}'`}
          </pre>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentDashboardAPI;
