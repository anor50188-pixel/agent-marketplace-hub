import { Menu, LogOut, X } from "lucide-react";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import agentusLogo from "@/assets/agentus-logo-white.png";

const navLinks = [
  { href: "#marketplace", label: "Marketplace" },
  { href: "#testimonials", label: "Sharhlar" },
  { href: "#pricing", label: "Narxlar" },
];

const NavDashboardButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/dashboard")}
      className="gradient-btn px-4 py-2 rounded-xl text-sm font-semibold shadow-md"
    >
      Dashboard
    </button>
  );
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const scrollTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenuOpen(false);
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center">
          <img src={agentusLogo} alt="Agentus" className="h-8 w-auto" />
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              <NavDashboardButton />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-border/50">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center text-[10px] font-bold text-primary">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-muted-foreground">{user.email?.split("@")[0]}</span>
              </div>
              <button onClick={signOut} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted/50">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/auth")} className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md">
              Kirish
            </button>
          )}
        </div>

        <button className="md:hidden text-foreground p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/30 bg-card/95 backdrop-blur-xl"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className="text-sm font-medium text-muted-foreground py-1"
                >
                  {link.label}
                </a>
              ))}
              {user ? (
                <button onClick={signOut} className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-semibold w-full">
                  Chiqish
                </button>
              ) : (
                <button onClick={() => navigate("/auth")} className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-semibold w-full">
                  Kirish
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
