import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, X, Lock, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import ToolDock from "./ToolDock";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Salom! 👋 Men sizning AI agentingizman. Qanday vazifa bajarishimni xohlaysiz? Masalan: \"Har kuni tech trendlarni izla\" deb yozing.",
  },
];

const aiResponses = [
  "Tushundim! Qaysi tool'larni ishlatishimni xohlaysiz? Pastdagi dock'dan kerakli tool'larni faollashtiring.",
  "Ajoyib tanlov! Endi menga aniqroq vazifa bering — qaysi mavzular bo'yicha izlashim kerak?",
  "Ma'lumotlarni yig'ish boshlandi... Natijalarni tez orada ko'rsataman.",
  "Mana natijalar! Dashboard'da batafsil ko'rishingiz mumkin. Yana nima qilishimni xohlaysiz?",
  "Agent tayyor va ishlayapti! 🚀 Har qanday vaqtda yangi vazifa berishingiz mumkin.",
];

// Simulated API key registry
const registeredKeys: Record<string, boolean> = {
  "ai-brain": true, // Always available
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
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
  const [activeTools, setActiveTools] = useState<string[]>(["ai-brain"]);
  const [apiKeys] = useState<Record<string, boolean>>(registeredKeys);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const isToolUnlocked = (toolId: string) => {
    return !!apiKeys[toolId];
  };

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
      prev.includes(toolId)
        ? prev.filter((t) => t !== toolId)
        : [...prev, toolId]
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
    if (toolId === "ai-brain") return; // Can't remove brain
    setActiveTools((prev) => prev.filter((t) => t !== toolId));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 relative bg-[hsl(220_25%_4%)]">
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
                    msg.role === "assistant"
                      ? "chat-bubble-ai"
                      : "chat-bubble-user"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
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
        {/* Chat Input */}
        <div className="px-6 pb-3">
          <div className="max-w-3xl mx-auto">
            <div className="chat-input-container flex items-center gap-2 p-2 rounded-2xl">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Agent'ga vazifa bering..."
                className="flex-1 h-10 bg-transparent px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="h-10 w-10 rounded-xl gradient-btn border-0 shrink-0 shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tool Dock */}
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
