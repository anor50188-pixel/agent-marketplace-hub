import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { Button } from "./ui/button";

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
      "Salom! 👋 Qanday agent yaratmoqchisiz? Masalan: \"Har kuni X dan AI trendlarini izlab, Telegramimga yuboradigan agent\" deb yozing.",
  },
];

const aiResponses = [
  "Agent qanday vazifani bajarishi kerak? Masalan: ma'lumot yig'ish, tahlil qilish, xabar yuborish...",
  "Qaysi toollar kerak? (X search, web browse, code execution, Telegram yuborish...)",
  "Qachon ishlasin? (har soat, har kuni ertalab, real-time)",
  "Natija qayerga yuborilsin? (Telegram, email, dashboard)",
  "Ajoyib! Shunday agent bo'ladimi? Agentingiz tayyor — saqlash va ishga tushirish tugmasini bosing! 🚀",
];

interface AgentChatProps {
  onBlockSuggested?: (blockId: string) => void;
}

const AgentChat = ({ onBlockSuggested }: AgentChatProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
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
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponses[responseIndex % aiResponses.length],
      };
      setMessages((prev) => [...prev, aiMsg]);
      setResponseIndex((prev) => prev + 1);
      setIsTyping(false);

      // Suggest blocks based on conversation
      if (responseIndex === 0 && onBlockSuggested) {
        onBlockSuggested("web-search");
      }
      if (responseIndex === 1 && onBlockSuggested) {
        onBlockSuggested("telegram");
      }
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm text-foreground">Agentus AI</h3>
            <p className="text-xs text-muted-foreground">Agent yaratish yordamchisi</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === "assistant"
                    ? "bg-gradient-to-br from-accent to-primary"
                    : "bg-gradient-to-br from-secondary to-primary"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                ) : (
                  <User className="w-3.5 h-3.5 text-primary-foreground" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "glass border-accent/10 text-foreground"
                    : "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
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
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <div className="glass rounded-2xl px-4 py-3 border-accent/10">
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
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Agent haqida yozing..."
            className="flex-1 h-11 rounded-xl border border-border/50 bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
          />
          <Button
            onClick={sendMessage}
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

export default AgentChat;
