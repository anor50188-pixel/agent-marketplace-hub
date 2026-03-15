import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Pencil, Wrench, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { agentStore, type AgentConfig } from "@/lib/agentStore";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  changes?: { field: string; from: string; to: string }[];
}

const TOOL_LABELS: Record<string, string> = {
  "ai-brain": "🧠 AI Brain",
  "web-search": "🔍 Web Search",
  "social-search": "𝕏 Social Media",
  "code-execution": "⚡ Code Execution",
  "file-analysis": "📊 File Analysis",
  "http-request": "🌐 HTTP Request",
  "database": "🗄️ Database",
};

const ALL_TOOLS = ["ai-brain", "web-search", "code-execution", "social-search", "file-analysis", "http-request", "database"];

const QUICK_ACTIONS = [
  { label: "Nomini o'zgartirish", icon: Pencil, prompt: "Agent nomini o'zgartir" },
  { label: "Vazifani yangilash", icon: Sparkles, prompt: "Agent vazifasini o'zgartir" },
  { label: "Tool qo'shish", icon: Wrench, prompt: "Yangi tool qo'shib ber" },
];

// Simulate parsing edit commands
function parseEditCommand(input: string, agent: AgentConfig): {
  response: string;
  updates?: Partial<AgentConfig>;
  changes?: { field: string; from: string; to: string }[];
} {
  const lower = input.toLowerCase();

  // Name change
  const nameMatch = input.match(/nom(?:ini|i)?\s*[:=\-–]?\s*[""«]?(.+?)[""»]?\s*$/i)
    || input.match(/nom(?:ini|i)?\s+(.+)/i);
  if ((lower.includes("nom") && (lower.includes("o'zgartir") || lower.includes("ozgartir") || lower.includes("yangi"))) || nameMatch) {
    if (nameMatch && nameMatch[1]?.trim()) {
      const newName = nameMatch[1].trim().replace(/["""«»]/g, "");
      return {
        response: `✅ Agent nomi o'zgartirildi!\n\n📌 **Eski nom:** ${agent.name}\n📌 **Yangi nom:** ${newName}`,
        updates: { name: newName },
        changes: [{ field: "Nom", from: agent.name, to: newName }],
      };
    }
    return { response: "Yangi nomni yozing. Masalan:\n\n*\"Nomini: Super Agent\"*" };
  }

  // Role/task change
  const roleMatch = input.match(/vazifa(?:sini|si)?\s*[:=\-–]?\s*[""«]?(.+?)[""»]?\s*$/i)
    || input.match(/vazifa(?:sini|si)?\s+(.+)/i);
  if ((lower.includes("vazifa") && (lower.includes("o'zgartir") || lower.includes("ozgartir") || lower.includes("yangi") || lower.includes("yangilab"))) || roleMatch) {
    if (roleMatch && roleMatch[1]?.trim()) {
      const newRole = roleMatch[1].trim().replace(/["""«»]/g, "");
      return {
        response: `✅ Agent vazifasi yangilandi!\n\n🎯 **Eski vazifa:** ${agent.role.substring(0, 60)}...\n🎯 **Yangi vazifa:** ${newRole}`,
        updates: { role: newRole },
        changes: [{ field: "Vazifa", from: agent.role, to: newRole }],
      };
    }
    return { response: "Yangi vazifani yozing. Masalan:\n\n*\"Vazifasini: Har kuni yangiliklar yig'ib beradi\"*" };
  }

  // Add tool
  if (lower.includes("tool") && (lower.includes("qo'sh") || lower.includes("qosh") || lower.includes("add"))) {
    const availableToAdd = ALL_TOOLS.filter((t) => !agent.tools.includes(t));
    if (availableToAdd.length === 0) {
      return { response: "Bu agentda barcha mavjud toollar allaqachon qo'shilgan! 🛠️" };
    }

    // Check if specific tool mentioned
    for (const tool of ALL_TOOLS) {
      const toolName = tool.replace("-", " ").toLowerCase();
      if (lower.includes(toolName) || lower.includes(tool)) {
        if (agent.tools.includes(tool)) {
          return { response: `${TOOL_LABELS[tool] || tool} allaqachon qo'shilgan!` };
        }
        const newTools = [...agent.tools, tool];
        return {
          response: `✅ ${TOOL_LABELS[tool] || tool} qo'shildi!\n\n🔧 **Hozirgi toollar:** ${newTools.map((t) => TOOL_LABELS[t] || t).join(", ")}`,
          updates: { tools: newTools },
          changes: [{ field: "Tool qo'shildi", from: "-", to: TOOL_LABELS[tool] || tool }],
        };
      }
    }

    // Show available tools
    const toolList = availableToAdd.map((t) => `• ${TOOL_LABELS[t] || t}`).join("\n");
    return { response: `Qaysi toolni qo'shmoqchisiz?\n\n${toolList}\n\nMasalan: *\"Web search tool qo'sh\"*` };
  }

  // Remove tool
  if (lower.includes("tool") && (lower.includes("olib tashla") || lower.includes("o'chir") || lower.includes("ochir") || lower.includes("remove"))) {
    for (const tool of ALL_TOOLS) {
      const toolName = tool.replace("-", " ").toLowerCase();
      if (lower.includes(toolName) || lower.includes(tool)) {
        if (!agent.tools.includes(tool)) {
          return { response: `${TOOL_LABELS[tool] || tool} bu agentda yo'q.` };
        }
        if (tool === "ai-brain") {
          return { response: "🧠 AI Brain asosiy tool bo'lgani uchun o'chirib bo'lmaydi." };
        }
        const newTools = agent.tools.filter((t) => t !== tool);
        return {
          response: `✅ ${TOOL_LABELS[tool] || tool} olib tashlandi!\n\n🔧 **Qolgan toollar:** ${newTools.map((t) => TOOL_LABELS[t] || t).join(", ")}`,
          updates: { tools: newTools },
          changes: [{ field: "Tool olib tashlandi", from: TOOL_LABELS[tool] || tool, to: "-" }],
        };
      }
    }
    const toolList = agent.tools.map((t) => `• ${TOOL_LABELS[t] || t}`).join("\n");
    return { response: `Qaysi toolni olib tashlamoqchisiz?\n\n${toolList}` };
  }

  // Category change
  if (lower.includes("kategoriya") && (lower.includes("o'zgartir") || lower.includes("ozgartir"))) {
    const catMatch = input.match(/kategoriya\w*\s*[:=\-–]?\s*(\w+)/i);
    if (catMatch) {
      const newCat = catMatch[1].trim();
      return {
        response: `✅ Kategoriya o'zgartirildi: **${newCat}**`,
        updates: { category: newCat },
        changes: [{ field: "Kategoriya", from: agent.category || "—", to: newCat }],
      };
    }
    return { response: "Yangi kategoriyani yozing. Masalan: *\"Kategoriyani: Marketing\"*" };
  }

  // Show current config
  if (lower.includes("sozlama") || lower.includes("holat") || lower.includes("config") || lower.includes("info") || lower.includes("ma'lumot")) {
    const toolNames = agent.tools.map((t) => TOOL_LABELS[t] || t).join(", ");
    return {
      response: `📋 **${agent.name}** agenti haqida:\n\n📌 **Nom:** ${agent.name}\n🎯 **Vazifa:** ${agent.role}\n🔧 **Toollar:** ${toolNames}\n📁 **Kategoriya:** ${agent.category || "Belgilanmagan"}\n💰 **API xarajat:** ~$${agent.apiCostPerMonth || "N/A"}/oy\n📊 **API so'rovlar:** ~${agent.apiRequestsPerMonth || "N/A"}/oy\n📅 **Yaratilgan:** ${agent.createdAt}`,
    };
  }

  // Help
  if (lower.includes("yordam") || lower.includes("help") || lower.includes("nima qila") || lower.includes("imkoniyat")) {
    return {
      response: `Men sizga quyidagi o'zgartirishlarni qilishga yordam bera olaman:\n\n✏️ **Nomini o'zgartirish** — "Nomini: Yangi Nom"\n🎯 **Vazifani yangilash** — "Vazifasini: Yangi vazifa"\n🔧 **Tool qo'shish** — "Web search tool qo'sh"\n🗑 **Tool o'chirish** — "Database tool olib tashla"\n📁 **Kategoriya** — "Kategoriyani: Marketing"\n📋 **Ma'lumotlar** — "Agent holati"`,
    };
  }

  // Default: generic response
  const genericResponses = [
    `Tushundim! Lekin bu buyruqni aniqlashtira olmadim. Quyidagilarni sinab ko'ring:\n\n• "Nomini o'zgartir"\n• "Vazifasini yangilab ber"\n• "Tool qo'sh"\n• "Agent holati"`,
    `So'rovingizni qayta ishlayapman... Agentni tahrirlash uchun aniq buyruq yozing. "yordam" deb yozing barcha imkoniyatlarni ko'rish uchun.`,
  ];

  return { response: genericResponses[Math.floor(Math.random() * genericResponses.length)] };
}

interface Props {
  agent: AgentConfig;
}

const AgentDashboardChat = ({ agent }: Props) => {
  const [currentAgent, setCurrentAgent] = useState(agent);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Salom! Men **${agent.name}** agentiman. 👋\n\nMeni chat orqali tahrirlashingiz mumkin:\n• Nomimni o'zgartiring\n• Vazifamni yangilang\n• Tool qo'shing yoki olib tashlang\n\n"yordam" deb yozing barcha buyruqlarni ko'rish uchun.`,
      timestamp: new Date().toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const now = () => new Date().toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" });

  const sendMessage = useCallback(() => {
    if (!input.trim() || isTyping) return;
    const text = input.trim();

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const result = parseEditCommand(text, currentAgent);

      if (result.updates) {
        const updated = { ...currentAgent, ...result.updates };
        setCurrentAgent(updated);
        agentStore.updateAgent(currentAgent.id, result.updates);
        toast({
          title: "✅ Agent yangilandi",
          description: result.changes?.map((c) => `${c.field}: ${c.to}`).join(", "),
        });
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.response,
        timestamp: now(),
        changes: result.changes,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  }, [input, isTyping, currentAgent]);

  return (
    <div className="flex flex-col h-full -m-6">
      {/* Current config bar */}
      <div className="px-4 py-2.5 border-b border-border bg-card/50 flex items-center gap-4 text-[11px] text-muted-foreground overflow-x-auto">
        <span className="flex items-center gap-1 shrink-0">
          <Bot className="w-3 h-3 text-primary" />
          <strong className="text-foreground">{currentAgent.name}</strong>
        </span>
        <span className="text-border">|</span>
        <span className="shrink-0 truncate max-w-[200px]">{currentAgent.role.substring(0, 50)}...</span>
        <span className="text-border">|</span>
        <span className="flex items-center gap-1 shrink-0">
          <Wrench className="w-3 h-3" />
          {currentAgent.tools.length} toollar
        </span>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-b border-border/50 flex gap-1.5">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => {
              setInput(action.prompt);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted/30 border border-border text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all"
          >
            <action.icon className="w-3 h-3" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === "assistant" ? "bg-primary/10" : "bg-secondary/10"
              }`}>
                {msg.role === "assistant" ? (
                  <Bot className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <User className="w-3.5 h-3.5 text-secondary" />
                )}
              </div>
              <div className="max-w-[80%] space-y-1.5">
                <div className={`rounded-xl px-3.5 py-2.5 ${
                  msg.role === "assistant"
                    ? "bg-card border border-border text-foreground"
                    : "chat-bubble-user text-primary-foreground"
                }`}>
                  <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                </div>
                {/* Change badges */}
                {msg.changes && msg.changes.length > 0 && (
                  <div className="flex flex-wrap gap-1 pl-1">
                    {msg.changes.map((c, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary border border-primary/20">
                        <Pencil className="w-2.5 h-2.5" />
                        {c.field}
                      </span>
                    ))}
                  </div>
                )}
                <span className={`text-[10px] pl-1 block ${
                  msg.role === "assistant" ? "text-muted-foreground" : "text-muted-foreground"
                }`}>{msg.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-card border border-border rounded-xl px-4 py-3">
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
      <div className="p-4 border-t border-border">
        <div className="chat-input-container rounded-xl flex items-center gap-2 px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Agent sozlamalarini o'zgartiring..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            size="sm"
            className="gradient-btn border-0 h-8 w-8 p-0 rounded-lg"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboardChat;
