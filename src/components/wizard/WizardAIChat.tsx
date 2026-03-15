import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface WizardAIChatProps {
  agentName: string;
  agentDescription: string;
  selectedTools: string[];
  toolLabels: string[];
}

const generateResponse = (
  input: string,
  agentName: string,
  selectedTools: string[],
  toolLabels: string[]
): string => {
  const lower = input.toLowerCase();

  if (lower.includes("tool") || lower.includes("vosita")) {
    return `🛠 **${agentName}** agentingiz uchun ${toolLabels.length} ta tool tanlangan:\n\n${toolLabels.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nHar bir tool o'z rasmiy saytida ro'yxatdan o'tganingizdan keyin ishlaydi. Qo'shimcha tool qo'shmoqchimisiz?`;
  }

  if (lower.includes("holat") || lower.includes("status") || lower.includes("texnik")) {
    return `📊 **${agentName}** agenti texnik holati:\n\n• Nomi: ${agentName}\n• Toollar soni: ${selectedTools.length}\n• Toollar: ${toolLabels.join(", ")}\n• Holat: Konfiguratsiya bosqichida\n\nAgent yaratilgandan keyin 24/7 ishlaydi.`;
  }

  if (lower.includes("maslahat") || lower.includes("tavsiya") || lower.includes("qanday")) {
    return `💡 **Maslahat:**\n\n1. Avval har bir tool uchun rasmiy saytda ro'yxatdan o'ting\n2. API kalitlarni oling\n3. Test bosqichida agentni sinab ko'ring\n4. Natijalar yaxshi bo'lsa — yarating!\n\nQaysi tool haqida ko'proq bilmoqchisiz?`;
  }

  if (lower.includes("search") || lower.includes("qidirish") || lower.includes("serper")) {
    return `🔍 **Web Search (Serper)** haqida:\n\nBu tool internetdan ma'lumot topadi. Agent quyidagilarni qila oladi:\n• Trend research\n• Raqobatchi tahlili\n• Yangiliklar monitoring\n\nSerper.dev da ro'yxatdan o'ting va API kalit oling.`;
  }

  if (lower.includes("code") || lower.includes("kod") || lower.includes("e2b")) {
    return `💻 **Code Execution (E2B)** haqida:\n\nBu tool kod yozadi va ishga tushiradi:\n• Data analysis\n• Matematik hisoblar\n• Avtomatik skriptlar\n\nE2B.dev da ro'yxatdan o'ting.`;
  }

  return `🤖 Men **${agentName}** agentingiz bo'yicha yordam beraman.\n\nSiz so'rashingiz mumkin:\n• "Agentim texnik holati qanday?"\n• "Qaysi toollar tanlangan?"\n• "Maslahat ber"\n• Har qanday tool haqida savol\n\nNima bilmoqchisiz?`;
};

const WizardAIChat = ({ agentName, agentDescription, selectedTools, toolLabels }: WizardAIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Salom! 👋 Men **${agentName}** agentingizni sozlashda yordam beraman.\n\n${selectedTools.length} ta tool tanlangan: ${toolLabels.join(", ")}.\n\nMenga savol bering — toollar, agent holati yoki maslahat haqida.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(input, agentName, selectedTools, toolLabels);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: response },
      ]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <motion.div
      key="step-chat"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-4 flex flex-col h-full"
    >
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-1">AI Yordamchi</h2>
        <p className="text-sm text-muted-foreground">Agent sozlash bo'yicha maslahat oling</p>
      </div>

      {/* Chat messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto glass rounded-xl border border-border/30 p-4 space-y-3 min-h-[300px] max-h-[400px]"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted/50 text-foreground rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-semibold text-primary">ASER AI</span>
                  </div>
                )}
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-muted/50 px-4 py-2.5 rounded-2xl rounded-bl-md flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Yozmoqda...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Savolingizni yozing..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="h-11 flex-1 glass border-border/40"
        />
        <Button
          onClick={sendMessage}
          disabled={!input.trim() || isTyping}
          className="h-11 px-5 gradient-btn border-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default WizardAIChat;
