import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";

const AgentusChat = () => {
  const [message, setMessage] = useState("");

  return (
    <motion.aside
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="w-80 shrink-0 glass border-l border-border/50 flex flex-col"
    >
      <div className="p-4 border-b border-border/30 flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">AI Yordamchi</p>
          <p className="text-xs text-muted-foreground">Har doim tayyor</p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl rounded-tl-sm p-3 max-w-[90%]"
        >
          <p className="text-sm text-foreground">
            Salom! 👋 Men sizga agent yaratishda yordam beraman. Qanday agent kerak?
          </p>
        </motion.div>
      </div>

      <div className="p-3 border-t border-border/30">
        <div className="glass rounded-xl flex items-center gap-2 p-1">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Xabar yozing..."
            className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default AgentusChat;
