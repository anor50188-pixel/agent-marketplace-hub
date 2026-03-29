import { useState, useEffect } from "react";
import { Users, Bot, DollarSign, TrendingUp, Activity, ShoppingCart, Loader2, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";
import { supabase } from "@/integrations/supabase/client";

const AdminStats = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalModerators, setTotalModerators] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        const { data: roles } = await supabase
          .from("user_roles")
          .select("role");

        const admins = roles?.filter((r) => r.role === "admin").length || 0;
        const mods = roles?.filter((r) => r.role === "moderator").length || 0;

        setTotalUsers(usersCount || 0);
        setTotalAdmins(admins);
        setTotalModerators(mods);
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: "Jami foydalanuvchilar", value: totalUsers.toString(), icon: Users, color: "text-primary" },
    { label: "Adminlar", value: totalAdmins.toString(), icon: Shield, color: "text-destructive" },
    { label: "Moderatorlar", value: totalModerators.toString(), icon: Bot, color: "text-secondary" },
    { label: "Oddiy foydalanuvchilar", value: Math.max(0, totalUsers - totalAdmins - totalModerators).toString(), icon: Users, color: "text-accent" },
  ];

  // Mock chart data (replace with real analytics later)
  const chartData = [
    { name: "Yan", users: 10 },
    { name: "Fev", users: 15 },
    { name: "Mar", users: 22 },
    { name: "Apr", users: 30 },
    { name: "May", users: 38 },
    { name: "Iyn", users: 45 },
    { name: "Iyl", users: totalUsers || 50 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold text-foreground">Platformaga umumiy nazar</h2>
        <p className="text-sm text-muted-foreground mt-1">Real vaqtdagi ma'lumotlar</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-5 rounded-2xl bg-card border border-border/50">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Foydalanuvchilar o'sishi
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(250 85% 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(250 85% 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 88% / 0.3)" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(220 10% 45%)" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(220 10% 45%)" />
            <Area type="monotone" dataKey="users" stroke="hsl(250 85% 60%)" fill="url(#userGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminStats;
