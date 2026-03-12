import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AgentCreateCard from "./AgentCreateCard";
import AgentBuilder from "./AgentBuilder";

interface DashboardContentProps {
  activeSection: string;
}

const DashboardContent = ({ activeSection }: DashboardContentProps) => {
  const [builderMode, setBuilderMode] = useState<"landing" | "scratch" | "templates">("landing");

  // Reset to landing when section changes
  const [prevSection, setPrevSection] = useState(activeSection);
  if (activeSection !== prevSection) {
    setPrevSection(activeSection);
    if (activeSection === "create") {
      setBuilderMode("landing");
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      <AnimatePresence mode="wait">
        {activeSection === "create" && builderMode === "landing" && (
          <AgentCreateCard
            key="landing"
            onCreateFromScratch={() => setBuilderMode("scratch")}
            onCreateFromTemplate={() => setBuilderMode("templates")}
          />
        )}
        {activeSection === "create" && builderMode === "scratch" && (
          <AgentBuilder key="builder" />
        )}
      </AnimatePresence>

      {activeSection !== "create" && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Bu bo'lim tez orada qo'shiladi</p>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
