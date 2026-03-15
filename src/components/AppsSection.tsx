import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ExternalLink, Lock, Unlock, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AppTool {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  connected: boolean;
  color: string;
  glowColor: string;
}

const allTools: AppTool[] = [
  {
    id: "web-search",
    name: "Web Search (Serper)",
    icon: "🔍",
    description: "Google qidiruv natijalarini olish. Agent internetdan ma'lumot qidirishi uchun ishlatiladi.",
    category: "Qidiruv",
    connected: false,
    color: "hsl(230 80% 60%)",
    glowColor: "230 80% 60%",
  },
  {
    id: "website-reader",
    name: "Website Reader (Firecrawl)",
    icon: "🌐",
    description: "Veb-saytlarni o'qish va tahlil qilish. Agent istalgan sahifadan matn va ma'lumot oladi.",
    category: "Qidiruv",
    connected: false,
    color: "hsl(190 70% 50%)",
    glowColor: "190 70% 50%",
  },
  {
    id: "code-execution",
    name: "Code Execution (E2B)",
    icon: "⚡",
    description: "Kod yozish va ishga tushirish. Agent Python, JS va boshqa tillarda kod bajaradi.",
    category: "Ishlab chiqish",
    connected: false,
    color: "hsl(45 90% 55%)",
    glowColor: "45 90% 55%",
  },
  {
    id: "social-search",
    name: "Social Media (X API)",
    icon: "𝕏",
    description: "X (Twitter) dan postlar va trendlarni qidirish. Ijtimoiy tarmoqlarni kuzatish uchun.",
    category: "Ijtimoiy",
    connected: false,
    color: "hsl(210 10% 70%)",
    glowColor: "210 10% 70%",
  },
  {
    id: "file-analysis",
    name: "File / Data Analysis",
    icon: "📊",
    description: "Fayllarni tahlil qilish — CSV, Excel, PDF. Agent ma'lumotlarni o'qiydi va xulosalar chiqaradi.",
    category: "Tahlil",
    connected: false,
    color: "hsl(150 60% 50%)",
    glowColor: "150 60% 50%",
  },
  {
    id: "dashboard-builder",
    name: "Dashboard Builder",
    icon: "📈",
    description: "Interaktiv dashboardlar yaratish. Agent grafiklar, jadvallar va hisobotlar tuzadi.",
    category: "Tahlil",
    connected: false,
    color: "hsl(280 60% 65%)",
    glowColor: "280 60% 65%",
  },
  {
    id: "ai-brain",
    name: "AI Brain (MiniMax)",
    icon: "🧠",
    description: "Asosiy AI modeli. Barcha agentlarning fikrlash qobiliyatini ta'minlaydi. Doimo faol.",
    category: "AI",
    connected: true,
    color: "hsl(260 60% 65%)",
    glowColor: "260 60% 65%",
  },
];

const categories = ["Hammasi", "Qidiruv", "Ishlab chiqish", "Ijtimoiy", "Tahlil", "AI"];

const AppsSection = () => {
  const [tools, setTools] = useState<AppTool[]>(allTools);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Hammasi");

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "Hammasi" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConnect = (toolId: string) => {
    if (toolId === "ai-brain") return;

    setTools((prev) =>
      prev.map((t) =>
        t.id === toolId ? { ...t, connected: !t.connected } : t
      )
    );

    const tool = tools.find((t) => t.id === toolId);
    if (!tool) return;

    if (!tool.connected) {
      toast({
        title: `✅ ${tool.name} ulandi`,
        description: "Endi agent yaratishda bu tool'dan foydalanishingiz mumkin.",
      });
    } else {
      toast({
        title: `🔒 ${tool.name} uzildi`,
        description: "API key olib tashlandi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Ilovalar
          </h1>
          <p className="text-sm text-muted-foreground">
            Agent uchun tool'larni ulang. API key qo'shib, agent'ga yangi qobiliyatlar bering.
          </p>
        </motion.div>

        {/* Search & Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-5 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tool qidirish..."
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted/30 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tools Grid */}
      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, i) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="app-tool-card group relative rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-5 hover:border-border/60 transition-all duration-300"
                style={{
                  boxShadow: tool.connected
                    ? `0 0 20px hsl(${tool.glowColor} / 0.12), 0 0 40px hsl(${tool.glowColor} / 0.05)`
                    : undefined,
                }}
              >
                {/* Icon + Status */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{
                      background: `hsl(${tool.glowColor} / 0.12)`,
                      border: `1px solid hsl(${tool.glowColor} / 0.2)`,
                    }}
                  >
                    {tool.icon}
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                      tool.connected
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-muted/30 text-muted-foreground/60 border border-border/30"
                    }`}
                  >
                    {tool.connected ? (
                      <>
                        <Check className="w-3 h-3" />
                        Faol
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        O'chiq
                      </>
                    )}
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-display font-semibold text-sm text-foreground mb-1.5">
                  {tool.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {tool.description}
                </p>

                {/* Category badge */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                    style={{
                      background: `hsl(${tool.glowColor} / 0.08)`,
                      color: tool.color,
                    }}
                  >
                    {tool.category}
                  </span>

                  {/* Connect Button */}
                  <button
                    onClick={() => handleConnect(tool.id)}
                    disabled={tool.id === "ai-brain"}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      tool.id === "ai-brain"
                        ? "bg-primary/10 text-primary/60 cursor-default"
                        : tool.connected
                        ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                        : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 hover:border-primary/40"
                    }`}
                  >
                    {tool.id === "ai-brain" ? (
                      <>
                        <Check className="w-3 h-3" />
                        Doimo faol
                      </>
                    ) : tool.connected ? (
                      <>
                        <Lock className="w-3 h-3" />
                        Uzish
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3" />
                        API Key ulash
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AppsSection;
