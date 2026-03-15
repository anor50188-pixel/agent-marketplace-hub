import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Wand2 } from "lucide-react";
import { Button } from "./ui/button";
import { agentStore, type AgentConfig } from "@/lib/agentStore";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentPreview?: Partial<AgentConfig>;
}

const SUGGESTIONS = [
  "Amazon KDP uchun kitob yozish agenti",
  "Telegram kanaliga kunlik AI yangiliklari",
  "Instagram kontentni rejalashtiruvchi agent",
  "SEO kalit so'z tahlilchi agent",
];

// Simulate AI parsing user prompt into agent config
const parsePromptToAgent = (prompt: string): Partial<AgentConfig> => {
  const lower = prompt.toLowerCase();
  let tools = ["ai-brain"];
  let category = "General";

  if (lower.includes("kitob") || lower.includes("yoz") || lower.includes("kontent") || lower.includes("content")) {
    tools.push("code-execution");
    category = "Content";
  }
  if (lower.includes("web") || lower.includes("yangilik") || lower.includes("qidiruv") || lower.includes("search") || lower.includes("trend")) {
    tools.push("web-search");
    category = "Research";
  }
  if (lower.includes("telegram") || lower.includes("instagram") || lower.includes("social") || lower.includes("ijtimoiy")) {
    tools.push("social-search");
    category = "Marketing";
  }
  if (lower.includes("seo") || lower.includes("kalit")) {
    tools.push("web-search");
    category = "SEO";
  }
  if (lower.includes("amazon") || lower.includes("kdp")) {
    tools.push("web-search", "http-request");
    category = "E-Commerce";
  }
  if (lower.includes("database") || lower.includes("malumot")) {
    tools.push("database");
    category = "Data";
  }

  tools = [...new Set(tools)];

  // Generate a name from the prompt
  const words = prompt.split(" ").slice(0, 4).join(" ");
  const name = words.charAt(0).toUpperCase() + words.slice(1);

  return {
    name: name.length > 30 ? name.substring(0, 30) : name,
    role: prompt,
    tools,
    category,
    apiCostPerMonth: Math.round((tools.length * 2.5 + Math.random() * 5) * 10) / 10,
    apiRequestsPerMonth: tools.length * 500 + Math.floor(Math.random() * 1000),
  };
};

const AgentCreatorChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Salom! 👋 Qanday agent yaratmoqchisiz? Shunchaki yozing — masalan:\n\n💡 *\"Amazon KDP uchun kitob yozish agenti\"*\n💡 *\"Har kuni AI yangiliklarini Telegram kanaliga yuboruvchi agent\"*\n\nMen sizning so'rovingiz asosida agentni avtomatik yaratamanva sozlayman.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pendingAgent, setPendingAgent] = useState<Partial<AgentConfig> | null>(null);
  const [isCreated, setIsCreated] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addMessage = useCallback(
    (role: "user" | "assistant", content: string, extra?: Partial<Message>) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + Math.random(), role, content, ...extra },
      ]);
    },
    []
  );

  const handleSend = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isTyping) return;
    addMessage("user", msg);
    setInput("");
    setIsTyping(true);

    if (pendingAgent && ["ha", "ok", "tasdiqlash", "yes", "saqlash", "save", "yaratish", "create"].some((w) => msg.toLowerCase().includes(w))) {
      // Confirm creation
      setTimeout(() => {
        const newAgent: AgentConfig = {
          id: "agent-" + Date.now(),
          name: pendingAgent.name || "Yangi Agent",
          role: pendingAgent.role || "",
          tools: pendingAgent.tools || ["ai-brain"],
          status: "active",
          createdAt: new Date().toISOString().split("T")[0],
          category: pendingAgent.category,
          apiCostPerMonth: pendingAgent.apiCostPerMonth,
          apiRequestsPerMonth: pendingAgent.apiRequestsPerMonth,
        };
        agentStore.addAgent(newAgent);
        setIsCreated(true);
        setPendingAgent(null);
        addMessage(
          "assistant",
          `✅ **"${newAgent.name}"** agenti muvaffaqiyatli yaratildi! 🎉\n\n"Agentlarim" bo'limida topishingiz va sozlashingiz mumkin.\n\nYana agent yaratmoqchimisiz? Shunchaki yozing!`
        );
        setIsTyping(false);
        toast({
          title: `✅ ${newAgent.name} yaratildi!`,
          description: "Agent 'Agentlarim' sahifasiga qo'shildi.",
        });
      }, 1000);
      return;
    }

    if (pendingAgent && ["yo'q", "yoq", "bekor", "cancel", "no"].some((w) => msg.toLowerCase().includes(w))) {
      setTimeout(() => {
        setPendingAgent(null);
        addMessage("assistant", "Bekor qilindi. Boshqa agent tavsifini yozing, men yangisini yaratayman! 💡");
        setIsTyping(false);
      }, 600);
      return;
    }

    // Parse as new agent request
    setTimeout(() => {
      const preview = parsePromptToAgent(msg);
      setPendingAgent(preview);
      setIsCreated(false);

      const toolNames = (preview.tools || [])
        .map((t) => {
          const map: Record<string, string> = {
            "ai-brain": "🧠 AI Brain",
            "web-search": "🔍 Web Search",
            "code-execution": "⚡ Code Execution",
            "social-search": "𝕏 Social Media",
            "http-request": "🌐 HTTP Request",
            "database": "🗄️ Database",
            "file-analysis": "📊 File Analysis",
          };
          return map[t] || t;
        })
        .join(", ");

      addMessage(
        "assistant",
        `Ajoyib! Sizning so'rovingiz asosida agent tayyor:\n\n📌 **Nomi:** ${preview.name}\n🎯 **Vazifa:** ${preview.role}\n🔧 **Toollar:** ${toolNames}\n📁 **Kategoriya:** ${preview.category}\n💰 **Taxminiy oylik API xarajat:** ~$${preview.apiCostPerMonth}\n📊 **Taxminiy oylik so'rovlar:** ~${preview.apiRequestsPerMonth}\n\nTasdiqlash uchun **"Ha"** yoki **"Yaratish"** deb yozing.\nBekor qilish uchun **"Yo'q"** deb yozing.`,
        { agentPreview: preview }
      );
      setIsTyping(false);
    }, 1200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isTyping) return;
    handleSend(suggestion);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      {/* Messages */}
      <div className="flex-1 overflow-auto px-6 py-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === "assistant" ? "bg-primary/15" : "bg-secondary/15"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Bot className="w-4 h-4 text-primary" />
                ) : (
                  <User className="w-4 h-4 text-secondary" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "assistant"
                    ? "bg-card border border-border/40 text-card-foreground"
                    : "chat-bubble-user text-primary-foreground"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Suggestions (only show at start) */}
        {messages.length === 1 && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 pl-11"
          >
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestionClick(s)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-card border border-border/40 text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <Wand2 className="w-3 h-3 inline mr-1.5 text-primary" />
                {s}
              </button>
            ))}
          </motion.div>
        )}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-card border border-border/40 rounded-2xl px-4 py-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-muted-foreground/50"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/30">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              isCreated
                ? "Yangi agent yaratish uchun yozing..."
                : pendingAgent
                ? '"Ha" yoki "Yo\'q" deb javob bering...'
                : "Qanday agent yaratmoqchisiz? Yozing..."
            }
            className="flex-1 h-11 rounded-xl border border-border/50 bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="h-11 w-11 rounded-xl gradient-btn border-0 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentCreatorChat;
