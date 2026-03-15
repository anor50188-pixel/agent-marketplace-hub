import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Bot, ShoppingBag, LayoutGrid, Plus, X, Settings, FileText, BarChart3, ChevronDown, Store, Crown } from "lucide-react";
import { subscriptionStore, PLANS } from "@/lib/subscriptionStore";
import { i18nStore } from "@/lib/i18nStore";

const menuGroups = [
  {
    labelKey: "",
    items: [
      { id: "create", labelKey: "sidebar.create", icon: Plus },
      { id: "my-agents", labelKey: "sidebar.myAgents", icon: Bot },
      { id: "sell", labelKey: "sidebar.sell", icon: Store },
    ],
  },
  {
    labelKey: "sidebar.tools",
    items: [
      { id: "apps", labelKey: "sidebar.apps", icon: LayoutGrid },
      { id: "templates", labelKey: "sidebar.templates", icon: FileText },
    ],
  },
  {
    labelKey: "sidebar.others",
    items: [
      { id: "marketplace", labelKey: "sidebar.marketplace", icon: ShoppingBag },
      { id: "analytics", labelKey: "sidebar.analytics", icon: BarChart3 },
      { id: "subscriptions", labelKey: "sidebar.subscriptions", icon: Crown },
      { id: "settings", labelKey: "sidebar.settings", icon: Settings },
    ],
  },
];

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
  onClose: () => void;
}

const DashboardSidebar = ({ activeSection, onSectionChange, onClose }: DashboardSidebarProps) => {
  const currentPlan = useSyncExternalStore(subscriptionStore.subscribe, subscriptionStore.getPlan);
  const t = useSyncExternalStore(i18nStore.subscribe, () => i18nStore.t.bind(i18nStore));
  const planConfig = PLANS.find((p) => p.id === currentPlan)!;

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
          <div className="w-7 h-7 rounded-lg gradient-btn flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-display font-semibold text-sm text-sidebar-foreground">Agentus</span>
            <ChevronDown className="w-3.5 h-3.5 text-sidebar-foreground/40" />
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
      <nav className="flex-1 px-2 py-3 space-y-4 overflow-auto">
        {menuGroups.map((group, gi) => (
          <div key={group.label || gi}>
            {group.label && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold text-sidebar-foreground/30 uppercase tracking-widest">
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
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    activeSection === item.id
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent border border-transparent"
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
        <button
          onClick={() => onSectionChange("subscriptions")}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          <div className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center text-[11px] font-bold text-primary-foreground">
            U
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[12px] font-medium text-sidebar-foreground truncate">User</p>
            <p className={`text-[11px] truncate font-medium ${
              currentPlan === "free" ? "text-sidebar-foreground/35" :
              currentPlan === "pro" ? "text-primary" : "text-secondary"
            }`}>
              {planConfig.name} plan
            </p>
          </div>
          {currentPlan !== "free" && (
            <Crown className={`w-3.5 h-3.5 ${currentPlan === "pro" ? "text-primary" : "text-secondary"}`} />
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default DashboardSidebar;
