import agentusLogo from "@/assets/agentus-logo-white.png";

const footerLinks = [
  { label: "Marketplace", href: "#marketplace" },
  { label: "Narxlar", href: "#pricing" },
  { label: "Sharhlar", href: "#testimonials" },
];

const LandingFooter = () => {
  return (
    <footer className="border-t border-border/30 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <img src={agentusLogo} alt="Agentus" className="h-7 w-auto" />

          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <p className="text-xs text-muted-foreground/60">
            © 2025 Agentus. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
