import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Wand2, Cpu, DollarSign, ArrowUp, Plus, Mic } from "lucide-react";
import { Button } from "./ui/button";
import { agentStore, type AgentConfig } from "@/lib/agentStore";
import { subscriptionStore } from "@/lib/subscriptionStore";
import { toast } from "@/hooks/use-toast";
import AgentLiveBuilder from "./AgentLiveBuilder";

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

const TOOL_DISPLAY: Record<string, { icon: string; label: string }> = {
  "ai-brain": { icon: "🧠", label: "AI Brain" },
  "web-search": { icon: "🔍", label: "Web Search" },
  "code-execution": { icon: "⚡", label: "Code Execution" },
  "social-search": { icon: "𝕏", label: "Social Media" },
  "http-request": { icon: "🌐", label: "HTTP Request" },
  "database": { icon: "🗄️", label: "Database" },
  "file-analysis": { icon: "📊", label: "File Analysis" },
};

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pendingAgent, setPendingAgent] = useState<Partial<AgentConfig> | null>(null);
  const [isCreated, setIsCreated] = useState(false);
  const [builderAgent, setBuilderAgent] = useState<Partial<AgentConfig> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

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

    // Confirm creation
    if (pendingAgent && ["ha", "ok", "tasdiqlash", "yes", "saqlash", "save", "yaratish", "create", "nashr", "publish"].some((w) => msg.toLowerCase().includes(w))) {
      setTimeout(() => {
        const currentAgents = agentStore.getAgents();
        if (!subscriptionStore.canCreateAgent(currentAgents.length)) {
          const planConfig = subscriptionStore.getPlanConfig();
          addMessage("assistant", `⚠️ **Agent limiti tugadi!**\n\n${planConfig.name} rejada ${planConfig.limits.maxAgents} ta agent.\nHozirda ${currentAgents.length} ta agentingiz bor.`);
          setIsTyping(false);
          return;
        }

        const maxTools = subscriptionStore.getMaxTools();
        const limitedTools = (pendingAgent.tools || ["ai-brain"]).slice(0, maxTools);

        const newAgent: AgentConfig = {
          id: "agent-" + Date.now(),
          name: pendingAgent.name || "Yangi Agent",
          role: pendingAgent.role || "",
          tools: limitedTools,
          status: "active",
          createdAt: new Date().toISOString().split("T")[0],
          category: pendingAgent.category,
          apiCostPerMonth: pendingAgent.apiCostPerMonth,
          apiRequestsPerMonth: pendingAgent.apiRequestsPerMonth,
        };
        agentStore.addAgent(newAgent);
        setIsCreated(true);
        setPendingAgent(null);
        setBuilderAgent(null);

        addMessage("assistant", `✅ **"${newAgent.name}"** agenti muvaffaqiyatli yaratildi! 🎉\n\n"Agentlarim" bo'limida topishingiz mumkin.\n\nYana agent yaratmoqchimisiz?`);
        setIsTyping(false);
        toast({
          title: `✅ ${newAgent.name} yaratildi!`,
          description: "Agent 'Agentlarim' sahifasiga qo'shildi.",
        });
      }, 1000);
      return;
    }

    // Cancel
    if (pendingAgent && ["yo'q", "yoq", "bekor", "cancel", "no"].some((w) => msg.toLowerCase().includes(w))) {
      setTimeout(() => {
        setPendingAgent(null);
        setBuilderAgent(null);
        addMessage("assistant", "Bekor qilindi. Boshqa agent tavsifini yozing! 💡");
        setIsTyping(false);
      }, 600);
      return;
    }

    // Parse as new agent request
    setTimeout(() => {
      const preview = parsePromptToAgent(msg);
      setPendingAgent(preview);
      setBuilderAgent(preview);
      setIsCreated(false);

      addMessage("assistant", `Ajoyib! Agent tayyor bo'ldi 🎉\n\nO'ng tomonda agentingizni ko'rishingiz va sozlashingiz mumkin.\n\nHammasi to'g'ri bo'lsa **"Nashr qilish"** tugmasini bosing yoki chatda "Ha" deb yozing.`, { agentPreview: preview });
      setIsTyping(false);
    }, 1200);
  };

  const handleBuilderUpdate = (updates: Partial<AgentConfig>) => {
    setPendingAgent((prev) => prev ? { ...prev, ...updates } : updates);
    setBuilderAgent((prev) => prev ? { ...prev, ...updates } : updates);
  };

  const handlePublish = () => {
    if (!pendingAgent) return;
    handleSend("Nashr qilish");
  };

  // Landing state — no messages
  if (!hasMessages) {
    return (
      <div className="flex-1 flex flex-col min-h-0 relative bg-background">
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="relative mb-8">
            <div className="absolute inset-0 blur-[80px] opacity-30 bg-gradient-to-r from-primary via-secondary to-accent rounded-full scale-150" />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative font-display text-3xl md:text-4xl font-bold text-foreground text-center"
            >
              Agentingizni yarating
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-sm text-center mt-2"
            >
              Nimani avtomatlashtirmoqchisiz? Yozing — men yaratayman.
            </motion.p>
          </div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 justify-center mb-6 max-w-xl"
          >
            {SUGGESTIONS.map((s, i) => (
              <motion.button
                key={s}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                onClick={() => handleSend(s)}
                className="suggestion-chip px-3.5 py-2 rounded-xl text-xs font-medium text-foreground"
              >
                <Wand2 className="w-3 h-3 inline mr-1.5 text-primary" />
                {s}
              </motion.button>
            ))}
          </motion.div>

          {/* Main input card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full max-w-2xl"
          >
            <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden">
              <div className="p-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Qanday agent yaratmoqchisiz? Yozing..."
                  rows={3}
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-base resize-none focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between px-4 pb-3">
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-foreground text-background disabled:opacity-30 transition-all hover:opacity-80"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Split panel: chat left + builder right
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex min-h-0"
    >
      {/* Chat Panel — Left */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: builderAgent ? "45%" : "100%" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col min-h-0 border-r border-border/30"
      >
        {/* Messages */}
        <div className="flex-1 overflow-auto px-4 py-5 space-y-4">
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
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.role === "assistant" ? "bg-primary/15" : "bg-secondary/15"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-secondary" />
                  )}
                </div>
                <div className={`max-w-[85%]`}>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "assistant"
                        ? "bg-card border border-border/40 text-card-foreground"
                        : "chat-bubble-user text-primary-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-7 h-7 rounded-xl bg-primary/15 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="bg-card border border-border/40 rounded-2xl px-4 py-3">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
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
        <div className="p-3">
          <div className="chat-glass-input flex gap-2 p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                isCreated
                  ? "Yangi agent yaratish uchun yozing..."
                  : pendingAgent
                  ? "O'zgartirish yoki 'Ha' deb tasdiqlang..."
                  : "Qanday agent yaratmoqchisiz?"
              }
              className="flex-1 h-9 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="h-9 w-9 rounded-xl gradient-btn border-0 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Builder Panel — Right */}
      <AnimatePresence>
        {builderAgent && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "55%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col min-h-0 overflow-hidden"
          >
            <AgentLiveBuilder
              agent={builderAgent}
              onUpdate={handleBuilderUpdate}
              onPublish={handlePublish}
              isPublished={isCreated}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AgentCreatorChat;
