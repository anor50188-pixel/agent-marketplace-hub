import { motion } from "framer-motion";
import { MessageSquare, Wrench, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Tasvirlang",
    description: "Agent nima qilishi kerakligini oddiy so'zlar bilan yozing",
    gradient: "from-primary to-accent",
  },
  {
    icon: Wrench,
    title: "Sozlang",
    description: "AI agentingizga kerakli vositalar va bilimlarni qo'shing",
    gradient: "from-secondary to-primary",
  },
  {
    icon: Rocket,
    title: "Ishga tushiring",
    description: "Agentingizni ishlating yoki marketplace'da soting",
    gradient: "from-accent to-secondary",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-5">
            Qanday <span className="gradient-text">ishlaydi?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            3 oddiy qadamda o'z AI agentingizni yarating
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-px bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative text-center group"
            >
              <div className={`mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="absolute top-0 -right-1 md:right-auto md:left-[calc(50%+30px)] w-7 h-7 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{i + 1}</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-base text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
