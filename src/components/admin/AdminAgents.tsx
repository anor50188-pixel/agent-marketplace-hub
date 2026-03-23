import { useState } from "react";
import { Check, X, Eye, Search, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockAgents = [
  { id: "1", name: "SEO Yordamchi", creator: "Ali Valiyev", category: "Marketing", status: "pending", price: 15, createdAt: "2024-07-01" },
  { id: "2", name: "Kod Tekshiruvchi", creator: "Jasur T.", category: "Development", status: "approved", price: 25, createdAt: "2024-06-20" },
  { id: "3", name: "Moliya Tahlilchi", creator: "Dilnoza K.", category: "Finance", status: "pending", price: 30, createdAt: "2024-07-05" },
  { id: "4", name: "Spam Bot", creator: "Spam User", category: "Other", status: "rejected", price: 5, createdAt: "2024-06-28" },
  { id: "5", name: "Til O'rgatuvchi", creator: "Ali Valiyev", category: "Education", status: "approved", price: 10, createdAt: "2024-05-15" },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  pending: { label: "Kutilmoqda", class: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  approved: { label: "Tasdiqlangan", class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  rejected: { label: "Rad etilgan", class: "bg-destructive/10 text-destructive border-destructive/20" },
};

const AdminAgents = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = mockAgents.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.creator.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || a.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold text-foreground">Agentlar moderatsiyasi</h2>
        <p className="text-sm text-muted-foreground mt-1">Marketplace uchun agentlarni tekshirish</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-muted/30" />
        </div>
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "Barchasi" : statusConfig[f]?.label || f}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-2xl bg-card border border-border/50 flex items-center justify-between gap-4 flex-wrap"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {agent.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{agent.name}</p>
                <p className="text-xs text-muted-foreground">{agent.creator} · {agent.category} · ${agent.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className={statusConfig[agent.status]?.class}>
                {agent.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                {statusConfig[agent.status]?.label}
              </Badge>

              {agent.status === "pending" && (
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" className="h-8 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10">
                    <Check className="w-3.5 h-3.5 mr-1" /> Tasdiqlash
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive/30 hover:bg-destructive/10">
                    <X className="w-3.5 h-3.5 mr-1" /> Rad etish
                  </Button>
                </div>
              )}

              <Button size="sm" variant="ghost" className="h-8">
                <Eye className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminAgents;
