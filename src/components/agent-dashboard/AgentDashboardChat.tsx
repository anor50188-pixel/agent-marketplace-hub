import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type AgentConfig } from "@/lib/agentStore";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const mockResponses = [
  "Ma'lumotlarni tahlil qildim. Natijalar quyidagicha:\n\n• Haftalik o'sish: +12.4%\n• Eng faol vaqt: 14:00-18:00\n• Asosiy trend: AI sohasida yangi modellar e'lon qilindi.",
  "So'rovingiz bo'yicha web qidiruvni amalga oshirdim. 15 ta manba topildi, ulardan 8 tasi yuqori ishonchlilikka ega.",
  "Hisobotni tayyorladim. Batafsil ma'lumotlarni Dashboard bo'limida ko'rishingiz mumkin.",
  "Tushundim! Sozlamalarni yangiladim. Endi agent yangi parametrlar bilan ishlaydi.",
  "API orqali 23 ta so'rov qayta ishlandi. Barchasi muvaffaqiyatli bajarildi. ✅",
];

interface Props {
  agent: AgentConfig;
}

const AgentDashboardChat = ({ agent }: Props) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Salom! Men ${agent.name} agentiman. Sizga qanday yordam bera olaman?`,
      timestamp: new Date().toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseIdx, setResponseIdx] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: mockResponses[responseIdx % mockResponses.length],
        timestamp: new Date().toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setResponseIdx((i) => i + 1);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full">
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
              <div className={`max-w-[75%] rounded-xl px-3.5 py-2.5 ${
                msg.role === "assistant"
                  ? "bg-muted/40 border border-border/30 text-foreground"
                  : "chat-bubble-user text-primary-foreground"
              }`}>
                <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                <span className={`text-[10px] mt-1 block ${
                  msg.role === "assistant" ? "text-muted-foreground" : "text-primary-foreground/70"
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
            <div className="bg-muted/40 border border-border/30 rounded-xl px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
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
        <div className="chat-input-container rounded-xl flex items-center gap-2 px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={`${agent.name} bilan suhbatlashing...`}
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
