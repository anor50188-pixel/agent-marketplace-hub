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
      className="fixed inset-0 z-50 flex"
      style={{ background: "linear-gradient(135deg, hsl(263 84% 5% / 0.95), hsl(270 50% 12% / 0.95), hsl(265 60% 8% / 0.95))", backdropFilter: "blur(20px)" }}
    >
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onClose={onClose}
      />
      <DashboardContent activeSection={activeSection} />
      <AgentusChat />
    </motion.div>
  );
};

export default Dashboard;
