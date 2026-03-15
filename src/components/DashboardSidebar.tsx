import { motion } from "framer-motion";
import { Bot, Users, ShoppingBag, LayoutGrid, Plus, X, Settings, MessageSquare, Zap, FileText, BarChart3, Globe } from "lucide-react";

const menuGroups = [
{
  label: "Asosiy",
  items: [
  { id: "create", label: "Agent yaratish", icon: Plus },
  { id: "my-agents", label: "Agentlarim", icon: Bot },
  { id: "marketplace", label: "Sotuvdagi agentlar", icon: ShoppingBag }]

},
{
  label: "Vositalar",
  items: [
  { id: "apps", label: "Ilovalar", icon: LayoutGrid },
  { id: "templates", label: "Shablonlar", icon: FileText },
  { id: "integrations", label: "Integratsiyalar", icon: Zap }]

},
{
  label: "Tahlil",
  items: [
  { id: "analytics", label: "Statistika", icon: BarChart3 },
  { id: "conversations", label: "Suhbatlar", icon: MessageSquare }]

},
{
  label: "Sozlamalar",
  items: [
  { id: "settings", label: "Sozlamalar", icon: Settings },
  { id: "domains", label: "Domenlar", icon: Globe }]

}];


interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
  onClose: () => void;
}

const DashboardSidebar = ({ activeSection, onSectionChange, onClose }: DashboardSidebarProps) => {
  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-64 shrink-0 glass border-r border-border/50 flex flex-col">
      
      <div className="p-4 flex items-center justify-between border-b border-muted bg-muted">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-semibold text-foreground">Agentus</span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
          
          <X className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-4 overflow-auto border-primary-foreground text-primary-foreground">
        {menuGroups.map((group, gi) =>
        <div key={group.label}>
            <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + gi * 0.1 }}
            className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            
              {group.label}
            </motion.p>
            <div className="space-y-0.5">
              {group.items.map((item, i) =>
            <motion.button
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.35 + gi * 0.1 + i * 0.05 }}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              activeSection === item.id ?
              "bg-primary/15 text-primary" :
              "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`
              }>
              
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </motion.button>
            )}
            </div>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-border/30">
        <div className="glass rounded-xl p-3">
          <p className="text-xs text-muted-foreground">
            AI agentlar bilan ishlang va o'z biznesingizni avtomatlashtiring.
          </p>
        </div>
      </div>
    </motion.aside>);

};

export default DashboardSidebar;