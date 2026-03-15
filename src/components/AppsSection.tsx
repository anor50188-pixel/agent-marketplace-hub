import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Lock, ArrowLeft, Unlock, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AppTool {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  description: string;
  category: string;
  connected: boolean;
  color: string;
}

const allTools: AppTool[] = [
  {
    id: "web-search",
    name: "Web Search",
    icon: "🔍",
    subtitle: "Serper API",
    description: "Google qidiruv natijalarini olish. Agent internetdan ma'lumot qidirishi, yangiliklar, maqolalar va faktlarni topishi uchun ishlatiladi. Real-time ma'lumotlarga kirish imkonini beradi.",
    category: "Qidiruv",
    connected: false,
    color: "hsl(230 80% 60%)",
  },
  {
    id: "website-reader",
    name: "Website Reader",
    icon: "🌐",
    subtitle: "Firecrawl",
    description: "Veb-saytlarni o'qish va tahlil qilish. Agent istalgan sahifadan matn, jadvallar va strukturali ma'lumot oladi. Web scraping va content extraction uchun ideal.",
    category: "Qidiruv",
    connected: false,
    color: "hsl(190 70% 50%)",
  },
  {
    id: "code-execution",
    name: "Code Execution",
    icon: "⚡",
    subtitle: "E2B Sandbox",
    description: "Kod yozish va ishga tushirish. Agent Python, JavaScript va boshqa tillarda kod bajaradi. Hisob-kitoblar, data processing va avtomatlashtirish uchun.",
    category: "Ishlab chiqish",
    connected: false,
    color: "hsl(45 90% 55%)",
  },
  {
    id: "social-search",
    name: "Social Media",
    icon: "𝕏",
    subtitle: "X (Twitter) API",
    description: "X (Twitter) dan postlar va trendlarni qidirish. Ijtimoiy tarmoqlarni monitoring qilish, sentiment tahlili va trend kuzatish uchun ishlatiladi.",
    category: "Ijtimoiy",
    connected: false,
    color: "hsl(210 10% 70%)",
  },
  {
    id: "file-analysis",
    name: "File Analysis",
    icon: "📊",
    subtitle: "Data Parser",
    description: "Fayllarni tahlil qilish — CSV, Excel, PDF, JSON. Agent ma'lumotlarni o'qiydi, statistik xulosalar chiqaradi va vizualizatsiya tayyorlaydi.",
    category: "Tahlil",
    connected: false,
    color: "hsl(150 60% 50%)",
  },
  {
    id: "dashboard-builder",
    name: "Dashboard Builder",
    icon: "📈",
    subtitle: "Chart Engine",
    description: "Interaktiv dashboardlar yaratish. Agent grafiklar, jadvallar va hisobotlar tuzadi. Ma'lumotlarni vizual ko'rinishda taqdim etish uchun.",
    category: "Tahlil",
    connected: false,
    color: "hsl(280 60% 65%)",
  },
  {
    id: "ai-brain",
    name: "AI Brain",
    icon: "🧠",
    subtitle: "MiniMax Model",
    description: "Asosiy AI modeli. Barcha agentlarning fikrlash, tahlil qilish va javob berish qobiliyatini ta'minlaydi. Bu tool doimo faol va o'chirib bo'lmaydi.",
    category: "AI",
    connected: true,
    color: "hsl(260 60% 65%)",
  },
];

const categories = ["Barchasi", "Qidiruv", "Ishlab chiqish", "Ijtimoiy", "Tahlil", "AI"];

const AppsSection = () => {
  const [tools, setTools] = useState<AppTool[]>(allTools);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [selectedTool, setSelectedTool] = useState<AppTool | null>(null);

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "Barchasi" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConnect = (toolId: string) => {
    if (toolId === "ai-brain") return;
    setTools((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, connected: !t.connected } : t))
    );
    const tool = tools.find((t) => t.id === toolId);
    if (!tool) return;
    if (!tool.connected) {
      toast({ title: `✅ ${tool.name} ulandi`, description: "Agent bu tool'dan foydalana oladi." });
    } else {
      toast({ title: `🔒 ${tool.name} uzildi`, description: "API key olib tashlandi.", variant: "destructive" });
    }
    // Update selected tool state too
    setSelectedTool((prev) => prev && prev.id === toolId ? { ...prev, connected: !prev.connected } : prev);
  };

  // Detail View
  if (selectedTool) {
    const currentTool = tools.find((t) => t.id === selectedTool.id) || selectedTool;
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col items-center px-6 py-8 overflow-auto"
        >
          {/* Back button */}
          <div className="w-full max-w-lg mb-8">
            <button
              onClick={() => setSelectedTool(null)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Orqaga
            </button>
          </div>

          {/* Tool info */}
          <div className="flex flex-col items-center text-center max-w-lg">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-5"
              style={{ background: currentTool.color + "1a", border: `2px solid ${currentTool.color}33` }}
            >
              {currentTool.icon}
            </div>

            <h2 className="font-display text-xl font-bold text-foreground mb-1">
              {currentTool.name}
            </h2>
            <p className="text-sm text-muted-foreground mb-1">{currentTool.subtitle}</p>

            {/* Status badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mt-3 mb-6 ${
              currentTool.connected
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-muted/40 text-muted-foreground border border-border/40"
            }`}>
              {currentTool.connected ? <><Check className="w-3 h-3" /> Faol</> : <><Lock className="w-3 h-3" /> O'chiq</>}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              {currentTool.description}
            </p>

            {/* Category */}
            <span
              className="text-xs font-medium px-3 py-1 rounded-full mb-8"
              style={{ background: currentTool.color + "14", color: currentTool.color }}
            >
              {currentTool.category}
            </span>

            {/* Connect button */}
            <button
              onClick={() => handleConnect(currentTool.id)}
              disabled={currentTool.id === "ai-brain"}
              className={`w-full max-w-xs py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentTool.id === "ai-brain"
                  ? "bg-primary/10 text-primary/50 cursor-default"
                  : currentTool.connected
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {currentTool.id === "ai-brain"
                ? "Doimo faol"
                : currentTool.connected
                ? "Uzish"
                : "API Key ulash"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // List View
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-2">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Ilovalar</h1>
        <p className="text-sm text-muted-foreground mb-5">
          Agent uchun tool'larni ulang va boshqaring.
        </p>

        {/* Search */}
        <div className="relative max-w-md mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ilovalarni qidirish..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted/30 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools List */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, i) => (
              <motion.button
                key={tool.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                onClick={() => setSelectedTool(tool)}
                className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-muted/30 transition-colors text-left w-full group"
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                  style={{ background: tool.color + "1a" }}
                >
                  {tool.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground truncate">{tool.name}</span>
                    {tool.connected && <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{tool.subtitle}</p>
                </div>

                {/* Chevron */}
                <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AppsSection;
