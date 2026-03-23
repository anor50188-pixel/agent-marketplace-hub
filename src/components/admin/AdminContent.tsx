import { useState } from "react";
import { Save, Type, DollarSign, Image } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminContent = () => {
  const [heroTitle, setHeroTitle] = useState("AI Agentlar Platformasi");
  const [heroSubtitle, setHeroSubtitle] = useState("O'z AI agentingizni yarating, sinang va sotib pul ishlang");
  const [ctaText, setCtaText] = useState("Bepul boshlash");

  const handleSave = () => {
    toast.success("O'zgarishlar saqlandi (mock)");
  };

  const sections = [
    {
      title: "Hero bo'limi",
      icon: Type,
      fields: [
        { label: "Sarlavha", value: heroTitle, onChange: setHeroTitle, type: "input" as const },
        { label: "Qo'shimcha matn", value: heroSubtitle, onChange: setHeroSubtitle, type: "textarea" as const },
        { label: "CTA tugma matni", value: ctaText, onChange: setCtaText, type: "input" as const },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">Kontent boshqaruvi</h2>
          <p className="text-sm text-muted-foreground mt-1">Landing sahifa matnlarini tahrirlash</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Saqlash
        </Button>
      </div>

      {sections.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-6 rounded-2xl bg-card border border-border/50"
        >
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <section.icon className="w-4 h-4 text-primary" />
            {section.title}
          </h3>
          <div className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.label}>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{field.label}</label>
                {field.type === "textarea" ? (
                  <Textarea value={field.value} onChange={(e) => field.onChange(e.target.value)} className="bg-muted/30 border-border/50 min-h-[80px]" />
                ) : (
                  <Input value={field.value} onChange={(e) => field.onChange(e.target.value)} className="bg-muted/30 border-border/50" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Pricing section placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-card border border-border/50"
      >
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4 text-accent" />
          Narxlar sozlamalari
        </h3>
        <p className="text-sm text-muted-foreground">
          Narxlar hozircha <code className="px-1.5 py-0.5 rounded bg-muted text-xs">subscriptionStore.ts</code> da belgilangan. 
          Backend ulangandan so'ng bu yerdan boshqarish mumkin bo'ladi.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-card border border-border/50"
      >
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          <Image className="w-4 h-4 text-secondary" />
          Media boshqaruvi
        </h3>
        <p className="text-sm text-muted-foreground">
          Rasmlar va media fayllarni yuklash — backend ulangandan so'ng ishlaydi.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminContent;
