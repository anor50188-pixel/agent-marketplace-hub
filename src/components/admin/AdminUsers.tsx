import { useState } from "react";
import { Search, MoreVertical, Shield, Ban, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const mockUsers = [
  { id: "1", email: "admin@agentus.uz", name: "Admin User", role: "admin", status: "active", agents: 5, joined: "2024-01-15" },
  { id: "2", email: "ali@example.com", name: "Ali Valiyev", role: "user", status: "active", agents: 3, joined: "2024-03-20" },
  { id: "3", email: "dilnoza@example.com", name: "Dilnoza K.", role: "user", status: "active", agents: 1, joined: "2024-05-10" },
  { id: "4", email: "jasur@example.com", name: "Jasur T.", role: "moderator", status: "active", agents: 8, joined: "2024-02-01" },
  { id: "5", email: "blocked@example.com", name: "Spam User", role: "user", status: "blocked", agents: 0, joined: "2024-06-15" },
];

const roleBadge = (role: string) => {
  const variants: Record<string, string> = {
    admin: "bg-destructive/10 text-destructive border-destructive/20",
    moderator: "bg-primary/10 text-primary border-primary/20",
    user: "bg-muted text-muted-foreground border-border",
  };
  return variants[role] || variants.user;
};

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const filtered = mockUsers.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">Foydalanuvchilar</h2>
          <p className="text-sm text-muted-foreground mt-1">{mockUsers.length} ta foydalanuvchi</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/30 border-border/50"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border/50 bg-card overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Foydalanuvchi</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Holat</TableHead>
              <TableHead>Agentlar</TableHead>
              <TableHead>Qo'shilgan</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleBadge(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.status === "active" ? "text-emerald-500" : "text-destructive"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-destructive"}`} />
                    {user.status === "active" ? "Faol" : "Bloklangan"}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.agents}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.joined}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Shield className="w-4 h-4 mr-2" /> Rolni o'zgartirish</DropdownMenuItem>
                      <DropdownMenuItem><UserCheck className="w-4 h-4 mr-2" /> Profilni ko'rish</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"><Ban className="w-4 h-4 mr-2" /> Bloklash</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default AdminUsers;
