import { Users, Bot, DollarSign, TrendingUp, Activity, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";

const stats = [
  { label: "Jami foydalanuvchilar", value: "2,847", change: "+12%", icon: Users, color: "text-primary" },
  { label: "Faol agentlar", value: "156", change: "+8%", icon: Bot, color: "text-secondary" },
  { label: "Oylik daromad", value: "$12,450", change: "+23%", icon: DollarSign, color: "text-accent" },
  { label: "Bugungi tranzaksiyalar", value: "89", change: "+5%", icon: ShoppingCart, color: "text-primary" },
];

const chartData = [
  { name: "Yan", users: 400, revenue: 2400 },
  { name: "Fev", users: 600, revenue: 3200 },
  { name: "Mar", users: 800, revenue: 4100 },
  { name: "Apr", users: 1200, revenue: 5800 },
  { name: "May", users: 1800, revenue: 7200 },
  { name: "Iyn", users: 2400, revenue: 9600 },
  { name: "Iyl", users: 2847, revenue: 12450 },
];

const AdminStats = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold text-foreground">Platformaga umumiy nazar</h2>
        <p className="text-sm text-muted-foreground mt-1">Mock ma'lumotlar — keyinchalik API'dan keladi</p>
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
              <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <div className="p-5 rounded-2xl bg-card border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-accent" />
            Oylik daromad ($)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 88% / 0.3)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(220 10% 45%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(220 10% 45%)" />
              <Bar dataKey="revenue" fill="hsl(280 70% 55%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
