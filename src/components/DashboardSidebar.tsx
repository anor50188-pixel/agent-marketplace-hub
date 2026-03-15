import { motion } from "framer-motion";
import { Bot, Users, ShoppingBag, LayoutGrid, Plus, X, Settings, MessageSquare, Zap, FileText, BarChart3, Globe, ChevronDown } from "lucide-react";

const menuGroups = [
  {
    label: "",
    items: [
      { id: "create", label: "Agent yaratish", icon: Plus },
      { id: "my-agents", label: "Agentlarim", icon: Bot },
    ],
  },
  {
    label: "Vositalar",
    items: [
      { id: "apps", label: "Ilovalar", icon: LayoutGrid },
      { id: "templates", label: "Shablonlar", icon: FileText },
      { id: "integrations", label: "Integratsiyalar", icon: Zap },
    ],
  },
  {
    label: "Boshqalar",
    items: [
      { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
      { id: "analytics", label: "Statistika", icon: BarChart3 },
      { id: "conversations", label: "Suhbatlar", icon: MessageSquare },
      { id: "settings", label: "Sozlamalar", icon: Settings },
    ],
  },
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
      className="w-[260px] shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border"
    >
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-display font-semibold text-sm text-sidebar-foreground">Agentus</span>
            <ChevronDown className="w-3.5 h-3.5 text-sidebar-foreground/50" />
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-md flex items-center justify-center text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-4 overflow-auto">
        {menuGroups.map((group, gi) => (
          <div key={group.label || gi}>
            {group.label && (
              <p className="px-3 mb-1 text-[11px] font-medium text-sidebar-foreground/40 uppercase tracking-wider">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ x: -15, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.25 + gi * 0.08 + i * 0.04 }}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    activeSection === item.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="w-7 h-7 rounded-full bg-sidebar-accent flex items-center justify-center text-[11px] font-semibold text-sidebar-foreground">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-sidebar-foreground truncate">User</p>
            <p className="text-[11px] text-sidebar-foreground/40 truncate">Free plan</p>
          </div>
          <Settings className="w-3.5 h-3.5 text-sidebar-foreground/30" />
        </div>
      </div>
    </motion.aside>
  );
};

export default DashboardSidebar;
