import { Users, Bot, FileText, BarChart3, Shield, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { id: "stats", label: "Statistika", icon: BarChart3 },
  { id: "users", label: "Foydalanuvchilar", icon: Users },
  { id: "agents", label: "Agentlar", icon: Bot },
  { id: "content", label: "Kontent", icon: FileText },
];

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-full bg-card/80 backdrop-blur-xl border-r border-border/50 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold text-foreground">Admin Panel</h2>
            <p className="text-[10px] text-muted-foreground">Boshqaruv markazi</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item, i) => {
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                />
              )}
              <item.icon className="w-4 h-4" />
              {item.label}
            </motion.button>
          );
        })}
      </nav>

      {/* Back button */}
      <div className="p-3 border-t border-border/30">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard'ga qaytish
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
