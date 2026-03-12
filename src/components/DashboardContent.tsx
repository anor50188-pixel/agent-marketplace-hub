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
      </div>
    </div>
  );
};

export default DashboardContent;
