import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Javohir M.",
    role: "Kontent marketolog",
    avatar: "JM",
    text: "SEO Content Master agenti blogimga 3 oyda 40K organik trafik olib keldi. Endi barcha kontent strategiyam shu agent orqali.",
    rating: 5,
    agent: "SEO Content Master",
  },
  {
    name: "Nilufar K.",
    role: "Amazon KDP sotuvchi",
    avatar: "NK",
    text: "KDP Publisher agenti tufayli oyiga 5-6 ta kitob chiqaryapman. Kalit so'z tahlili va tavsif yozish juda sifatli.",
    rating: 5,
    agent: "Amazon KDP Publisher",
  },
  {
    name: "Bobur R.",
    role: "Startup asoschisi",
    avatar: "BR",
    text: "Customer Support agenti 3 nafar operatorning ishini bajarmoqda. Oyiga $25 ga 24/7 mijoz xizmati — ajoyib!",
    rating: 5,
    agent: "Customer Support 24/7",
  },
  {
    name: "Shahlo A.",
    role: "SMM mutaxassisi",
    avatar: "ShA",
    text: "Telegram kanal agenti har kuni yangi kontent tayyorlab beradi. Obunachilar soni 2 barobar oshdi.",
    rating: 4,
    agent: "Telegram Channel Manager",
  },
  {
    name: "Alisher T.",
    role: "Data tahlilchi",
    avatar: "AT",
    text: "Data Analyst Pro agenti bilan haftalik hisobotlar 2 soatdan 10 daqiqaga tushdi. API narxi ham arzon.",
    rating: 5,
    agent: "Data Analyst Pro",
  },
  {
    name: "Madina Y.",
    role: "Freelancer",
    avatar: "MY",
    text: "Email Marketing agenti mijozlarim uchun kampaniyalar yaratib beradi. Konversiya 35% oshdi!",
    rating: 4,
    agent: "Email Marketing Agent",
  },
];

const Testimonials = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card/50 text-muted-foreground mb-4">
            <Star className="w-3.5 h-3.5 text-primary" />
            Sharhlar
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Foydalanuvchilar <span className="gradient-text">fikrlari</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Minglab foydalanuvchilar AI agentlar bilan natijaga erishmoqda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-xl border border-border bg-card/40 backdrop-blur-sm p-5 hover:border-primary/20 transition-all relative"
            >
              <Quote className="absolute top-4 right-4 w-5 h-5 text-primary/10" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    className={`w-3.5 h-3.5 ${si < t.rating ? "text-primary fill-primary" : "text-muted"}`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">"{t.text}"</p>

              {/* Agent badge */}
              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] bg-primary/8 text-primary border border-primary/15 mb-3">
                🤖 {t.agent}
              </span>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
