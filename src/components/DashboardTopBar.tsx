import { motion } from "framer-motion";
import { Bell, Search, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSyncExternalStore } from "react";
import { i18nStore } from "@/lib/i18nStore";

const sectionLabels: Record<string, string> = {
  create: "Agent yaratish",
  "my-agents": "Agentlarim",
  sell: "Sotish",
  apps: "Ilovalar",
  templates: "Shablonlar",
  marketplace: "Marketplace",
  analytics: "Statistika",
  subscriptions: "Obuna",
  settings: "Sozlamalar",
};

interface DashboardTopBarProps {
  activeSection: string;
}

const DashboardTopBar = ({ activeSection }: DashboardTopBarProps) => {
  const { user } = useAuth();
  useSyncExternalStore(i18nStore.subscribe, i18nStore.getSnapshot);

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="h-12 px-6 flex items-center justify-between dashboard-topbar shrink-0"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-muted-foreground font-medium">Dashboard</span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
        <span className="text-foreground font-semibold">
          {sectionLabels[activeSection] || activeSection}
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
        </button>
        <div className="w-7 h-7 rounded-full gradient-btn flex items-center justify-center text-[10px] font-bold text-primary-foreground ml-1">
          {userInitial}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardTopBar;
