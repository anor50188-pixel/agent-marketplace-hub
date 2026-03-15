import { useState, useMemo, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, DollarSign, Clock, AlertTriangle, ShieldCheck, Image,
  Tag, Check, ChevronRight, Info, Ban, FileWarning, Sparkles
} from "lucide-react";
import { Button } from "./ui/button";
import { agentStore, type AgentConfig } from "@/lib/agentStore";
import { subscriptionStore } from "@/lib/subscriptionStore";
import { toast } from "@/hooks/use-toast";
import UpgradePrompt from "./UpgradePrompt";

const MIN_PRICE = 5;
const COMMISSION = 0.2;
const TEST_DAYS_REQUIRED = 10;

const SellAgents = ({ onSectionChange }: { onSectionChange?: (id: string) => void }) => {
  const agents = useSyncExternalStore(agentStore.subscribe, agentStore.getAgents);
  const canSell = subscriptionStore.canSellAgents();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "configure" | "review">("select");

  // Configure form state
  const [price, setPrice] = useState(MIN_PRICE);
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);

  const selectedAgent = selectedAgentId ? agents.find((a) => a.id === selectedAgentId) : null;

  const daysSinceCreation = (agent: AgentConfig) => {
    const created = new Date(agent.createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  };

  const isEligible = (agent: AgentConfig) => {
    return daysSinceCreation(agent) >= TEST_DAYS_REQUIRED && agent.status === "active";
  };

  const daysRemaining = (agent: AgentConfig) => {
    return Math.max(0, TEST_DAYS_REQUIRED - daysSinceCreation(agent));
  };

  const handleSelectAgent = (agent: AgentConfig) => {
    if (!isEligible(agent)) {
      toast({
        title: "⏳ Hali tayyor emas",
        description: `Bu agent kamida ${daysRemaining(agent)} kun test qilinishi kerak.`,
      });
      return;
    }
    setSelectedAgentId(agent.id);
    setDescription(agent.role);
    setStep("configure");
  };

  const addKeyword = () => {
    const kw = keywordInput.trim().toLowerCase();
    if (kw && !keywords.includes(kw) && keywords.length < 10) {
      setKeywords([...keywords, kw]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const addMockImage = () => {
    if (images.length < 5) {
      setImages([...images, `/placeholder.svg`]);
      toast({ title: "📸 Rasm qo'shildi", description: `${images.length + 1}/5 rasm` });
    }
  };

  const removeImage = (i: number) => {
    setImages(images.filter((_, idx) => idx !== i));
  };

  const handlePublish = () => {
    if (!selectedAgent) return;
    if (price < MIN_PRICE) {
      toast({ title: "❌ Xatolik", description: `Minimal narx $${MIN_PRICE}` });
      return;
    }
    if (!agreed) {
      toast({ title: "❌ Xatolik", description: "Qoidalarni qabul qiling" });
      return;
    }

    agentStore.updateAgent(selectedAgent.id, {
      status: "published",
      price,
      description,
      keywords,
      images,
      publishedAt: new Date().toISOString().split("T")[0],
    });

    toast({
      title: "🎉 Agent sotuvga qo'yildi!",
      description: `"${selectedAgent.name}" marketplace'da paydo bo'ladi.`,
    });

    // Reset
    setSelectedAgentId(null);
    setStep("select");
    setPrice(MIN_PRICE);
    setDescription("");
    setKeywords([]);
    setImages([]);
    setAgreed(false);
  };

  const sellerEarning = Math.round(price * (1 - COMMISSION) * 100) / 100;

  // STEP: Select Agent
  if (step === "select") {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-background">
        <div className="px-6 pt-8 pb-4">
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Agent <span className="gradient-text">Sotish</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Agentlaringizdan birini tanlang va marketplace'ga qo'ying
          </p>
        </div>

        {/* Rules notice */}
        <div className="mx-6 mb-4 p-4 rounded-xl border border-secondary/20 bg-secondary/5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-foreground">Sotish qoidalari</p>
              <ul className="text-[11px] text-muted-foreground space-y-1">
                <li>• Agent kamida <strong>10 kun</strong> test qilingan bo'lishi shart</li>
                <li>• Minimal narx: <strong>${MIN_PRICE}</strong></li>
                <li>• Platforma komissiyasi: <strong>{COMMISSION * 100}%</strong> (har bir sotuvdan)</li>
                <li>• Noqonuniy maqsadlardagi agentlar <strong>bloklanaadi</strong></li>
                <li>• Faqat <strong>Pro Max</strong> obunachilari agent sota oladi</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 pb-6">
          {agents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Bot className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">Hali agent yaratilmagan</p>
              <p className="text-muted-foreground/50 text-xs mt-1">"Agent yaratish" bo'limidan boshlang</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agents.map((agent, i) => {
                const eligible = isEligible(agent);
                const remaining = daysRemaining(agent);
                const alreadyPublished = agent.status === "published";

                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => !alreadyPublished && handleSelectAgent(agent)}
                    className={`rounded-xl border p-4 transition-all ${
                      alreadyPublished
                        ? "border-secondary/30 bg-secondary/5 cursor-default"
                        : eligible
                        ? "border-border bg-card hover:border-primary/30 cursor-pointer"
                        : "border-border bg-card/50 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          alreadyPublished ? "bg-secondary/15" : "bg-primary/10"
                        }`}>
                          <Bot className={`w-5 h-5 ${alreadyPublished ? "text-secondary" : "text-primary"}`} />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-sm text-foreground">{agent.name}</h3>
                          <p className="text-[11px] text-muted-foreground">
                            {alreadyPublished
                              ? `✅ Sotuvda — $${agent.price}`
                              : eligible
                              ? "✅ Sotishga tayyor"
                              : `⏳ ${remaining} kun qoldi`}
                          </p>
                        </div>
                      </div>
                      {eligible && !alreadyPublished && (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{agent.role}</p>

                    {!eligible && !alreadyPublished && (
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        Yaratilgan: {agent.createdAt} · {daysSinceCreation(agent)}/{TEST_DAYS_REQUIRED} kun
                        <div className="flex-1 h-1 rounded-full bg-muted ml-1">
                          <div
                            className="h-full rounded-full bg-primary/50 transition-all"
                            style={{ width: `${Math.min(100, (daysSinceCreation(agent) / TEST_DAYS_REQUIRED) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // STEP: Configure
  if (step === "configure" && selectedAgent) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-background">
        <div className="px-6 pt-6 pb-3 border-b border-border flex items-center gap-3">
          <button
            onClick={() => { setStep("select"); setSelectedAgentId(null); }}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            ← Ortga
          </button>
          <div className="flex-1">
            <h2 className="font-display font-semibold text-sm text-foreground">
              "{selectedAgent.name}" ni sotishga tayyorlash
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Price */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display font-semibold text-sm text-card-foreground mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-secondary" /> Narxni belgilang
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <input
                    type="number"
                    min={MIN_PRICE}
                    value={price}
                    onChange={(e) => setPrice(Math.max(MIN_PRICE, Number(e.target.value)))}
                    className="w-28 h-10 pl-7 pr-3 rounded-lg border border-border bg-muted/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>Komissiya ({COMMISSION * 100}%): <span className="text-destructive font-medium">-${(price * COMMISSION).toFixed(2)}</span></p>
                  <p>Siz olasiz: <span className="text-secondary font-semibold">${sellerEarning}</span></p>
                </div>
              </div>
              {price < MIN_PRICE && (
                <p className="text-[11px] text-destructive mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Minimal narx ${MIN_PRICE}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display font-semibold text-sm text-card-foreground mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" /> Tavsif
              </h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Agent haqida batafsil yozing..."
                className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <p className="text-[10px] text-muted-foreground mt-1">{description.length}/500</p>
            </div>

            {/* Images */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display font-semibold text-sm text-card-foreground mb-3 flex items-center gap-2">
                <Image className="w-4 h-4 text-accent" /> Infografika rasmlari
                <span className="text-[10px] text-muted-foreground font-normal ml-auto">{images.length}/5</span>
              </h3>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg border border-border bg-muted/30 flex items-center justify-center relative group"
                  >
                    <span className="text-lg text-muted-foreground/30">📸</span>
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    onClick={addMockImage}
                    className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/30 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="text-lg">+</span>
                  </button>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">JPG, PNG · maks 2MB · 5 tagacha rasm</p>
            </div>

            {/* Keywords */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display font-semibold text-sm text-card-foreground mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" /> Kalit so'zlar
                <span className="text-[10px] text-muted-foreground font-normal ml-auto">{keywords.length}/10</span>
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                  placeholder="Kalit so'z kiriting..."
                  className="flex-1 h-9 rounded-lg border border-border bg-muted/30 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <Button onClick={addKeyword} size="sm" variant="outline" className="h-9 rounded-lg border-border">
                  Qo'shish
                </Button>
              </div>
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-primary/8 text-primary border border-primary/15"
                    >
                      #{kw}
                      <button
                        onClick={() => removeKeyword(kw)}
                        className="hover:text-destructive transition-colors"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* API Cost Info */}
            <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-5">
              <h3 className="font-display font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" /> API xarajatlari (xaridorga ko'rsatiladi)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-[10px] text-muted-foreground">Oylik taxminiy xarajat</p>
                  <p className="text-sm font-bold text-secondary">~${selectedAgent.apiCostPerMonth || "N/A"}</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-[10px] text-muted-foreground">Oylik so'rovlar</p>
                  <p className="text-sm font-bold text-foreground">~{selectedAgent.apiRequestsPerMonth?.toLocaleString() || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Legal Agreement */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <FileWarning className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">Xavfsizlik va qoidalar</p>
                  <ul className="text-[11px] text-muted-foreground space-y-1">
                    <li>• Noqonuniy faoliyatga mo'ljallangan agentlar darhol <strong>bloklanadi</strong></li>
                    <li>• Spam, fishing, zararli dasturlar tarqatish <strong>taqiqlanadi</strong></li>
                    <li>• Sotuvchi API holati haqida xaridorlarga <strong>xabar berishi shart</strong></li>
                    <li>• Agentlar platformaning <strong>Foydalanish shartlari</strong>ga mos bo'lishi kerak</li>
                    <li>• Platforma har bir sotuvdan <strong>{COMMISSION * 100}%</strong> komissiya oladi</li>
                  </ul>
                  <label className="flex items-center gap-2 pt-2 cursor-pointer">
                    <button
                      onClick={() => setAgreed(!agreed)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        agreed
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border bg-muted/30"
                      }`}
                    >
                      {agreed && <Check className="w-3 h-3" />}
                    </button>
                    <span className="text-xs text-foreground">
                      Qoidalarni o'qidim va qabul qilaman
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("review")}
                disabled={price < MIN_PRICE || !description.trim() || !agreed}
                className="flex-1 h-11 rounded-xl border-border"
              >
                Ko'rib chiqish →
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP: Review & Publish
  if (step === "review" && selectedAgent) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-background">
        <div className="px-6 pt-6 pb-3 border-b border-border flex items-center gap-3">
          <button
            onClick={() => setStep("configure")}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            ← Ortga
          </button>
          <h2 className="font-display font-semibold text-sm text-foreground">Yakuniy ko'rib chiqish</h2>
        </div>

        <div className="flex-1 overflow-auto px-6 py-6">
          <div className="max-w-2xl mx-auto space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-primary/20 bg-card p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground">{selectedAgent.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedAgent.category || "General"}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-display text-2xl font-bold text-foreground">${price}</p>
                  <p className="text-[10px] text-muted-foreground">Siz olasiz: ${sellerEarning}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-1 font-semibold">Tavsif</p>
                <p className="text-sm text-foreground leading-relaxed">{description}</p>
              </div>

              {keywords.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5 font-semibold">Kalit so'zlar</p>
                  <div className="flex flex-wrap gap-1">
                    {keywords.map((kw) => (
                      <span key={kw} className="px-2 py-0.5 rounded-full text-[10px] bg-primary/8 text-primary border border-primary/15">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border text-center">
                  <p className="text-[10px] text-muted-foreground">Rasmlar</p>
                  <p className="text-sm font-semibold text-foreground">{images.length}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border text-center">
                  <p className="text-[10px] text-muted-foreground">API xarajat</p>
                  <p className="text-sm font-semibold text-secondary">${selectedAgent.apiCostPerMonth || "—"}/oy</p>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border text-center">
                  <p className="text-[10px] text-muted-foreground">Toollar</p>
                  <p className="text-sm font-semibold text-foreground">{selectedAgent.tools.length}</p>
                </div>
              </div>
            </motion.div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("configure")}
                className="flex-1 h-11 rounded-xl border-border"
              >
                Tahrirlash
              </Button>
              <Button
                onClick={handlePublish}
                className="flex-1 h-11 rounded-xl gradient-btn border-0 font-semibold"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Sotuvga qo'yish
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SellAgents;
