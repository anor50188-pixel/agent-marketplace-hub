import { motion } from "framer-motion";
import { Search, Globe, Code, Twitter, FileText, BarChart3, Bot, ExternalLink, Check } from "lucide-react";

interface Tool {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  brandColor: string;
  glowColor: string;
  url?: string;
}

const tools: Tool[] = [
  { id: "web-search", label: "Web Qidiruv", description: "Serper API — Internetdan ma'lumot topish", icon: Search, brandColor: "#3b82f6", glowColor: "59,130,246", url: "https://serper.dev" },
  { id: "website-reader", label: "Sayt O'quvchi", description: "Firecrawl — Web sahifani tahlil qilish", icon: Globe, brandColor: "#f97316", glowColor: "249,115,22", url: "https://www.firecrawl.dev" },
  { id: "code-execution", label: "Kod Ishlatish", description: "E2B — Kod yozish va avtomatlashtirish", icon: Code, brandColor: "#10b981", glowColor: "16,185,129", url: "https://e2b.dev" },
  { id: "social-search", label: "Ijtimoiy Qidiruv", description: "X API — Trend tahlili", icon: Twitter, brandColor: "#ffffff", glowColor: "255,255,255", url: "https://developer.x.com" },
  { id: "file-analysis", label: "Fayl Tahlili", description: "CSV, PDF, Excel tahlil qilish", icon: FileText, brandColor: "#8b5cf6", glowColor: "139,92,246" },
  { id: "dashboard-builder", label: "Dashboard Yaratuvchi", description: "Vizual natija panellari", icon: BarChart3, brandColor: "#06b6d4", glowColor: "6,182,212" },
  { id: "ai-brain", label: "AI Miya", description: "MiniMax — Agent aql-zakovati", icon: Bot, brandColor: "#a855f7", glowColor: "168,85,247", url: "https://www.minimaxi.com" },
];

interface ToolPowerCardsProps {
  selectedTools: string[];
  onToggle: (id: string) => void;
}

const ToolPowerCards = ({ selectedTools, onToggle }: ToolPowerCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {tools.map((tool) => {
        const isSelected = selectedTools.includes(tool.id);
        return (
          <motion.button
            key={tool.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onToggle(tool.id)}
            className="relative group p-4 rounded-xl border text-left transition-all duration-300"
            style={{
              borderColor: isSelected ? `rgba(${tool.glowColor}, 0.5)` : "rgba(255,255,255,0.08)",
              backgroundColor: isSelected ? `rgba(${tool.glowColor}, 0.08)` : "rgba(255,255,255,0.03)",
              boxShadow: isSelected ? `0 0 25px rgba(${tool.glowColor}, 0.2), inset 0 1px 0 rgba(${tool.glowColor}, 0.1)` : "none",
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: isSelected ? `rgba(${tool.glowColor}, 0.2)` : "rgba(255,255,255,0.05)" }}
              >
                <tool.icon className="w-5 h-5" style={{ color: isSelected ? tool.brandColor : "#94a3b8" }} />
              </div>
              <div
                className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                style={{
                  borderColor: isSelected ? tool.brandColor : "rgba(255,255,255,0.15)",
                  backgroundColor: isSelected ? tool.brandColor : "transparent",
                }}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <p className="text-sm font-semibold text-white mb-0.5">{tool.label}</p>
            <p className="text-xs text-slate-400">{tool.description}</p>
            {tool.url && isSelected && (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium transition-colors hover:opacity-80"
                style={{ color: tool.brandColor }}
              >
                <ExternalLink className="w-3 h-3" />
                Register & Get API Key
              </a>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default ToolPowerCards;
