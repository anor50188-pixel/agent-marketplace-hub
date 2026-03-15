import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Wrench,
  Play,
  Rocket,
  Check,
  Search,
  Globe,
  Code,
  Twitter,
  BarChart3,
  ChevronRight,
  Loader2,
  Bot } from
"lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const steps = [
{ id: 1, label: "Agent ma'lumotlari", icon: FileText },
{ id: 2, label: "Tool tanlash", icon: Wrench },
{ id: 3, label: "Test qilish", icon: Play },
{ id: 4, label: "Yaratish", icon: Rocket }];



interface Tool {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  group: "basic" | "advanced";
}

const tools: Tool[] = [
{ id: "web-search", label: "Web Search (Serper)", description: "Internetdan ma'lumot topish va research qilish", icon: Search, group: "basic" },
{ id: "website-reader", label: "Website Reader (Firecrawl)", description: "Web sahifani o'qish, tahlil qilish", icon: Globe, group: "basic" },
{ id: "code-execution", label: "Code Execution (E2B)", description: "Kod yozish, data analysis, automation", icon: Code, group: "basic" },
{ id: "social-search", label: "Social Media Search (X API)", description: "Trend analysis, audience research", icon: Twitter, group: "basic" },
{ id: "file-analysis", label: "File / Data Analysis", description: "CSV, PDF, Excel tahlil qilish", icon: FileText, group: "advanced" },
{ id: "dashboard-builder", label: "Dashboard Builder", description: "Agent natijalarini vizual dashboardda ko'rsatish", icon: BarChart3, group: "advanced" },
{ id: "ai-brain", label: "AI Brain (MiniMax)", description: "Agentni boshqaruvchi AI model", icon: Bot, group: "advanced" }];


const AgentBuilderWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [agentName, setAgentName] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [testInput, setTestInput] = useState("");
  const [testOutput, setTestOutput] = useState("");
  const [testRunning, setTestRunning] = useState(false);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const toggleTool = (id: string) => {
    setSelectedTools((prev) =>
    prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const canNext = () => {
    if (currentStep === 1) return agentName.trim() && agentDescription.trim();
    if (currentStep === 2) return selectedTools.length > 0;
    return true;
  };

  const runTest = () => {
    if (!testInput.trim()) return;
    setTestRunning(true);
    setTestOutput("");
    const selectedToolNames = tools.filter((t) => selectedTools.includes(t.id)).map((t) => t.label);
    let output = `🤖 Agent: ${agentName}\n📋 Vazifa: ${testInput}\n\n`;
    let i = 0;
    const interval = setInterval(() => {
      if (i < selectedToolNames.length) {
        output += `⚙️ ${selectedToolNames[i]} ishga tushirilmoqda...\n`;
        setTestOutput(output);
        i++;
      } else {
        output += `\n✅ Test muvaffaqiyatli yakunlandi!\n📊 Natija: "${testInput}" bo'yicha ${selectedToolNames.length} ta tool ishlatildi.`;
        setTestOutput(output);
        setTestRunning(false);
        clearInterval(interval);
      }
    }, 700);
  };

  const handleCreate = () => {
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      setCreated(true);
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-6">
            
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-1">Agent ma'lumotlari</h2>
              <p className="text-sm text-muted-foreground">Agentingiz haqida asosiy ma'lumotlarni kiriting</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Agent nomi</Label>
                <Input
                  placeholder="Masalan: Marketing Trend Hunter"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="h-11 glass border-border/40 focus:border-primary/50" />
                
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Tavsif</Label>
                <textarea
                  placeholder="Agent nima vazifani bajaradi..."
                  value={agentDescription}
                  onChange={(e) => setAgentDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-border/40 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 glass" />
                
              </div>

            </div>
          </motion.div>);


      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-6">
            
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-1">Tool tanlash</h2>
              <p className="text-sm text-muted-foreground">Agent ishlatadigan vositalarni tanlang</p>
            </div>

            {(["basic", "advanced"] as const).map((group) =>
            <div key={group}>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                  {group === "basic" ? "Asosiy toollar" : "Kengaytirilgan toollar"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tools.
                filter((t) => t.group === group).
                map((tool) => {
                  const isSelected = selectedTools.includes(tool.id);
                  return (
                    <motion.button
                      key={tool.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => toggleTool(tool.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      isSelected ?
                      "border-primary/50 bg-primary/5 shadow-[0_0_15px_hsl(var(--primary)/0.1)]" :
                      "glass border-border/30 hover:border-border/50"}`
                      }>
                      
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-primary/20" : "bg-muted/50"}`
                      }>
                            <tool.icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground">{tool.label}</p>
                            <p className="text-xs text-muted-foreground">{tool.description}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? "bg-primary border-primary" : "border-border"}`
                      }>
                            {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                          </div>
                        </motion.button>);

                })}
                </div>
              </div>
            )}
          </motion.div>);


      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-6">
            
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-1">Agentni test qilish</h2>
              <p className="text-sm text-muted-foreground">Yaratishdan oldin agentni sinab ko'ring</p>
            </div>

            {/* Agent summary */}
            <div className="glass rounded-xl p-4 border border-border/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{agentName}</p>
                  <p className="text-xs text-muted-foreground">{selectedTools.length} ta tool tanlangan</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tools.
                filter((t) => selectedTools.includes(t.id)).
                map((t) =>
                <span key={t.id} className="text-[10px] px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                      {t.label}
                    </span>
                )}
              </div>
            </div>

            {/* Test input */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Test uchun prompt yozing..."
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runTest()}
                  className="h-11 flex-1 glass border-border/40" />
                
                <Button
                  onClick={runTest}
                  disabled={testRunning || !testInput.trim()}
                  className="h-11 px-5 gradient-btn border-0 gap-2">
                  
                  {testRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Run Test
                </Button>
              </div>

              {/* Output */}
              <div className="glass rounded-xl p-4 border border-border/30 min-h-[200px]">
                <pre className="text-sm text-muted-foreground font-mono whitespace-pre-wrap leading-relaxed">
                  {testOutput || "Test natijasi bu yerda ko'rinadi..."}
                </pre>
              </div>
            </div>
          </motion.div>);


      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-6">
            
            {!created ?
            <>
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-1">Agent yaratish</h2>
                  <p className="text-sm text-muted-foreground">Hamma narsa tayyor! Agentni ishga tushiring.</p>
                </div>

                {/* Final summary */}
                <div className="glass rounded-2xl p-6 border border-border/30 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Bot className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-foreground">{agentName}</h3>
                      <p className="text-sm text-muted-foreground">{agentDescription}</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-muted/30 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">Toollar</p>
                    <p className="text-sm font-medium text-foreground">{selectedTools.length} ta tanlangan</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {tools.
                  filter((t) => selectedTools.includes(t.id)).
                  map((t) =>
                  <span key={t.id} className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium">
                          {t.label}
                        </span>
                  )}
                  </div>
                </div>

                <Button
                onClick={handleCreate}
                disabled={creating}
                className="w-full h-14 text-base font-semibold rounded-xl gradient-btn border-0 shadow-[0_0_25px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_35px_hsl(var(--primary)/0.3)] transition-shadow gap-2">
                
                  {creating ?
                <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Agent yaratilmoqda...
                    </> :

                <>
                      <Rocket className="w-5 h-5" />
                      Agent yaratish va ishga tushirish
                    </>
                }
                </Button>
              </> :

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-12 space-y-6">
              
                <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_40px_hsl(var(--primary)/0.3)]">
                
                  <Check className="w-10 h-10 text-primary-foreground" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-2">Agent yaratildi! 🎉</h2>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{agentName}</span> muvaffaqiyatli yaratildi va ishga tushirildi.
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm font-medium text-accent">Ishlayapti — 24/7</span>
                </div>
              </motion.div>
            }
          </motion.div>);


      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden">
      {/* Left stepper */}
      <div className="w-64 shrink-0 border-r border-border/30 p-6 flex flex-col">
        <div className="space-y-1">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return;



































          })}
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        



        

        {/* Bottom navigation */}
        {!created &&
        <div className="p-6 border-t border-border/30 flex items-center justify-between">
            <Button
            variant="ghost"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="gap-1">
            
              Orqaga
            </Button>
            {currentStep < 4 &&
          <Button
            onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
            disabled={!canNext()}
            className="gradient-btn border-0 gap-1 px-6">
            
                Keyingi
                <ChevronRight className="w-4 h-4" />
              </Button>
          }
          </div>
        }
      </div>
    </div>);

};

export default AgentBuilderWizard;