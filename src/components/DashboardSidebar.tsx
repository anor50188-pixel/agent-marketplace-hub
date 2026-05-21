import { useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, ShoppingBag, LayoutGrid, Plus, X, Settings, FileText, BarChart3, ChevronDown, Store, Crown, Sparkles, Shield } from "lucide-react";
import agentusLogo from "@/assets/agentus-logo.png";
import { subscriptionStore, PLANS } from "@/lib/subscriptionStore";
import { i18nStore } from "@/lib/i18nStore";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const menuGroups = [
  {
    labelKey: "",
    items: [
      { id: "create", labelKey: "sidebar.create", icon: Plus, isCTA: true },
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
      { id: "marketplace", labelKey: "sidebar.marketplace", icon: ShoppingBag, badge: 3 },
      { id: "analytics", labelKey: "sidebar.analytics", icon: BarChart3, badge: 5 },
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
  useSyncExternalStore(i18nStore.subscribe, i18nStore.getSnapshot);
  const t = i18nStore.t;
  const planConfig = PLANS.find((p) => p.id === currentPlan)!;
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";
  const userEmail = user?.email || "user@example.com";

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-[260px] shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border"
    >
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-sidebar-border">
        <div className="flex items-center gap-1.5">
          <img src={agentusLogo} alt="Agentus" className="h-6 w-auto" />
          <ChevronDown className="w-3.5 h-3.5 text-sidebar-foreground/40" />
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
          <div key={group.labelKey || gi}>
            {group.labelKey && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold text-sidebar-foreground/30 uppercase tracking-widest">
                {t(group.labelKey)}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item, i) => {
                const isActive = activeSection === item.id;
                const isCTA = 'isCTA' in item && item.isCTA;
                const badge = 'badge' in item ? item.badge : undefined;

                if (isCTA) {
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ x: -15, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.25, delay: 0.25 + gi * 0.08 + i * 0.04 }}
                      onClick={() => onSectionChange(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                        isActive
                          ? "gradient-btn shadow-lg"
                          : "gradient-btn opacity-80 hover:opacity-100 hover:shadow-md"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 shrink-0" />
                      {t(item.labelKey)}
                    </motion.button>
                  );
                }

                return (
                  <motion.button
                    key={item.id}
                    initial={{ x: -15, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.25, delay: 0.25 + gi * 0.08 + i * 0.04 }}
                    onClick={() => onSectionChange(item.id)}
                    className={`relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group ${
                      isActive
                        ? "bg-primary/15 text-primary border border-primary/20"
                        : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent border border-transparent"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="sidebar-active-indicator"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <item.icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isActive ? "" : "group-hover:scale-110"
                    }`} />
                    <span className="flex-1 text-left">{t(item.labelKey)}</span>
                    {badge && !isActive && (
                      <span className="notif-badge">{badge}</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Admin link */}
      {isAdmin && (
        <div className="px-3 pb-1">
          <button
            onClick={() => navigate("/admin")}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Shield className="w-4 h-4" />
            Admin Panel
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => onSectionChange("subscriptions")}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors group"
        >
          <div className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center text-[11px] font-bold text-primary-foreground transition-transform group-hover:scale-105">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[12px] font-medium text-sidebar-foreground truncate">
              {userEmail.split("@")[0]}
            </p>
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
