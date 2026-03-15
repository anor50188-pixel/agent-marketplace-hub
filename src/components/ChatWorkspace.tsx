import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, X, Sparkles, Plus, MonitorSmartphone, Mic, ArrowUp } from "lucide-react";
import ToolDock from "./ToolDock";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const aiResponses = [
  "Tushundim! Qaysi tool'larni ishlatishimni xohlaysiz? Pastdagi dock'dan kerakli tool'larni faollashtiring.",
  "Ajoyib tanlov! Endi menga aniqroq vazifa bering — qaysi mavzular bo'yicha izlashim kerak?",
  "Ma'lumotlarni yig'ish boshlandi... Natijalarni tez orada ko'rsataman.",
  "Mana natijalar! Dashboard'da batafsil ko'rishingiz mumkin. Yana nima qilishimni xohlaysiz?",
  "Agent tayyor va ishlayapti! 🚀 Har qanday vaqtda yangi vazifa berishingiz mumkin.",
];

// Simulated API key registry
const registeredKeys: Record<string, boolean> = {
  "ai-brain": true,
};

export interface ToolInfo {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  glowColor: string;
}

export const workspaceTools: ToolInfo[] = [
  { id: "web-search", label: "Web Search (Serper)", shortLabel: "Serper", icon: "🔍", color: "hsl(var(--primary))", glowColor: "var(--primary)" },
  { id: "website-reader", label: "Website Reader (Firecrawl)", shortLabel: "Firecrawl", icon: "🌐", color: "hsl(var(--accent))", glowColor: "var(--accent)" },
  { id: "code-execution", label: "Code Execution (E2B)", shortLabel: "E2B", icon: "⚡", color: "hsl(45 90% 55%)", glowColor: "45 90% 55%" },
  { id: "social-search", label: "Social Media (X API)", shortLabel: "X API", icon: "𝕏", color: "hsl(210 10% 70%)", glowColor: "210 10% 70%" },
  { id: "file-analysis", label: "File / Data Analysis", shortLabel: "Data", icon: "📊", color: "hsl(150 60% 50%)", glowColor: "150 60% 50%" },
  { id: "dashboard-builder", label: "Dashboard Builder", shortLabel: "Dashboard", icon: "📈", color: "hsl(280 60% 65%)", glowColor: "280 60% 65%" },
  { id: "ai-brain", label: "AI Brain (MiniMax)", shortLabel: "MiniMax", icon: "🧠", color: "hsl(var(--secondary))", glowColor: "var(--secondary)" },
];

const ChatWorkspace = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
  const [activeTools, setActiveTools] = useState<string[]>(["ai-brain"]);
  const [apiKeys] = useState<Record<string, boolean>>(registeredKeys);
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const isToolUnlocked = (toolId: string) => !!apiKeys[toolId];

  const handleToolClick = (toolId: string) => {
    if (!isToolUnlocked(toolId)) {
      toast({
        title: "🔒 Tool qulflangan",
        description: "Avval 'Ilovalar' bo'limida API kalitni ulang.",
        variant: "destructive",
      });
      return;
    }
    setActiveTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
    );
  };

  const sendMessage = () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponses[responseIndex % aiResponses.length],
      };
      setMessages((prev) => [...prev, aiMsg]);
      setResponseIndex((prev) => prev + 1);
      setIsTyping(false);
    }, 1000 + Math.random() * 800);
  };

  const removeActiveTool = (toolId: string) => {
    if (toolId === "ai-brain") return;
    setActiveTools((prev) => prev.filter((t) => t !== toolId));
  };

  // Landing state — no messages yet (like Lovable dashboard)
  if (!hasMessages) {
    return (
      <div className="flex-1 flex flex-col min-h-0 relative bg-background">
        {/* Centered content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Gradient glow behind heading */}
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
          </div>

          {/* Main input card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full max-w-2xl"
          >
            <div className="workspace-prompt-card rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden">
              <div className="p-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Agent uchun vazifa yozing..."
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
                    <MonitorSmartphone className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={sendMessage}
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

        {/* Bottom Tool Dock */}
        <ToolDock
          tools={workspaceTools}
          activeTools={activeTools}
          onToolClick={handleToolClick}
          isToolUnlocked={isToolUnlocked}
        />
      </div>
    );
  }

  // Chat state — messages exist
  return (
    <div className="flex-1 flex flex-col min-h-0 relative bg-background">
      {/* Active Tools Bar */}
      <AnimatePresence>
        {activeTools.length > 0 && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-2 px-6 py-3 border-b border-border/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium mr-2">Faol toollar:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {activeTools.map((toolId) => {
                const tool = workspaceTools.find((t) => t.id === toolId);
                if (!tool) return null;
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="active-tool-badge flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                  >
                    <span>{tool.icon}</span>
                    <span className="text-foreground/90">{tool.shortLabel}</span>
                    {toolId !== "ai-brain" && (
                      <button
                        onClick={() => removeActiveTool(toolId)}
                        className="ml-0.5 hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.role === "assistant"
                      ? "bg-gradient-to-br from-primary to-secondary shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                      : "bg-muted/40 border border-border/30"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "assistant" ? "chat-bubble-ai" : "chat-bubble-user"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_15px_hsl(var(--primary)/0.3)]">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="chat-bubble-ai rounded-2xl px-4 py-3">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary/50"
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
      </div>

      {/* Input + Dock */}
      <div className="relative">
        <div className="px-6 pb-3">
          <div className="max-w-3xl mx-auto">
            <div className="workspace-prompt-card flex items-center gap-2 p-2 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Agent'ga vazifa bering..."
                className="flex-1 h-10 bg-transparent px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-foreground text-background disabled:opacity-30 transition-all hover:opacity-80 shrink-0"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <ToolDock
          tools={workspaceTools}
          activeTools={activeTools}
          onToolClick={handleToolClick}
          isToolUnlocked={isToolUnlocked}
        />
      </div>
    </div>
  );
};

export default ChatWorkspace;
