import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminStats from "@/components/admin/AdminStats";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminAgents from "@/components/admin/AdminAgents";
import AdminContent from "@/components/admin/AdminContent";
import { Loader2 } from "lucide-react";

const AdminPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin();

  const activeSection = searchParams.get("section") || "stats";

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
    if (!authLoading && !roleLoading && user && !isAdmin) {
      navigate("/dashboard");
    }
  }, [authLoading, roleLoading, user, isAdmin, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const renderContent = () => {
    switch (activeSection) {
      case "stats": return <AdminStats />;
      case "users": return <AdminUsers />;
      case "agents": return <AdminAgents />;
      case "content": return <AdminContent />;
      default: return <AdminStats />;
    }
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={(id) => setSearchParams({ section: id })}
      />
      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPage;
