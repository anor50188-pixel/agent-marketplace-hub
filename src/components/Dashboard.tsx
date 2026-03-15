import { motion } from "framer-motion";
import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardContent from "./DashboardContent";
import AgentusChat from "./AgentusChat";

interface DashboardProps {
  onClose: () => void;
}

const Dashboard = ({ onClose }: DashboardProps) => {
  const [activeSection, setActiveSection] = useState("create");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-background backdrop-blur-xl flex"
    >
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onClose={onClose}
      />
      <DashboardContent activeSection={activeSection} onSectionChange={setActiveSection} />
      <AgentusChat />
    </motion.div>
  );
};

export default Dashboard;
