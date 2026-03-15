import ChatWorkspace from "./ChatWorkspace";
import AppsSection from "./AppsSection";
import AgentCreatorChat from "./AgentCreatorChat";
import MyAgents from "./MyAgents";
import IntegrationsSection from "./IntegrationsSection";
import AgentTemplates from "./AgentTemplates";
import Marketplace from "./Marketplace";
import SellAgents from "./SellAgents";
import Statistics from "./Statistics";

interface DashboardContentProps {
  activeSection: string;
}

const DashboardContent = ({ activeSection }: DashboardContentProps) => {
  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      {activeSection === "create" && <AgentCreatorChat />}
      {activeSection === "my-agents" && <MyAgents />}
      {activeSection === "apps" && <AppsSection />}
      {activeSection === "templates" && <AgentTemplates />}
      {activeSection === "integrations" && <IntegrationsSection />}
      {activeSection === "marketplace" && <Marketplace />}
      {activeSection === "sell" && <SellAgents />}
      {activeSection === "analytics" && <Statistics />}
      {!["create", "my-agents", "apps", "templates", "integrations", "marketplace", "sell", "analytics"].includes(activeSection) && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} — tez orada...
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
