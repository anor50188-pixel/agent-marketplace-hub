import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Search,
  Twitter,
  Code,
  Send,
  BarChart3,
  LineChart,
  Puzzle,
  Settings,
  X,
  GripVertical,
  Play,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";

interface Block {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const availableBlocks: Block[] = [
  { id: "web-search", label: "Web Search", icon: Search, color: "from-accent to-primary", description: "Internetdan ma'lumot izlash" },
  { id: "x-search", label: "X (Twitter) Search", icon: Twitter, color: "from-primary to-secondary", description: "X dan semantik qidiruv" },
  { id: "code-exec", label: "Code Execution", icon: Code, color: "from-secondary to-accent", description: "Kod yozish va ishga tushirish" },
  { id: "telegram", label: "Telegram yuborish", icon: Send, color: "from-primary to-accent", description: "Telegramga xabar yuborish" },
  { id: "sentiment", label: "Sentiment Analysis", icon: BarChart3, color: "from-accent to-secondary", description: "Matn hissiyotini tahlil qilish" },
  { id: "chart", label: "Grafik chizish", icon: LineChart, color: "from-secondary to-primary", description: "Matplotlib grafiklari" },
  { id: "custom", label: "Custom Tool", icon: Puzzle, color: "from-primary to-[hsl(330,70%,60%)]", description: "O'z toolingizni qo'shing" },
];

interface AgentVisualBuilderProps {
  highlightedBlocks?: string[];
}

const AgentVisualBuilder = ({ highlightedBlocks = [] }: AgentVisualBuilderProps) => {
  const [pipeline, setPipeline] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [testRunning, setTestRunning] = useState(false);
  const [testOutput, setTestOutput] = useState("");

  const addBlock = (block: Block) => {
    if (!pipeline.find((b) => b.id === block.id)) {
      setPipeline((prev) => [...prev, block]);
    }
  };

  const removeBlock = (id: string) => {
    setPipeline((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlock?.id === id) setSelectedBlock(null);
  };

  const runTest = () => {
    if (pipeline.length === 0) return;
    setTestRunning(true);
    setTestOutput("Test: hozir ishga tushirilmoqda...\n");

    const steps = pipeline.map((b) => `✅ ${b.label} — bajarildi`);
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setTestOutput((prev) => prev + steps[i] + "\n");
        i++;
      } else {
        setTestOutput((prev) => prev + "\n🎉 Barcha bosqichlar muvaffaqiyatli!");
        setTestRunning(false);
        clearInterval(interval);
      }
    }, 800);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <h3 className="font-display font-semibold text-sm text-foreground">Vizual Builder</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Bloklarni tortib pipeline yarating</p>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Available blocks */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
            Mavjud bloklar
          </p>
          <div className="grid grid-cols-2 gap-2">
            {availableBlocks.map((block) => {
              const isHighlighted = highlightedBlocks.includes(block.id);
              const isInPipeline = pipeline.some((b) => b.id === block.id);
              return (
                <motion.button
                  key={block.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addBlock(block)}
                  disabled={isInPipeline}
                  className={`relative flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                    isInPipeline
                      ? "opacity-40 cursor-not-allowed border-border/20"
                      : isHighlighted
                      ? "glass border-accent/40 shadow-[0_0_15px_hsl(var(--accent)/0.15)]"
                      : "glass glass-hover border-border/30 cursor-pointer"
                  }`}
                >
                  {isHighlighted && !isInPipeline && (
                    <motion.div
                      className="absolute -inset-px rounded-xl border-2 border-accent/50"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${block.color} flex items-center justify-center shrink-0`}>
                    <block.icon className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{block.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{block.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Pipeline */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
            Agent Pipeline
          </p>
          {pipeline.length === 0 ? (
            <div className="glass rounded-xl p-6 text-center border border-dashed border-border/40">
              <p className="text-sm text-muted-foreground">Bloklarni bu yerga qo'shing</p>
            </div>
          ) : (
            <Reorder.Group axis="y" values={pipeline} onReorder={setPipeline} className="space-y-2">
              {pipeline.map((block, index) => (
                <Reorder.Item key={block.id} value={block}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-2 p-3 rounded-xl glass border cursor-grab active:cursor-grabbing transition-all ${
                      selectedBlock?.id === block.id
                        ? "border-accent/50 shadow-[0_0_15px_hsl(var(--accent)/0.1)]"
                        : "border-border/30"
                    }`}
                    onClick={() => setSelectedBlock(block)}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-muted-foreground/50 w-5">{index + 1}.</span>
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${block.color} flex items-center justify-center shrink-0`}>
                        <block.icon className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                      <span className="text-xs font-semibold text-foreground truncate">{block.label}</span>
                    </div>
                    {/* Connector line */}
                    {index < pipeline.length - 1 && (
                      <div className="absolute left-[2.1rem] top-full w-px h-2 bg-accent/30" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBlock(block.id);
                      }}
                      className="text-muted-foreground/40 hover:text-destructive transition-colors shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>

        {/* Block settings */}
        <AnimatePresence>
          {selectedBlock && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-xl p-4 border border-accent/20">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-3.5 h-3.5 text-accent" />
                  <p className="text-xs font-semibold text-foreground">{selectedBlock.label} sozlamalari</p>
                </div>
                <input
                  placeholder={`${selectedBlock.label} uchun query...`}
                  className="w-full h-9 rounded-lg border border-border/40 bg-muted/30 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Test preview */}
        {pipeline.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Test Preview
              </p>
              <Button
                size="sm"
                onClick={runTest}
                disabled={testRunning}
                className="h-7 text-[10px] rounded-lg gradient-btn border-0 gap-1"
              >
                {testRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                Test
              </Button>
            </div>
            <div className="glass rounded-xl p-3 border border-border/30 min-h-[80px]">
              <pre className="text-[11px] text-muted-foreground font-mono whitespace-pre-wrap">
                {testOutput || "Test tugmasini bosing..."}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Save button */}
      {pipeline.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t border-border/30"
        >
          <Button className="w-full h-12 text-sm font-semibold rounded-xl gradient-btn border-0 shadow-[0_0_25px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_35px_hsl(var(--primary)/0.3)] transition-shadow">
            Agentni saqlash va ishga tushirish 🚀
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default AgentVisualBuilder;
