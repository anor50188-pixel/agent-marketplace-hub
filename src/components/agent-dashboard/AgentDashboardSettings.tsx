import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Trash2, Eye, EyeOff, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { type AgentConfig } from "@/lib/agentStore";

const AVAILABLE_TOOLS = [
  { id: "ai-brain", label: "AI Brain", icon: "🧠" },
  { id: "web-search", label: "Web Search", icon: "🔍" },
  { id: "social-search", label: "Social Media", icon: "𝕏" },
  { id: "code-execution", label: "Code Execution", icon: "⚡" },
  { id: "file-analysis", label: "File Analysis", icon: "📊" },
  { id: "http-request", label: "HTTP Request", icon: "🌐" },
  { id: "database", label: "Database", icon: "🗄️" },
  { id: "website-reader", label: "Website Reader", icon: "🌐" },
];

interface Props {
  agent: AgentConfig;
}

const AgentDashboardSettings = ({ agent }: Props) => {
  const [name, setName] = useState(agent.name);
  const [systemPrompt, setSystemPrompt] = useState(agent.role);
  const [tools, setTools] = useState<string[]>(agent.tools);
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  const toggleTool = (id: string) => {
    setTools((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
  };

  const handleSave = () => {
    toast({ title: "✅ Sozlamalar saqlandi", description: agent.name });
  };

  const handleDelete = () => {
    toast({ title: "🗑️ Agent o'chirildi", description: agent.name, variant: "destructive" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 max-w-2xl">
      {/* Name */}
      <div className="rounded-xl border border-border/30 bg-card/50 p-4">
        <label className="text-xs text-muted-foreground mb-1.5 block">Agent nomi</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-9 rounded-lg border border-border/50 bg-muted/20 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* System prompt */}
      <div className="rounded-xl border border-border/30 bg-card/50 p-4">
        <label className="text-xs text-muted-foreground mb-1.5 block">System prompt</label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </div>

      {/* Tools */}
      <div className="rounded-xl border border-border/30 bg-card/50 p-4">
        <label className="text-xs text-muted-foreground mb-3 block">Toollar</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {AVAILABLE_TOOLS.map((tool) => {
            const active = tools.includes(tool.id);
            return (
              <button
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                  active
                    ? "bg-primary/10 border-primary/30 text-foreground"
                    : "bg-muted/10 border-border/30 text-muted-foreground hover:border-border/50"
                }`}
              >
                <span>{tool.icon}</span>
                {tool.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visibility & Permissions */}
      <div className="rounded-xl border border-border/30 bg-card/50 p-4">
        <label className="text-xs text-muted-foreground mb-3 block">Ko'rinish va ruxsatlar</label>
        <div className="flex gap-2">
          {[
            { id: "public" as const, label: "Hammaga ochiq", icon: Globe },
            { id: "private" as const, label: "Faqat menga", icon: Shield },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setVisibility(opt.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                visibility === opt.id
                  ? "bg-primary/10 border-primary/30 text-foreground"
                  : "bg-muted/10 border-border/30 text-muted-foreground hover:border-border/50"
              }`}
            >
              <opt.icon className="w-3.5 h-3.5" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule */}
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

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} className="gradient-btn border-0 h-9 text-xs rounded-lg gap-1.5">
          <Save className="w-3.5 h-3.5" />
          Saqlash
        </Button>
        <Button onClick={handleDelete} variant="outline" className="h-9 text-xs rounded-lg gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10">
          <Trash2 className="w-3.5 h-3.5" />
          O'chirish
        </Button>
      </div>
    </motion.div>
  );
};

export default AgentDashboardSettings;
