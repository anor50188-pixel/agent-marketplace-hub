import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Check, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { agentStore, type AgentConfig } from "@/lib/agentStore";
import { apiKeyStore } from "@/lib/apiKeyStore";
import { toast } from "@/hooks/use-toast";

type Step = "name" | "role" | "tools" | "confirm" | "done";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  tools?: string[];
}

const AVAILABLE_TOOLS = [
  { id: "web-search", label: "🔍 Web Search", apiId: "web-search" },
  { id: "code-execution", label: "⚡ Code Execution", apiId: null },
  { id: "social-search", label: "𝕏 Social Media", apiId: null },
  { id: "file-analysis", label: "📊 File Analysis", apiId: null },
  { id: "http-request", label: "🌐 HTTP Request", apiId: "http-request" },
  { id: "database", label: "🗄️ Database", apiId: "database" },
];

const stepLabels: { key: Step; label: string }[] = [
  { key: "name", label: "Nom" },
  { key: "role", label: "Vazifa" },
  { key: "tools", label: "Toollar" },
  { key: "confirm", label: "Tasdiqlash" },
];

const AgentCreatorChat = () => {
  const [step, setStep] = useState<Step>("name");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Salom! 👋 Keling, yangi agent yaratamiz. Avval agentingiz nomini kiriting:",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentRole, setAgentRole] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>(["ai-brain"]);
  const [showToolPicker, setShowToolPicker] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addMessage = useCallback((role: "user" | "assistant", content: string) => {
    setMessages((prev) => [...prev, { id: Date.now().toString() + Math.random(), role, content }]);
  }, []);

  const simulateReply = useCallback(
    (content: string, delay = 800) => {
      setIsTyping(true);
      setTimeout(() => {
        addMessage("assistant", content);
        setIsTyping(false);
      }, delay);
    },
    [addMessage]
  );

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const text = input.trim();
    addMessage("user", text);
    setInput("");

    if (step === "name") {
      setAgentName(text);
      setStep("role");
      simulateReply(
        `Ajoyib! Agent nomi: "${text}" 📌\n\nEndi agentning vazifasini (rolini) yozing. Masalan: "Har kuni AI yangiliklarini yig'ib Telegram kanaliga post qiladi"`
      );
    } else if (step === "role") {
      setAgentRole(text);
      setStep("tools");
      setShowToolPicker(true);
      simulateReply(
        `Vazifa belgilandi! ✅\n\nEndi agentga qaysi toollar kerak? Pastdagi ro'yxatdan tanlang, keyin "Tayyor" deb yozing:`
      );
    } else if (step === "tools") {
      if (text.toLowerCase().includes("tayyor") || text.toLowerCase().includes("ready")) {
        // Check API keys
        const missingApis = selectedTools
          .map((tid) => AVAILABLE_TOOLS.find((t) => t.id === tid))
          .filter((t) => t?.apiId && !apiKeyStore.isConnected(t.apiId));

        if (missingApis.length > 0) {
          const names = missingApis.map((t) => t!.label).join(", ");
          simulateReply(
            `⚠️ Bu toollar uchun API key ulanmagan: ${names}\n\nIltimos, avval "Integratsiyalar" bo'limidan API keylarni ulang, keyin qaytib davom eting.`
          );
          return;
        }

        setShowToolPicker(false);
        setStep("confirm");
        const toolNames = selectedTools
          .map((id) => {
            if (id === "ai-brain") return "🧠 AI Brain";
            return AVAILABLE_TOOLS.find((t) => t.id === id)?.label || id;
          })
          .join(", ");

        simulateReply(
          `Ajoyib! Agentingiz konfiguratsiyasi:\n\n📌 **Nomi:** ${agentName}\n🎯 **Vazifa:** ${agentRole}\n🔧 **Toollar:** ${toolNames}\n\nTasdiqlash uchun "Ha" yoki "Saqlash" deb yozing.`
        );
      }
    } else if (step === "confirm") {
      if (["ha", "saqlash", "yes", "save", "ok", "tasdiqlash"].some((w) => text.toLowerCase().includes(w))) {
        const newAgent: AgentConfig = {
          id: "agent-" + Date.now(),
          name: agentName,
          role: agentRole,
          tools: selectedTools,
          status: "active",
          createdAt: new Date().toISOString().split("T")[0],
        };
        agentStore.addAgent(newAgent);
        setStep("done");
        simulateReply(
          `✅ Agent "${agentName}" muvaffaqiyatli yaratildi va saqlandi! 🎉\n\n"Agentlarim" bo'limida ko'rishingiz mumkin.`,
          1000
        );
        toast({ title: `✅ ${agentName} yaratildi!`, description: "Agent 'Agentlarim' sahifasiga qo'shildi." });
      } else {
        simulateReply("Agent yaratishni bekor qilmoqchimisiz? Qaytadan boshlash uchun sahifani yangilang.");
      }
    }
  };

  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) => (prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]));
  };

  const stepIndex = stepLabels.findIndex((s) => s.key === step);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      {/* Progress Indicator */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-1 max-w-lg mx-auto">
          {stepLabels.map((s, i) => {
            const completed = i < stepIndex || step === "done";
            const active = i === stepIndex && step !== "done";
            return (
              <div key={s.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      completed
                        ? "bg-primary text-primary-foreground"
                        : active
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {completed ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-medium ${
                      completed || active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-1 rounded-full transition-all ${
                      i < stepIndex || step === "done" ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-6 py-4 space-y-4">
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
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === "assistant"
                    ? "bg-primary/20"
                    : "bg-secondary/20"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Bot className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <User className="w-3.5 h-3.5 text-secondary" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "assistant"
                    ? "bg-muted/40 border border-border/30 text-foreground"
                    : "chat-bubble-user text-primary-foreground"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Tool Picker */}
        {showToolPicker && step === "tools" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 pl-10"
          >
            {AVAILABLE_TOOLS.map((tool) => {
              const selected = selectedTools.includes(tool.id);
              return (
                <button
                  key={tool.id}
                  onClick={() => toggleTool(tool.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selected
                      ? "bg-primary/15 border-primary/40 text-primary"
                      : "bg-muted/30 border-border/40 text-muted-foreground hover:border-primary/20"
                  }`}
                >
                  {tool.label} {selected && "✓"}
                </button>
              );
            })}
          </motion.div>
        )}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-muted/40 border border-border/30 rounded-2xl px-4 py-3">
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
        {step === "done" ? (
          <div className="flex items-center justify-center gap-2 py-2 text-sm text-primary font-medium">
            <Sparkles className="w-4 h-4" />
            Agent muvaffaqiyatli yaratildi!
          </div>
        ) : (
          <div className="flex gap-2 max-w-2xl mx-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                step === "name"
                  ? "Agent nomini kiriting..."
                  : step === "role"
                  ? "Vazifani yozing..."
                  : step === "tools"
                  ? 'Toollarni tanlab "Tayyor" deb yozing...'
                  : '"Ha" yoki "Saqlash" deb tasdiqlang...'
              }
              className="flex-1 h-11 rounded-xl border border-border/50 bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="h-11 w-11 rounded-xl gradient-btn border-0 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentCreatorChat;
