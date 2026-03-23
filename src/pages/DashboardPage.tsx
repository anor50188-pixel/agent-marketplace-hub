import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardContent from "@/components/DashboardContent";
import DashboardTopBar from "@/components/DashboardTopBar";
import AgentusChat from "@/components/AgentusChat";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const DashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const activeSection = searchParams.get("section") || "create";

  const handleSectionChange = (id: string) => {
    setSearchParams({ section: id });
    if (isMobile) setSidebarOpen(false);
  };

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={isMobile ? { x: -280 } : { opacity: 0 }}
            animate={isMobile ? { x: 0 } : { opacity: 1 }}
            exit={isMobile ? { x: -280 } : { opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={isMobile ? "fixed inset-y-0 left-0 z-50" : "relative z-10"}
          >
            <DashboardSidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              onClose={() => isMobile ? setSidebarOpen(false) : navigate("/")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <DashboardTopBar
          activeSection={activeSection}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          showMenuButton={isMobile || !sidebarOpen}
        />
        <DashboardContent activeSection={activeSection} onSectionChange={handleSectionChange} />
      </div>

      <AgentusChat />
    </div>
  );
};

export default DashboardPage;
