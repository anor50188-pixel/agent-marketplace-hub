import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Play, Loader2, Terminal } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { WorkspaceState } from "./AgentWorkspace";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const toolNames: Record<string, string> = {
  "web-search": "Web Search (Serper)",
  "website-reader": "Website Reader (Firecrawl)",
  "code-execution": "Code Execution (E2B)",
  "social-search": "Social Search (X API)",
  "file-analysis": "File Analysis",
  "dashboard-builder": "Dashboard Builder",
  "ai-brain": "AI Brain (MiniMax)",
};

function generateResponse(input: string, state: WorkspaceState): string {
  const q = input.toLowerCase();
  const toolLabels = state.selectedTools.map((id) => toolNames[id] || id);

  if (q.includes("tool") || q.includes("qanday")) {
    if (state.selectedTools.length === 0) return "Hozircha hech qanday tool tanlanmagan. Explorer panelidan 'Tools' bo'limiga o'ting va kerakli toollarni tanlang.";
    return `Tanlangan toollar: ${toolLabels.join(", ")}. Har bir tool kartochkasidagi 'Register' linkidan API kalitini olishingiz mumkin.`;
  }
  if (q.includes("status") || q.includes("holat")) {
    const issues: string[] = [];
    if (!state.agentName.trim()) issues.push("Agent nomi kiritilmagan");
    if (state.selectedTools.length === 0) issues.push("Tool tanlanmagan");
    if (issues.length === 0) return `✅ "${state.agentName}" — barcha sozlamalar tayyor. Deploy qilishingiz mumkin!`;
    return `⚠️ Muammolar:\n${issues.map((i) => `• ${i}`).join("\n")}`;
  }
  if (q.includes("deploy") || q.includes("ishga")) {
    if (!state.agentName.trim() || state.selectedTools.length === 0)
      return "Deploy qilish uchun kamida agent nomi va 1 ta tool tanlangan bo'lishi kerak.";
    return "Yuqori o'ng burchakdagi 'Deploy to Marketplace' tugmasini bosing!";
  }
  if (q.includes("model") || q.includes("temperature")) {
    return `Hozirgi model: ${state.modelSettings.model === "minimax" ? "MiniMax" : "GPT-4o"}, Temperature: ${state.modelSettings.temperature}, Max tokens: ${state.modelSettings.maxTokens}. Explorer → Model Settings dan o'zgartiring.`;
  }
  return `"${state.agentName || "Agent"}" uchun yordam beraman. Tool tanlash, model sozlash yoki deploy haqida so'rang.`;
}

interface AssistantPanelProps {
  state: WorkspaceState;
}

const AssistantPanel = ({ state }: AssistantPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Salom! Men ASER AI yordamchisiman. Agent yaratishda sizga yordam beraman. 🤖" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sandbox
  const [sandboxInput, setSandboxInput] = useState("");
  const [sandboxOutput, setSandboxOutput] = useState("");
  const [sandboxRunning, setSandboxRunning] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const reply = generateResponse(userMsg.content, state);
      setMessages((m) => [...m, { id: (Date.now() + 1).toString(), role: "assistant", content: reply }]);
      setIsTyping(false);
    }, 600 + Math.random() * 600);
  };

  const runSandbox = () => {
    if (!sandboxInput.trim() || sandboxRunning) return;
    setSandboxRunning(true);
    setSandboxOutput("");
    const toolLabels = state.selectedTools.map((id) => toolNames[id] || id);
    let output = `> ${sandboxInput}\n\n`;
    let i = 0;
    const interval = setInterval(() => {
      if (i < toolLabels.length) {
        output += `[${toolLabels[i]}] executing...\n`;
        setSandboxOutput(output);
        i++;
      } else {
        output += `\n✅ Done — ${toolLabels.length} tools processed.`;
        setSandboxOutput(output);
        setSandboxRunning(false);
        clearInterval(interval);
      }
    }, 500);
  };

  return (
    <div className="w-80 h-full flex flex-col bg-white/[0.03] backdrop-blur-xl">
      {/* Chat Header */}
      <div className="h-10 shrink-0 flex items-center gap-2 px-4 border-b border-white/10">
        <Bot className="w-4 h-4 text-purple-400" />
        <span className="text-xs font-semibold text-slate-300">AI Assistant</span>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-[3] overflow-auto p-3 space-y-2.5">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-purple-500/20 text-purple-100 rounded-br-sm"
                    : "bg-white/5 text-slate-300 rounded-bl-sm border border-white/5"
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex gap-1 px-3 py-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-purple-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="px-3 pb-2">
        <div className="flex gap-1.5">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask anything..."
            className="h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-purple-500/50"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            size="sm"
            className="h-8 w-8 p-0 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-0"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Mini Sandbox */}
      <div className="flex-[2] border-t border-white/10 flex flex-col">
        <div className="h-8 shrink-0 flex items-center gap-2 px-4 border-b border-white/5 bg-white/[0.02]">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Sandbox</span>
        </div>
        <div className="flex-1 overflow-auto p-3">
          <pre className="text-[11px] font-mono text-slate-400 whitespace-pre-wrap leading-relaxed">
            {sandboxOutput || "// Test your agent here..."}
          </pre>
        </div>
        <div className="px-3 pb-3">
          <div className="flex gap-1.5">
            <Input
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSandbox()}
              placeholder="Test prompt..."
              className="h-8 text-xs font-mono bg-white/5 border-white/10 text-emerald-300 placeholder:text-slate-600 focus-visible:ring-emerald-500/50"
            />
            <Button
              onClick={runSandbox}
              disabled={!sandboxInput.trim() || sandboxRunning || state.selectedTools.length === 0}
              size="sm"
              className="h-8 w-8 p-0 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border-0"
            >
              {sandboxRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPanel;
