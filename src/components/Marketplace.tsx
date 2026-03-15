import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, Star, Download, Eye, Cpu,
  DollarSign, ShieldCheck, ChevronDown, X
} from "lucide-react";
import { Button } from "./ui/button";
import { marketplaceAgents, CATEGORIES, SORT_OPTIONS } from "@/lib/marketplaceData";
import MarketplaceAgentDetail from "./MarketplaceAgentDetail";

const TOOL_ICONS: Record<string, string> = {
  "ai-brain": "🧠",
  "web-search": "🔍",
  "social-search": "𝕏",
  "code-execution": "⚡",
  "file-analysis": "📊",
  "http-request": "🌐",
  "database": "🗄️",
};

const PRICE_RANGES = [
  { label: "Barchasi", min: 0, max: Infinity },
  { label: "$5 – $15", min: 5, max: 15 },
  { label: "$15 – $30", min: 15, max: 30 },
  { label: "$30+", min: 30, max: Infinity },
];

const Marketplace = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Barchasi");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...marketplaceAgents];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          a.keywords?.some((k) => k.includes(q)) ||
          a.category?.toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== "Barchasi") {
      result = result.filter((a) => a.category === category);
    }

    // Price
    const range = PRICE_RANGES[priceRange];
    result = result.filter((a) => (a.price || 0) >= range.min && (a.price || 0) <= range.max);

    // Sort
    switch (sortBy) {
      case "popular":
        result.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
      case "newest":
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case "price-low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return result;
  }, [search, category, sortBy, priceRange]);

  const agent = selectedAgent
    ? marketplaceAgents.find((a) => a.id === selectedAgent)
    : null;

  if (agent) {
    return <MarketplaceAgentDetail agent={agent} onBack={() => setSelectedAgent(null)} />;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-2">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">
          Agent <span className="gradient-text">Marketplace</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Tayyor agentlarni toping, sinang va sotib oling
        </p>
      </div>

      {/* Search + Filters Bar */}
      <div className="px-6 py-4 space-y-3">
        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Agent qidiring..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-10 w-10 rounded-xl border-border ${showFilters ? "bg-primary/10 border-primary/30 text-primary" : ""}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Category chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                category === cat
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-4 pt-2 pb-1">
                {/* Price Range */}
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Narx</p>
                  <div className="flex gap-1">
                    {PRICE_RANGES.map((r, i) => (
                      <button
                        key={r.label}
                        onClick={() => setPriceRange(i)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                          priceRange === i
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "bg-card border border-border text-muted-foreground"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Saralash</p>
                  <div className="flex gap-1">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                          sortBy === opt.value
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "bg-card border border-border text-muted-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results count */}
      <div className="px-6 pb-2">
        <p className="text-xs text-muted-foreground">
          {filtered.length} ta agent topildi
        </p>
      </div>

      {/* Agent Grid */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">Agent topilmadi</p>
            <p className="text-muted-foreground/50 text-xs mt-1">Qidiruv so'zini o'zgartiring</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedAgent(agent.id)}
                className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(250_85%_65%_/_0.06)] transition-all cursor-pointer group"
              >
                {/* Seller + Verified */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full gradient-btn flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                      {agent.sellerAvatar}
                    </div>
                    <span className="text-[11px] text-muted-foreground font-medium">{agent.seller}</span>
                    {agent.verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[11px] font-semibold text-foreground">{agent.rating}</span>
                    <span className="text-[10px] text-muted-foreground">({agent.reviewCount})</span>
                  </div>
                </div>

                {/* Name + Role */}
                <h3 className="font-display font-semibold text-sm text-card-foreground mb-1 group-hover:text-primary transition-colors">
                  {agent.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                  {agent.role}
                </p>

                {/* Tools */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {agent.tools.map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground"
                    >
                      {TOOL_ICONS[t] || "🔧"}
                    </span>
                  ))}
                  {agent.category && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary font-medium">
                      {agent.category}
                    </span>
                  )}
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3 mb-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" /> {agent.downloads}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {agent.totalViews?.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> ~${agent.apiCostPerMonth}/oy
                  </span>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-secondary" />
                    <span className="font-display font-bold text-lg text-foreground">{agent.price}</span>
                  </div>
                  <Button size="sm" className="h-7 px-3 text-[11px] rounded-lg gradient-btn border-0">
                    Batafsil
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
