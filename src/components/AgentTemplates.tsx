import { motion } from "framer-motion";
import { MessageSquare, FileText, Code, Headphones, ShoppingCart, GraduationCap, Bot, TrendingUp } from "lucide-react";
import { agentStore } from "@/lib/agentStore";
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

const templates = [
  {
    icon: MessageSquare,
    title: "Chat Bot",
    description: "Mijozlar bilan muloqot qiluvchi bot",
    color: "from-primary to-secondary",
    role: "Mijozlar savollariga real vaqtda javob beradi va muammolarni hal qiladi",
    tools: ["ai-brain", "web-search"],
  },
  {
    icon: FileText,
    title: "Kontent Yozuvchi",
    description: "Blog, post va maqola yozuvchi agent",
    color: "from-secondary to-[hsl(330,70%,60%)]",
    role: "SEO optimallashtirilgan blog postlar, ijtimoiy tarmoq kontenti va maqolalar yozadi",
    tools: ["ai-brain", "web-search", "file-analysis"],
  },
  {
    icon: Code,
    title: "Kod Yordamchisi",
    description: "Dasturlashda yordam beruvchi agent",
    color: "from-accent to-primary",
    role: "Kod yozish, debugging va code review jarayonlarida yordam beradi",
    tools: ["ai-brain", "code-execution"],
  },
  {
    icon: Headphones,
    title: "Qo'llab-quvvatlash",
    description: "24/7 mijoz xizmati agenti",
    color: "from-[hsl(330,70%,60%)] to-primary",
    role: "Mijozlar muammolarini 24/7 rejimda hal qiladi va FAQ javoblarini beradi",
    tools: ["ai-brain", "database", "web-search"],
  },
  {
    icon: ShoppingCart,
    title: "Savdo Agenti",
    description: "Sotuvni avtomatlashtiradigan bot",
    color: "from-primary to-accent",
    role: "Mahsulotlarni tavsiya qiladi, buyurtmalarni kuzatadi va sotuvni oshiradi",
    tools: ["ai-brain", "database", "http-request"],
  },
  {
    icon: GraduationCap,
    title: "O'qituvchi Agent",
    description: "Ta'lim va trening beruvchi bot",
    color: "from-accent to-secondary",
    role: "Foydalanuvchilarga interaktiv ta'lim beradi, savollar beradi va bilimni tekshiradi",
    tools: ["ai-brain", "file-analysis"],
  },
  {
    icon: Bot,
    title: "Shaxsiy Assistent",
    description: "Kundalik ishlarni boshqaruvchi",
    color: "from-secondary to-accent",
    role: "Jadval boshqarish, eslatmalar yuborish va kundalik vazifalarni tashkil qilish",
    tools: ["ai-brain", "http-request", "database"],
  },
  {
    icon: TrendingUp,
    title: "Analitik Agent",
    description: "Ma'lumotlarni tahlil qiluvchi",
    color: "from-primary to-[hsl(330,70%,60%)]",
    role: "Ma'lumotlarni yig'adi, tahlil qiladi va vizual hisobotlar tayyorlaydi",
    tools: ["ai-brain", "web-search", "database", "file-analysis"],
  },
];

const AgentTemplates = () => {
  const handleCreate = (template: typeof templates[0]) => {
    const newAgent = {
      id: "agent-" + Date.now(),
      name: template.title,
      role: template.role,
      tools: template.tools,
      status: "active" as const,
      createdAt: new Date().toISOString().split("T")[0],
    };
    agentStore.addAgent(newAgent);
    toast({
      title: `✅ "${template.title}" yaratildi!`,
      description: "Agent 'Agentlarim' sahifasiga qo'shildi.",
    });
  };

  return (
    <section id="templates" className="flex-1 flex flex-col min-h-0 bg-background">
      <div className="px-6 pt-8 pb-4">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">
          AI Agent <span className="gradient-text">Shablonlari</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Tayyor shablonlardan boshlang — bir tugma bilan agent yarating
        </p>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template, index) => (
            <motion.div
              key={template.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="rounded-xl border border-border/40 bg-card/50 p-5 hover:border-primary/20 transition-all group flex flex-col"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <template.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-sm text-foreground mb-1">
                {template.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                {template.description}
              </p>
              <p className="text-[11px] text-muted-foreground/70 leading-relaxed mb-4 flex-1 line-clamp-2">
                {template.role}
              </p>

              {/* Tool badges */}
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tools.map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-muted/40 text-muted-foreground"
                  >
                    {t === "ai-brain" ? "🧠" : t === "web-search" ? "🔍" : t === "code-execution" ? "⚡" : t === "file-analysis" ? "📊" : t === "http-request" ? "🌐" : t === "database" ? "🗄️" : "🔧"}{" "}
                    {t.replace("-", " ")}
                  </span>
                ))}
              </div>

              <Button
                onClick={() => handleCreate(template)}
                size="sm"
                className="w-full h-8 text-xs rounded-lg gradient-btn border-0"
              >
                Agentni yaratish
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentTemplates;
