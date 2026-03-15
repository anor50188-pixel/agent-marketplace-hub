import ChatWorkspace from "./ChatWorkspace";
import AppsSection from "./AppsSection";

interface DashboardContentProps {
  activeSection: string;
}

const DashboardContent = ({ activeSection }: DashboardContentProps) => {
  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      {activeSection === "create" && <ChatWorkspace />}
      {activeSection === "apps" && <AppsSection />}
    </div>
  );
};

export default DashboardContent;
