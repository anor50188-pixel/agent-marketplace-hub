import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import {
  User, Bell, Key, Shield, Palette, Save, Check,
  Sun, Moon, Globe, Trash2, Download, Crown, ChevronRight
} from "lucide-react";
import { Button } from "./ui/button";
import { i18nStore, type Lang } from "@/lib/i18nStore";
import { themeStore, type Theme } from "@/lib/themeStore";
import { subscriptionStore, PLANS } from "@/lib/subscriptionStore";
import { apiKeyStore } from "@/lib/apiKeyStore";
import { toast } from "@/hooks/use-toast";

const TABS = [
  { id: "profile", icon: User, labelKey: "settings.profile" },
  { id: "appearance", icon: Palette, labelKey: "settings.appearance" },
  { id: "notifications", icon: Bell, labelKey: "settings.notifications" },
  { id: "api", icon: Key, labelKey: "settings.apiKeys" },
  { id: "account", icon: Shield, labelKey: "settings.account" },
] as const;

type TabId = typeof TABS[number]["id"];

interface SettingsProps {
  onSectionChange?: (id: string) => void;
}

const Settings = ({ onSectionChange }: SettingsProps) => {
  useSyncExternalStore(i18nStore.subscribe, i18nStore.getSnapshot);
  const t = i18nStore.t;
  const lang = i18nStore.getLang();
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.getTheme);
  const plan = useSyncExternalStore(subscriptionStore.subscribe, subscriptionStore.getPlan);
  const connections = useSyncExternalStore(apiKeyStore.subscribe, apiKeyStore.getConnections);
  const planConfig = PLANS.find((p) => p.id === plan)!;

  const [activeTab, setActiveTab] = useState<TabId>("profile");

  // Profile state
  const [name, setName] = useState("Foydalanuvchi");
  const [email, setEmail] = useState("user@example.com");
  const [bio, setBio] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  // Notifications state
  const [emailNotif, setEmailNotif] = useState(true);
  const [agentAlerts, setAgentAlerts] = useState(true);
  const [salesNotif, setSalesNotif] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const handleSaveProfile = () => {
    setProfileSaved(true);
    toast({ title: `✅ ${t("profile.saved")}` });
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const renderToggle = (value: boolean, onChange: (v: boolean) => void) => (
    <button
      onClick={() => onChange(!value)}
      className={`w-10 h-6 rounded-full transition-all relative ${
        value ? "bg-primary" : "bg-muted"
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-primary-foreground transition-all shadow-sm ${
          value ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      <div className="px-6 pt-8 pb-4">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">
          {t("settings.title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="flex gap-6 max-w-4xl">
          {/* Sidebar tabs */}
          <div className="w-48 shrink-0 space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                {t(tab.labelKey)}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Profile */}
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl gradient-btn flex items-center justify-center text-2xl font-bold text-primary-foreground">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{name}</h3>
                      <p className="text-xs text-muted-foreground">{email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1.5 block">{t("profile.name")}</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("profile.namePlaceholder")}
                        className="w-full h-10 rounded-lg border border-border bg-muted/30 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1.5 block">{t("profile.email")}</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("profile.emailPlaceholder")}
                        className="w-full h-10 rounded-lg border border-border bg-muted/30 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1.5 block">{t("profile.bio")}</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder={t("profile.bioPlaceholder")}
                        rows={3}
                        className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                      />
                    </div>
                    <Button onClick={handleSaveProfile} className="h-9 rounded-lg gradient-btn border-0">
                      {profileSaved ? <Check className="w-4 h-4 mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}
                      {profileSaved ? t("profile.saved") : t("profile.save")}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Appearance */}
            {activeTab === "appearance" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Theme */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-display font-semibold text-sm text-card-foreground mb-4 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" />
                    {t("appearance.theme")}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {(["light", "dark"] as Theme[]).map((th) => (
                      <button
                        key={th}
                        onClick={() => themeStore.setTheme(th)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          theme === th
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/20"
                        }`}
                      >
                        {th === "light" ? (
                          <Sun className={`w-6 h-6 ${theme === th ? "text-primary" : "text-muted-foreground"}`} />
                        ) : (
                          <Moon className={`w-6 h-6 ${theme === th ? "text-primary" : "text-muted-foreground"}`} />
                        )}
                        <span className={`text-xs font-medium ${theme === th ? "text-primary" : "text-muted-foreground"}`}>
                          {t(`appearance.${th}`)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-display font-semibold text-sm text-card-foreground mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-secondary" />
                    {t("appearance.language")}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { id: "uz" as Lang, label: "O'zbekcha", flag: "🇺🇿" },
                      { id: "ru" as Lang, label: "Русский", flag: "🇷🇺" },
                    ]).map((l) => (
                      <button
                        key={l.id}
                        onClick={() => i18nStore.setLang(l.id)}
                        className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          lang === l.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/20"
                        }`}
                      >
                        <span className="text-2xl">{l.flag}</span>
                        <span className={`text-sm font-medium ${lang === l.id ? "text-primary" : "text-muted-foreground"}`}>
                          {l.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                  {[
                    { key: "emailNotif", value: emailNotif, set: setEmailNotif },
                    { key: "agentAlerts", value: agentAlerts, set: setAgentAlerts },
                    { key: "salesNotif", value: salesNotif, set: setSalesNotif },
                    { key: "weeklyReport", value: weeklyReport, set: setWeeklyReport },
                  ].map((item, i) => (
                    <div key={item.key} className={`flex items-center justify-between ${i > 0 ? "pt-4 border-t border-border/40" : ""}`}>
                      <div>
                        <p className="text-sm font-medium text-foreground">{t(`notif.${item.key}`)}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t(`notif.${item.key}Desc`)}</p>
                      </div>
                      {renderToggle(item.value, item.set)}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* API Keys */}
            {activeTab === "api" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-display font-semibold text-sm text-card-foreground mb-1">{t("api.title")}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{t("api.desc")}</p>

                  <div className="space-y-3">
                    {connections.map((conn) => (
                      <div key={conn.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-muted/10">
                        <span className="text-xl">{conn.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{conn.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{conn.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            conn.connected
                              ? "bg-secondary/10 text-secondary"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {conn.connected ? t("api.connected") : t("api.notConnected")}
                          </span>
                          <Button
                            size="sm"
                            variant={conn.connected ? "outline" : "default"}
                            className={`h-7 text-[11px] rounded-lg ${!conn.connected ? "gradient-btn border-0" : "border-border"}`}
                            onClick={() => {
                              apiKeyStore.toggle(conn.id);
                              toast({
                                title: conn.connected ? `🔌 ${conn.name} uzildi` : `✅ ${conn.name} ulandi`,
                              });
                            }}
                          >
                            {conn.connected ? t("api.disconnect") : t("api.connect")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Account */}
            {activeTab === "account" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Current plan */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-display font-semibold text-sm text-card-foreground mb-3 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-primary" />
                    {t("account.plan")}
                  </h3>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${planConfig.color} flex items-center justify-center`}>
                        <Crown className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{planConfig.name}</p>
                        <p className="text-xs text-muted-foreground">{planConfig.priceLabel}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-lg border-border"
                      onClick={() => onSectionChange?.("subscriptions")}
                    >
                      {t("account.changePlan")}
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>

                {/* Export & delete */}
                <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-9 rounded-lg border-border justify-start"
                    onClick={() => toast({ title: "📦 Ma'lumotlar eksport qilindi" })}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t("account.exportData")}
                  </Button>
                </div>

                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
                  <h3 className="font-display font-semibold text-sm text-destructive mb-1">{t("account.danger")}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{t("account.dangerDesc")}</p>
                  <Button
                    variant="outline"
                    className="h-9 rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => toast({ title: "⚠️ " + t("account.deleteConfirm") })}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("account.deleteAccount")}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
