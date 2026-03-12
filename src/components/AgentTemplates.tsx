import { motion } from "framer-motion";
import { MessageSquare, FileText, Code, Headphones, ShoppingCart, GraduationCap, Bot, TrendingUp } from "lucide-react";

const templates = [
  {
    icon: MessageSquare,
    title: "Chat Bot",
    description: "Mijozlar bilan muloqot qiluvchi bot",
    color: "from-primary to-secondary",
  },
  {
    icon: FileText,
    title: "Kontent Yozuvchi",
    description: "Blog, post va maqola yozuvchi agent",
    color: "from-secondary to-[hsl(330,70%,60%)]",
  },
  {
    icon: Code,
    title: "Kod Yordamchisi",
    description: "Dasturlashda yordam beruvchi agent",
    color: "from-accent to-primary",
  },
  {
    icon: Headphones,
    title: "Qo'llab-quvvatlash",
    description: "24/7 mijoz xizmati agenti",
    color: "from-[hsl(330,70%,60%)] to-primary",
  },
  {
    icon: ShoppingCart,
    title: "Savdo Agenti",
    description: "Sotuvni avtomatlashtiradigan bot",
    color: "from-primary to-accent",
  },
  {
    icon: GraduationCap,
    title: "O'qituvchi Agent",
    description: "Ta'lim va trening beruvchi bot",
    color: "from-accent to-secondary",
  },
  {
    icon: Bot,
    title: "Shaxsiy Assistent",
    description: "Kundalik ishlarni boshqaruvchi",
    color: "from-secondary to-accent",
  },
  {
    icon: TrendingUp,
    title: "Analitik Agent",
    description: "Ma'lumotlarni tahlil qiluvchi",
    color: "from-primary to-[hsl(330,70%,60%)]",
  },
];

const AgentTemplates = () => {
  return (
    <section id="templates" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI Agent <span className="gradient-text">Shablonlari</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tayyor shablonlardan boshlang yoki noldan o'zingizning agentingizni yarating
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {templates.map((template, index) => (
            <motion.div
              key={template.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass glass-hover rounded-2xl p-6 cursor-pointer group transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <template.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1.5">
                {template.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {template.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentTemplates;
