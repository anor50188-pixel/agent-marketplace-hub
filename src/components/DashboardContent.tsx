import AgentWorkspace from "./workspace/AgentWorkspace";

interface DashboardContentProps {
  activeSection: string;
}

const DashboardContent = ({ activeSection }: DashboardContentProps) => {
  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      {activeSection === "create" && <AgentWorkspace />}
    </div>
  );
};

export default DashboardContent;
