import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Star, Download, Eye, Cpu, DollarSign,
  ShieldCheck, MessageSquare, Clock, Zap, Globe,
  ChevronLeft, ChevronRight, ShoppingCart, AlertTriangle
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";

const TOOL_LABELS: Record<string, string> = {
  "ai-brain": "🧠 AI Brain",
  "web-search": "🔍 Web Search",
  "social-search": "𝕏 Social Media",
  "code-execution": "⚡ Code Execution",
  "file-analysis": "📊 File Analysis",
  "http-request": "🌐 HTTP Request",
  "database": "🗄️ Database",
};

interface Props {
  agent: {
    id: string;
    name: string;
    role: string;
    tools: string[];
    price?: number;
    category?: string;
    keywords?: string[];
    images?: string[];
    apiCostPerMonth?: number;
    apiRequestsPerMonth?: number;
    description?: string;
    seller: string;
    sellerAvatar: string;
    rating: number;
    reviewCount: number;
    downloads: number;
    verified: boolean;
    createdAt: string;
    totalViews?: number;
  };
  onBack: () => void;
}

const MOCK_REVIEWS = [
  { user: "Jasur M.", rating: 5, text: "Juda ajoyib agent! Bir haftada 3 ta kitob nashr qildim.", date: "2025-03-10" },
  { user: "Nilufar K.", rating: 4, text: "Yaxshi ishlaydi, lekin ba'zan javob sekin keladi.", date: "2025-03-08" },
  { user: "Sardor A.", rating: 5, text: "Pulimga arziydi. Eng yaxshi investitsiya!", date: "2025-03-05" },
  { user: "Dilnoza R.", rating: 4, text: "Ishlatish oson, natijalar ham yaxshi.", date: "2025-03-01" },
];

const MarketplaceAgentDetail = ({ agent, onBack }: Props) => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = agent.images?.length ? agent.images : ["/placeholder.svg"];

  const handleBuy = () => {
    toast({
      title: "🛒 Sotib olish",
      description: `"${agent.name}" agentini sotib olish uchun obuna rejangizni tekshiring.`,
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      {/* Top Bar */}
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-semibold text-sm text-foreground truncate">{agent.name}</h2>
          <p className="text-[11px] text-muted-foreground">Marketplace → {agent.category}</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
          {/* Main content: 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Images + Info */}
            <div className="lg:col-span-3 space-y-5">
              {/* Image carousel */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="relative aspect-video bg-muted/30 flex items-center justify-center">
                  <div className="text-4xl text-muted-foreground/20">📸</div>
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImage((p) => (p > 0 ? p - 1 : images.length - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 border border-border flex items-center justify-center text-foreground hover:bg-card transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCurrentImage((p) => (p < images.length - 1 ? p + 1 : 0))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 border border-border flex items-center justify-center text-foreground hover:bg-card transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImage(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === currentImage ? "bg-primary w-5" : "bg-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-display font-semibold text-sm text-card-foreground mb-3">Tavsif</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {agent.description || agent.role}
                </p>
              </div>

              {/* Tools */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-display font-semibold text-sm text-card-foreground mb-3">Toollar va imkoniyatlar</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.tools.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground border border-border"
                    >
                      {TOOL_LABELS[t] || t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              {agent.keywords && agent.keywords.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-display font-semibold text-sm text-card-foreground mb-3">Kalit so'zlar</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2.5 py-1 rounded-full text-[11px] bg-primary/8 text-primary border border-primary/15"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-display font-semibold text-sm text-card-foreground mb-4">
                  Sharhlar ({agent.reviewCount})
                </h3>
                <div className="space-y-4">
                  {MOCK_REVIEWS.map((review, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                            {review.user.charAt(0)}
                          </div>
                          <span className="text-xs font-medium text-foreground">{review.user}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, si) => (
                            <Star
                              key={si}
                              className={`w-3 h-3 ${si < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/20"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{review.text}</p>
                      <p className="text-[10px] text-muted-foreground/50 mt-1">{review.date}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Purchase Card */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl border border-border bg-card p-5 sticky top-6 space-y-5">
                {/* Price */}
                <div className="flex items-end gap-2">
                  <span className="font-display text-3xl font-bold text-foreground">${agent.price}</span>
                  <span className="text-xs text-muted-foreground mb-1">bir martalik</span>
                </div>

                {/* Seller */}
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="w-9 h-9 rounded-full gradient-btn flex items-center justify-center text-[11px] font-bold text-primary-foreground">
                    {agent.sellerAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-foreground">{agent.seller}</span>
                      {agent.verified && <ShieldCheck className="w-3.5 h-3.5 text-secondary" />}
                    </div>
                    <span className="text-[10px] text-muted-foreground">Sotuvchi</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Star, label: "Reyting", value: `${agent.rating}/5`, color: "text-yellow-500" },
                    { icon: Download, label: "Sotilgan", value: agent.downloads.toString(), color: "text-secondary" },
                    { icon: Eye, label: "Ko'rilgan", value: agent.totalViews?.toLocaleString() || "0", color: "text-primary" },
                    { icon: MessageSquare, label: "Sharhlar", value: agent.reviewCount.toString(), color: "text-accent" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-2.5 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <stat.icon className={`w-3 h-3 ${stat.color}`} />
                        <span className="text-[10px] text-muted-foreground">{stat.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{stat.value}</span>
                    </div>
                  ))}
                </div>

                {/* API Cost */}
                <div className="p-3 rounded-lg border border-secondary/20 bg-secondary/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-semibold text-foreground">API xarajatlari</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Oylik xarajat</p>
                      <p className="text-sm font-bold text-secondary">~${agent.apiCostPerMonth}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Oylik so'rovlar</p>
                      <p className="text-sm font-bold text-foreground">~{agent.apiRequestsPerMonth?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Commission notice */}
                <div className="p-2.5 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Narxga 20% platforma komissiyasi kiritilgan. Sotuvchi ${Math.round((agent.price || 0) * 0.8)} oladi.
                    </p>
                  </div>
                </div>

                {/* Buy button */}
                <Button
                  onClick={handleBuy}
                  className="w-full h-11 rounded-xl gradient-btn border-0 text-sm font-semibold"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Sotib olish — ${agent.price}
                </Button>

                {/* Meta info */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Kategoriya</span>
                    <span className="text-foreground font-medium">{agent.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Yaratilgan</span>
                    <span className="text-foreground font-medium">{agent.createdAt}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Toollar soni</span>
                    <span className="text-foreground font-medium">{agent.tools.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceAgentDetail;
