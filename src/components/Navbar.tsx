import { Bot, Menu, LogOut } from "lucide-react";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#marketplace", label: "Marketplace" },
  { href: "#testimonials", label: "Sharhlar" },
  { href: "#pricing", label: "Narxlar" },
];

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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Agentus
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{user.email?.split("@")[0]}</span>
              <button onClick={signOut} className="text-muted-foreground hover:text-foreground transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/auth")} className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-semibold">
              Kirish
            </button>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className="text-sm font-medium text-muted-foreground"
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
