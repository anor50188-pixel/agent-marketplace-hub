import { motion } from "framer-motion";
import { Bot, Users, ShoppingBag, LayoutGrid, Plus, X } from "lucide-react";

const menuItems = [
  { id: "create", label: "Agent yaratish", icon: Plus },
  { id: "my-agents", label: "Agentlarim", icon: Bot },
  { id: "marketplace", label: "Sotuvdagi agentlar", icon: ShoppingBag },
  { id: "apps", label: "Ilovalar", icon: LayoutGrid },
];

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
  onClose: () => void;
}

const DashboardSidebar = ({ activeSection, onSectionChange, onClose }: DashboardSidebarProps) => {
  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-64 shrink-0 glass border-r border-border/50 flex flex-col"
    >
      <div className="p-4 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center shadow-[0_0_15px_hsl(185_80%_55%/0.3)]">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-semibold text-foreground">Agentus</span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeSection === item.id
                ? "bg-primary/15 text-primary neon-border-active"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </motion.button>
        ))}
      </nav>

      <div className="p-3 border-t border-border/30">
        <div className="glass-neon rounded-xl p-3">
          <p className="text-xs text-muted-foreground">
            AI agentlar bilan ishlang va o'z biznesingizni avtomatlashtiring.
          </p>
        </div>
      </div>
    </motion.aside>
  );
};

export default DashboardSidebar;
