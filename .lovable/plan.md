

# Frontend-Only Yaxshilash Rejasi

Maqsad: Chiroyli, professional frontend yaratish — barcha AI/backend logikani keyinchalik siz o'zingiz ulaysiz. Hozir mock data va placeholder'lar bilan ishlaydi.

---

## Asosiy O'zgarishlar

### 1. Router Arxitekturasini To'g'rilash
Hozir Dashboard `fixed inset-0` overlay sifatida ochilmoqda — bu brauzer tarixini buzadi. 

- React Router bilan alohida sahifalar: `/dashboard`, `/auth`, `/`
- Dashboard ichida section'lar URL query param orqali boshqariladi (`/dashboard?section=my-agents`)
- Auth sahifaga yo'naltirish UI'si tayyor bo'ladi (backend ulanmaguncha mock user)

**Fayllar:** `App.tsx`, `pages/Index.tsx`, yangi `pages/Dashboard.tsx`

### 2. Agent Yaratish — Split Panel (Lovable-style)
Hozirgi AgentCreatorChat va AgentLiveBuilder'ni yaxshilash:

- Chat panel chapda (40%), Builder panel o'ngda (60%)
- Chat'da AI javoblari hozircha `parsePromptToAgent` mock funksiya orqali — keyinchalik siz backend API'ga almashtirasiz
- Builder'da real-time tahrirlash (nom, rol, tools, kategoriya)
- "Nashr qilish" bosilganda agent `agentStore`'ga qo'shiladi va "Agentlarim"da ko'rinadi
- **Backend ulash uchun:** `parsePromptToAgent` funksiyani API call bilan almashtirish yetarli

**Fayllar:** `AgentCreatorChat.tsx`, `AgentLiveBuilder.tsx`

### 3. MyAgents — Yaxshilangan Kartalar
- 3 ustunli grid (xl ekranlar)
- Hover glow effect, mini-stat'lar (runs, success rate — mock)
- Empty state'da "Agent yaratish" tugmasi `create` section'ga o'tkazadi
- Agent bosilganda AgentDashboard ochiladi

**Fayllar:** `MyAgents.tsx`

### 4. Marketplace UI
- Agent kartalarini grid layout'da ko'rsatish
- Agent detail sahifasi: narx, tavsif, sharhlar, "Sotib olish" tugmasi (placeholder)
- Qidiruv va filter UI (kategoriya, narx bo'yicha)

**Fayllar:** `Marketplace.tsx`, `MarketplaceAgentDetail.tsx`

### 5. Statistics/Analytics — Vizual Yaxshilash
- KPI kartalar gradient border bilan
- Pill-shape period selector
- Bar chart'lar mock data bilan (keyinchalik API'dan keladi)

**Fayllar:** `Statistics.tsx`

### 6. Sidebar va Top Bar Polish
- Active indicator line (Linear-style)
- Notification badge'lar
- User ma'lumotlari AuthContext'dan
- Breadcrumb sarlavha

**Fayllar:** `DashboardSidebar.tsx`, `DashboardTopBar.tsx`

### 7. Mobile Responsive
- Sidebar hamburger menu sifatida
- Split panel chat'da mobile'da to'liq ekran chat, builder alohida tab

**Fayllar:** barcha dashboard komponentlari

---

## Texnik Tafsilotlar

### Backend Ulash Nuqtalari (siz uchun)
Quyidagi joylarda mock logikani API call bilan almashtirasiz:

| Joy | Hozir | Siz almashtirasiz |
|-----|-------|-------------------|
| `AgentCreatorChat.tsx` → `parsePromptToAgent()` | Keyword regex | AI API call |
| `agentStore.ts` → `addAgent/getAgents` | In-memory array | Database CRUD |
| `MyAgents.tsx` → agent stats | Random mock | API dan haqiqiy stat |
| `Statistics.tsx` → barcha grafik data | Hardcoded mock | Analytics API |
| `Marketplace.tsx` → agent ro'yxati | Mock data | Marketplace API |
| `AuthContext.tsx` → user session | Supabase auth | O'z auth sistemaingiz |

### O'zgartirilmaydigan fayllar
- `src/integrations/supabase/client.ts` — avtomatik
- `src/integrations/supabase/types.ts` — avtomatik
- `.env` — avtomatik

### Saqlanuvchi Pattern'lar
- Framer Motion animatsiyalar
- Tailwind + CSS utility class'lar
- `useSyncExternalStore` pattern store'lar uchun
- O'zbek til interfeysi

