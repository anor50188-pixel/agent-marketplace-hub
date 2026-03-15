import ChatWorkspace from "./ChatWorkspace";

interface DashboardContentProps {
  activeSection: string;
}

const DashboardContent = ({ activeSection }: DashboardContentProps) => {
  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      {activeSection === "create" && <ChatWorkspace />}
    </div>
  );
};

export default DashboardContent;
