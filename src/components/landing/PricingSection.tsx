import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { PLANS } from "@/lib/subscriptionStore";
import { Button } from "../ui/button";

interface PricingSectionProps {
  onOpenDashboard?: () => void;
}

const PricingSection = ({ onOpenDashboard }: PricingSectionProps) => {
  const [yearly, setYearly] = useState(false);

  const planIcons = [Zap, Sparkles, Crown];

  return (
    <section id="pricing" className="relative py-24 overflow-hidden scroll-mt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-secondary/4 blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card/50 text-muted-foreground mb-4">
            <Crown className="w-3.5 h-3.5 text-secondary" />
            Narxlar
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Sizga mos <span className="gradient-text">reja</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Kichik loyihalardan enterprise darajagacha — barcha ehtiyojlaringiz uchun
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-full border border-border bg-card/50">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                !yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Oylik
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yillik
              <span className="ml-1.5 text-[10px] font-bold text-secondary">-20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan, i) => {
            const Icon = planIcons[i];
            const isPopular = plan.id === "pro";
            const price = yearly ? Math.round(plan.price * 0.8) : plan.price;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className={`relative rounded-xl border p-6 transition-all ${
                  isPopular
                    ? "border-primary/40 bg-card/80 shadow-[0_0_40px_hsl(250_85%_65%_/_0.1)]"
                    : "border-border bg-card/40"
                }`}
              >
                {plan.badge && (
                  <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${plan.color} text-primary-foreground`}>
                    {plan.badge}
                  </span>
                )}

                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>

                <h3 className="font-display text-lg font-bold text-foreground mb-1">{plan.name}</h3>

                <div className="flex items-baseline gap-1 mb-4">
                  {price === 0 ? (
                    <span className="text-3xl font-bold text-foreground">Bepul</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-foreground">${price}</span>
                      <span className="text-sm text-muted-foreground">/{yearly ? "oy" : "oy"}</span>
                    </>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={onOpenDashboard}
                  className={`w-full h-10 rounded-xl text-sm font-medium ${
                    isPopular ? "gradient-btn border-0" : "border-border"
                  }`}
                  variant={isPopular ? "default" : "outline"}
                >
                  {price === 0 ? "Boshlash" : "Tanlash"}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
