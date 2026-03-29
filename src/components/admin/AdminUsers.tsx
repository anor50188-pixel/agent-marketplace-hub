import { useState, useEffect } from "react";
import { Search, MoreVertical, Shield, Ban, UserCheck, Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  role?: string;
}

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
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Merge roles into profiles
      const rolesMap = new Map<string, string>();
      roles?.forEach((r) => rolesMap.set(r.user_id, r.role));

      const merged = (profiles || []).map((p) => ({
        ...p,
        role: rolesMap.get(p.user_id) || "user",
      }));

      setUsers(merged);
    } catch (err: any) {
      toast.error("Foydalanuvchilarni yuklashda xatolik: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    setSaving(true);
    try {
      if (newRole === "user") {
        // Remove role entry (default is "user")
        await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", selectedUser.user_id);
      } else {
        // Upsert role
        const { data: existing } = await supabase
          .from("user_roles")
          .select("id")
          .eq("user_id", selectedUser.user_id)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from("user_roles")
            .update({ role: newRole as any })
            .eq("user_id", selectedUser.user_id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("user_roles")
            .insert({ user_id: selectedUser.user_id, role: newRole as any });
          if (error) throw error;
        }
      }

      toast.success(`Rol o'zgartirildi: ${newRole}`);
      setRoleDialogOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error("Rolni o'zgartirishda xatolik: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = users.filter(
    (u) =>
      (u.display_name || "").toLowerCase().includes(search.toLowerCase()) ||
      u.user_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">Foydalanuvchilar</h2>
          <p className="text-sm text-muted-foreground mt-1">{users.length} ta foydalanuvchi</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Yangilash
          </Button>
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
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
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
                <TableHead>Qo'shilgan</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                    Foydalanuvchilar topilmadi
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {(user.display_name || "U").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">{user.display_name || "Nomsiz"}</p>
                          <p className="text-xs text-muted-foreground font-mono">{user.user_id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleBadge(user.role || "user")}>
                        {user.role || "user"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString("uz-UZ")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Amallar</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user);
                            setNewRole(user.role || "user");
                            setRoleDialogOpen(true);
                          }}>
                            <Shield className="w-4 h-4 mr-2" /> Rolni o'zgartirish
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
      )}

      {/* Role change dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rolni o'zgartirish</DialogTitle>
            <DialogDescription>
              {selectedUser?.display_name || "Foydalanuvchi"} uchun yangi rol tanlang
            </DialogDescription>
          </DialogHeader>
          <Select value={newRole} onValueChange={setNewRole}>
            <SelectTrigger>
              <SelectValue placeholder="Rol tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleRoleChange} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
