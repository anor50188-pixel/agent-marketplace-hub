

## "Yaratamiz" Dashboard — Asl reja

Tushundim — reja to'g'ri edi! Qo'shimcha taklifim yo'q, asl rejani amalga oshiramiz:

### Yaratiladi

1. **`src/components/Dashboard.tsx`** — Full-screen overlay, 3 qismli layout (sidebar | content | chat)
2. **`src/components/DashboardSidebar.tsx`** — Chap sidebar: Agent yaratish, Agentlarim, Sotuvdagi agentlar, Ilovalar
3. **`src/components/DashboardContent.tsx`** — Tanlangan bo'limga qarab kontent (placeholder)
4. **`src/components/AgentusChat.tsx`** — O'ng tomonda AI chat panel

### O'zgartiriladi

5. **`src/components/HeroSection.tsx`** — "Yaratamiz" tugmasiga onClick qo'shiladi
6. **`src/pages/Index.tsx`** — Dashboard state boshqaruvi, Dashboard komponenti render

### Stil va animatsiyalar
- Glassmorphism (`glass`, `glass-hover` classlari)
- `framer-motion`: dashboard scale+fade ochilishi, sidebar staggered slide-in, content fade, chat slide-in
- `lucide-react` ikonlari

