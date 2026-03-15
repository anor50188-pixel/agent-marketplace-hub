import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import {
  Check, X, Crown, Zap, Sparkles, ShieldCheck, Star
} from "lucide-react";
import { Button } from "./ui/button";
import { PLANS, subscriptionStore, type PlanType } from "@/lib/subscriptionStore";
import { toast } from "@/hooks/use-toast";

const PLAN_ICONS: Record<PlanType, React.ReactNode> = {
  free: <Zap className="w-5 h-5" />,
  pro: <Star className="w-5 h-5" />,
  "pro-max": <Crown className="w-5 h-5" />,
};

const Subscriptions = () => {
  const currentPlan = useSyncExternalStore(subscriptionStore.subscribe, subscriptionStore.getPlan);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const handleSelectPlan = (planId: PlanType) => {
    if (planId === currentPlan) return;

    if (planId === "free" && currentPlan !== "free") {
      toast({
        title: "⚠️ Rejani pasaytirish",
        description: "Hozirgi imkoniyatlaringiz cheklanadi. Ishonchingiz komilmi?",
      });
    }

    subscriptionStore.setPlan(planId);
    const plan = PLANS.find((p) => p.id === planId)!;
    toast({
      title: `✅ ${plan.name} rejasiga o'tdingiz!`,
      description: planId === "free" ? "Bepul reja faollashtirildi" : `Oylik to'lov: ${plan.priceLabel}`,
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      <div className="px-6 pt-8 pb-2">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">
          Obuna <span className="gradient-text">Rejalari</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          O'zingizga mos rejani tanlang va AI agentlar bilan ishlashni boshlang
        </p>
      </div>

      {/* Billing toggle */}
      <div className="px-6 py-3">
        <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-card border border-border">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              billingCycle === "monthly"
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground"
            }`}
          >
            Oylik
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              billingCycle === "yearly"
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground"
            }`}
          >
            Yillik
            <span className="ml-1 text-[10px] text-secondary font-semibold">-20%</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
          {PLANS.map((plan, i) => {
            const isActive = plan.id === currentPlan;
            const price = billingCycle === "yearly" ? Math.round(plan.price * 0.8) : plan.price;
            const isPopular = plan.id === "pro";

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-xl border p-6 flex flex-col transition-all ${
                  isActive
                    ? "border-primary bg-primary/5 shadow-[0_0_30px_hsl(250_85%_65%_/_0.1)]"
                    : isPopular
                    ? "border-primary/30 bg-card"
                    : "border-border bg-card"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold text-primary-foreground bg-gradient-to-r ${plan.color}`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Active badge */}
                {isActive && (
                  <div className="absolute -top-2.5 right-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-secondary-foreground">
                      Hozirgi
                    </span>
                  </div>
                )}

                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-primary-foreground`}>
                    {PLAN_ICONS[plan.id]}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground">{plan.name}</h3>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5">
                  {plan.price === 0 ? (
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-3xl font-bold text-foreground">Bepul</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-3xl font-bold text-foreground">${price}</span>
                      <span className="text-sm text-muted-foreground">/oy</span>
                    </div>
                  )}
                  {billingCycle === "yearly" && plan.price > 0 && (
                    <p className="text-[11px] text-secondary mt-0.5">
                      ${price * 12}/yil · ${plan.price - price} tejaysiz
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="flex-1 space-y-2.5 mb-5">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <span className="text-xs text-foreground leading-relaxed">{feature}</span>
                    </div>
                  ))}

                  {/* Limits that are NOT available */}
                  {!plan.limits.canSellAgents && (
                    <div className="flex items-start gap-2 opacity-40">
                      <X className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground leading-relaxed line-through">Agent sotish huquqi</span>
                    </div>
                  )}
                  {!plan.limits.canUseAnalytics && (
                    <div className="flex items-start gap-2 opacity-40">
                      <X className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground leading-relaxed line-through">Batafsil statistika</span>
                    </div>
                  )}
                  {!plan.limits.customBranding && (
                    <div className="flex items-start gap-2 opacity-40">
                      <X className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground leading-relaxed line-through">Custom branding</span>
                    </div>
                  )}
                </div>

                {/* Limits summary */}
                <div className="p-3 rounded-lg bg-muted/20 border border-border mb-4 space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Agentlar</span>
                    <span className="text-foreground font-semibold">
                      {plan.limits.maxAgents === Infinity ? "Cheksiz" : `${plan.limits.maxAgents} ta`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Toollar/agent</span>
                    <span className="text-foreground font-semibold">{plan.limits.maxToolsPerAgent} ta</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">API so'rovlar/oy</span>
                    <span className="text-foreground font-semibold">{plan.limits.apiRequestsPerMonth.toLocaleString()}</span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isActive}
                  className={`w-full h-10 rounded-xl text-sm font-semibold ${
                    isActive
                      ? "bg-muted text-muted-foreground cursor-default border border-border"
                      : isPopular
                      ? "gradient-btn border-0"
                      : "bg-card border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {isActive ? "Hozirgi reja" : plan.price === 0 ? "Bepul boshlash" : `${plan.name}ga o'tish`}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="mt-8 max-w-4xl">
          <h2 className="font-display font-semibold text-sm text-foreground mb-4">Batafsil taqqoslash</h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Xususiyat</th>
                  {PLANS.map((p) => (
                    <th key={p.id} className={`text-center px-4 py-3 font-semibold ${p.id === currentPlan ? "text-primary" : "text-foreground"}`}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Agent yaratish", values: ["2 ta", "10 ta", "Cheksiz"] },
                  { label: "Toollar/agent", values: ["2 ta", "5 ta", "7 ta"] },
                  { label: "API so'rovlar/oy", values: ["500", "5,000", "25,000"] },
                  { label: "Shablonlar", values: [true, true, true] },
                  { label: "Marketplace sotib olish", values: [true, true, true] },
                  { label: "Agent sotish", values: [false, false, true] },
                  { label: "Statistika", values: [false, true, true] },
                  { label: "Ustuvor support", values: [false, true, true] },
                  { label: "Custom branding", values: [false, false, true] },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-muted-foreground">{row.label}</td>
                    {row.values.map((val, i) => (
                      <td key={i} className="text-center px-4 py-2.5">
                        {typeof val === "boolean" ? (
                          val ? (
                            <Check className="w-4 h-4 text-secondary mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                          )
                        ) : (
                          <span className="text-foreground font-medium">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
