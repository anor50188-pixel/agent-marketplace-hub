import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Check, Lock, ExternalLink } from "lucide-react";
import { apiKeyStore, type ApiConnection } from "@/lib/apiKeyStore";
import { toast } from "@/hooks/use-toast";

const IntegrationsSection = () => {
  const connections = useSyncExternalStore(apiKeyStore.subscribe, apiKeyStore.getConnections);

  const handleToggle = (conn: ApiConnection) => {
    apiKeyStore.toggle(conn.id);
    if (!conn.connected) {
      toast({ title: `✅ ${conn.name} ulandi`, description: "API key muvaffaqiyatli saqlandi." });
    } else {
      toast({
        title: `🔒 ${conn.name} uzildi`,
        description: "API key olib tashlandi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      <div className="px-6 pt-8 pb-4">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Integratsiyalar</h1>
        <p className="text-sm text-muted-foreground">
          API kalitlarni ulang — agentlar shu kalitlar orqali tashqi xizmatlarga kiradi.
        </p>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {connections.map((conn, i) => (
            <motion.div
              key={conn.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border/40 bg-card/50 p-5"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: conn.color + "1a" }}
                >
                  {conn.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold text-sm text-foreground">{conn.name}</h3>
                    {conn.connected && <Check className="w-3.5 h-3.5 text-green-400" />}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{conn.description}</p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(conn)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        conn.connected
                          ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      {conn.connected ? "Uzish" : "API Key ulash"}
                    </button>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${
                        conn.connected
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-muted/40 text-muted-foreground border border-border/40"
                      }`}
                    >
                      {conn.connected ? (
                        <>
                          <Check className="w-2.5 h-2.5" /> Ulangan
                        </>
                      ) : (
                        <>
                          <Lock className="w-2.5 h-2.5" /> Ulanmagan
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsSection;
