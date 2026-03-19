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
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card/50 text-muted-foreground mb-4">
            <Crown className="w-3.5 h-3.5 text-secondary" />
            Narxlar
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Sizga mos <span className="gradient-text">reja</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Kichik loyihalardan enterprise darajagacha — barcha ehtiyojlaringiz uchun
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full border border-border bg-card/50 backdrop-blur-sm">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                !yearly ? "gradient-btn shadow-md" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Oylik
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                yearly ? "gradient-btn shadow-md" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yillik
              <span className="ml-1.5 text-[10px] font-bold text-secondary">-20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                className={`relative rounded-2xl border p-6 transition-all duration-300 ${
                  isPopular
                    ? "border-primary/40 bg-card/80 shadow-[0_0_60px_hsl(250_85%_65%_/_0.12)] scale-[1.02]"
                    : "border-border bg-card/40 hover:border-border/80"
                }`}
              >
                {plan.badge && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r ${plan.color} text-primary-foreground shadow-lg`}>
                    {plan.badge}
                  </span>
                )}

                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-5 shadow-md`}>
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>

                <h3 className="font-display text-lg font-bold text-foreground mb-1">{plan.name}</h3>

                <div className="flex items-baseline gap-1 mb-5">
                  {price === 0 ? (
                    <span className="text-4xl font-bold text-foreground">Bepul</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-foreground">${price}</span>
                      <span className="text-sm text-muted-foreground">/oy</span>
                    </>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                      <div className="w-4 h-4 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-secondary" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={onOpenDashboard}
                  className={`w-full h-11 rounded-xl text-sm font-semibold ${
                    isPopular ? "gradient-btn border-0 shadow-[0_4px_20px_hsl(250_85%_65%_/_0.3)]" : "border-border"
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
