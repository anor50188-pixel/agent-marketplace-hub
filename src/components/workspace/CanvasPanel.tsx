import { AnimatePresence, motion } from "framer-motion";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Database, FileText, Monitor, Settings, Wrench } from "lucide-react";
import ToolPowerCards from "./ToolPowerCards";
import type { WorkspaceState } from "./AgentWorkspace";

interface CanvasPanelProps {
  state: WorkspaceState;
  onUpdate: (partial: Partial<WorkspaceState>) => void;
}

const sectionMeta: Record<string, { label: string; icon: React.ElementType }> = {
  info: { label: "Agent ma'lumotlari", icon: FileText },
  knowledge: { label: "Bilimlar bazasi", icon: Database },
  tools: { label: "Toollar", icon: Wrench },
  model: { label: "Model sozlamalari", icon: Settings },
  output: { label: "Chiqish kanallari", icon: Monitor },
};

const pageVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const CanvasPanel = ({ state, onUpdate }: CanvasPanelProps) => {
  const meta = sectionMeta[state.activeNode];

  const toggleOutput = (channel: string) => {
    const channels = state.outputChannels.includes(channel)
      ? state.outputChannels.filter((c) => c !== channel)
      : [...state.outputChannels, channel];
    onUpdate({ outputChannels: channels });
  };

  return (
    <div className="h-full flex flex-col border-r border-white/10 bg-white/[0.02]">
      {/* Tab bar */}
      <div className="h-10 shrink-0 flex items-center gap-2 px-5 border-b border-white/10 bg-white/[0.03]">
        {meta && (
          <>
            <meta.icon className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-medium text-slate-300">{meta.label}</span>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.activeNode}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            {state.activeNode === "info" && (
              <div className="max-w-lg space-y-5">
                <div>
                <h2 className="text-xl font-bold text-white mb-1">Agent haqida</h2>
                  <p className="text-sm text-slate-400">Agentingiz nomi va vazifasini belgilang.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-300">Nomi</Label>
                    <Input
                      value={state.agentName}
                      onChange={(e) => onUpdate({ agentName: e.target.value })}
                      placeholder="Masalan: Marketing Trend Hunter"
                      className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-purple-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-300">Tavsif</Label>
                    <textarea
                      value={state.agentDescription}
                      onChange={(e) => onUpdate({ agentDescription: e.target.value })}
                      placeholder="Agent nima vazifani bajaradi?"
                      rows={4}
                      className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {state.activeNode === "knowledge" && (
              <div className="max-w-lg space-y-5">
                <div>
                <h2 className="text-xl font-bold text-white mb-1">Bilimlar bazasi</h2>
                  <p className="text-sm text-slate-400">Agentga bilim berish uchun hujjatlarni yuklang.</p>
                </div>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-10 flex flex-col items-center justify-center text-center">
                  <Database className="w-10 h-10 text-slate-600 mb-3" />
                  <p className="text-sm text-slate-400 font-medium">Fayllarni shu yerga tashlang yoki bosing</p>
                  <p className="text-xs text-slate-500 mt-1">PDF, CSV, TXT — tez kunda</p>
                </div>
              </div>
            )}

            {state.activeNode === "tools" && (
              <div className="space-y-5">
                <div>
                <h2 className="text-xl font-bold text-white mb-1">Toollar</h2>
                  <p className="text-sm text-slate-400">Toollarni tanlang va rasmiy saytlarida ro'yxatdan o'ting.</p>
                </div>
                <ToolPowerCards
                  selectedTools={state.selectedTools}
                  onToggle={(id) => {
                    const tools = state.selectedTools.includes(id)
                      ? state.selectedTools.filter((t) => t !== id)
                      : [...state.selectedTools, id];
                    onUpdate({ selectedTools: tools });
                  }}
                />
              </div>
            )}

            {state.activeNode === "model" && (
              <div className="max-w-lg space-y-6">
                <div>
                <h2 className="text-xl font-bold text-white mb-1">Model sozlamalari</h2>
                  <p className="text-sm text-slate-400">Agent miyasini boshqaradigan AI modelni sozlang.</p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-300">AI Model</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "minimax", name: "MiniMax", desc: "Fast & efficient" },
                        { id: "gpt4", name: "GPT-4o", desc: "Most capable" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => onUpdate({ modelSettings: { ...state.modelSettings, model: m.id } })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            state.modelSettings.model === m.id
                              ? "border-purple-500/50 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                              : "border-white/10 bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <p className="text-sm font-semibold text-white">{m.name}</p>
                          <p className="text-xs text-slate-400">{m.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-slate-300">Temperature</Label>
                      <span className="text-xs font-mono text-purple-300">{state.modelSettings.temperature}</span>
                    </div>
                    <Slider
                      value={[state.modelSettings.temperature]}
                      onValueChange={([v]) => onUpdate({ modelSettings: { ...state.modelSettings, temperature: v } })}
                      min={0}
                      max={1}
                      step={0.1}
                      className="[&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-300">Max Tokens</Label>
                    <Input
                      type="number"
                      value={state.modelSettings.maxTokens}
                      onChange={(e) => onUpdate({ modelSettings: { ...state.modelSettings, maxTokens: Number(e.target.value) } })}
                      className="h-11 bg-white/5 border-white/10 text-white font-mono focus-visible:ring-purple-500/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {state.activeNode === "output" && (
              <div className="max-w-lg space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Output Channels</h2>
                  <p className="text-sm text-slate-400">Choose where your agent delivers results.</p>
                </div>
                <div className="space-y-3">
                  {[
                    { id: "dashboard", name: "Live Dashboard", desc: "Visual analytics dashboard" },
                    { id: "telegram", name: "Telegram Bot", desc: "Send results to Telegram" },
                    { id: "email", name: "Email Reports", desc: "Scheduled email digests" },
                    { id: "webhook", name: "Webhook", desc: "POST results to any URL" },
                  ].map((ch) => (
                    <div
                      key={ch.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{ch.name}</p>
                        <p className="text-xs text-slate-400">{ch.desc}</p>
                      </div>
                      <Switch
                        checked={state.outputChannels.includes(ch.id)}
                        onCheckedChange={() => toggleOutput(ch.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CanvasPanel;
