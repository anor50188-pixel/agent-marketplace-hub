

# Admin Panel Rejasi

## Maqsad
Admin panel — foydalanuvchilarni boshqarish, saytga kontent qo'shish/o'zgartirish, agentlarni moderatsiya qilish uchun alohida himoyalangan sahifa.

## Arxitektura

### 1. Rol tizimi (Database)
- `user_roles` jadvali yaratish (`user_id`, `role` — enum: `admin`, `moderator`, `user`)
- `has_role()` security definer funksiyasi — RLS policy'larda ishlatish uchun
- Birinchi admin'ni qo'lda belgilash (siz o'zingiz)

### 2. Admin sahifa va routing
- `/admin` route qo'shish — faqat `admin` rolidagi foydalanuvchilar kiradi
- Rol tekshiruvi AuthContext'da — `isAdmin` flag qo'shish
- Admin bo'lmagan foydalanuvchilar `/dashboard`ga redirect bo'ladi

### 3. Admin Panel UI bo'limlari

| Bo'lim | Funksiya |
|--------|----------|
| **Foydalanuvchilar** | Ro'yxat, qidirish, rollarni o'zgartirish, bloklash (UI only) |
| **Agentlar** | Barcha agentlar ro'yxati, moderatsiya (tasdiqlash/rad etish UI) |
| **Kontent** | Landing sahifa matnlarini, narxlarni o'zgartirish UI |
| **Statistika** | Umumiy platformadagi foydalanuvchi/agent/tranzaksiya soni |

### 4. Texnik tafsilotlar

**Yangi fayllar:**
- `src/pages/AdminPage.tsx` — admin layout (sidebar + content)
- `src/components/admin/AdminSidebar.tsx` — admin navigatsiya
- `src/components/admin/AdminUsers.tsx` — foydalanuvchilar ro'yxati
- `src/components/admin/AdminAgents.tsx` — agentlar moderatsiyasi
- `src/components/admin/AdminContent.tsx` — kontent boshqaruvi
- `src/components/admin/AdminStats.tsx` — umumiy statistika
- `src/hooks/useIsAdmin.ts` — admin rolini tekshirish hook

**O'zgartiriladigan fayllar:**
- `App.tsx` — `/admin` route qo'shish
- `AuthContext.tsx` — rol tekshiruvini qo'shish

**Database migration:**
- `user_roles` jadval + `app_role` enum
- `has_role()` funksiya
- RLS policy'lar

**Hozircha mock data bilan:**
Barcha jadvallar (users, agents) frontend'da mock bo'ladi — keyinchalik siz backend API ulaysiz. Admin panel UI to'liq tayyor bo'ladi.

**Xavfsizlik:**
- Rol localStorage'da **saqlanmaydi** — faqat database'dan tekshiriladi
- `has_role()` security definer funksiyasi RLS'da recursive muammo bo'lmaydi

