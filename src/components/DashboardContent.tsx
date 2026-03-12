import { motion, AnimatePresence } from "framer-motion";
import { Plus, Bot, ShoppingBag, LayoutGrid } from "lucide-react";

const sectionData: Record<string, { title: string; description: string; icon: React.ElementType }> = {
  create: {
    title: "Yangi Agent Yaratish",
    description: "AI agentingizni noldan yarating yoki tayyor shablonlardan foydalaning.",
    icon: Plus,
  },
  "my-agents": {
    title: "Agentlarim",
    description: "Yaratgan agentlaringizni boshqaring va kuzating.",
    icon: Bot,
  },
  marketplace: {
    title: "Sotuvdagi Agentlar",
    description: "Boshqalar yaratgan agentlarni ko'ring va sotib oling.",
    icon: ShoppingBag,
  },
  apps: {
    title: "Ilovalar",
    description: "Agentlaringiz bilan integratsiya qilinadigan ilovalar.",
    icon: LayoutGrid,
  },
};

interface DashboardContentProps {
  activeSection: string;
}

const DashboardContent = ({ activeSection }: DashboardContentProps) => {
  const section = sectionData[activeSection] || sectionData.create;
  const Icon = section.icon;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="p-4 border-b border-border/30">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="font-display text-xl font-semibold text-foreground">{section.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="h-full flex items-center justify-center"
          >
            <div className="glass rounded-2xl p-12 text-center max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{section.title}</h3>
              <p className="text-sm text-muted-foreground">{section.description}</p>
              <button className="gradient-btn mt-6 px-6 py-2.5 rounded-xl text-sm font-medium">
                Boshlash
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardContent;
