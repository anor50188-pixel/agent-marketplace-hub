

## Ilovalar bo'limini ChatGPT Apps uslubida qayta qurish

Referens rasmlardan ko'rinib turibdiki, ChatGPT Apps sahifasi juda toza va minimal — kartochkalar emas, balki **ro'yxat (list)** ko'rinishida, har bir tool o'z rangli ikonkasi, nomi, qisqa tavsifi va o'ng tomonda chevron (>) bilan ko'rsatilgan.

### Rejalashtirgan o'zgarishlar

**1. AppsSection.tsx — to'liq qayta qurish**

Hozirgi grid-card layoutni olib tashlab, ChatGPT uslubidagi ikki ustunli ro'yxatga o'tkazamiz:

- **Yuqorida**: Kategoriya tablari (Featured/Hammasi, Qidiruv, Ishlab chiqish, Ijtimoiy, Tahlil, AI) — pill-style tablar
- **Asosiy qism**: Ikki ustunli ro'yxat (2 column list), har bir qatorda:
  - Chap: Rangli yumaloq ikonka (40-48px)
  - O'rta: Tool nomi (bold) + qisqa tavsif (muted)
  - O'ng: Chevron right (>) ikoni
- Har bir tool bosilganda — **detail view** ochiladi (ChatGPT'dagi "Lovable" sahifasiga o'xshash):
  - Katta ikonka
  - Tool nomi + to'liq tavsif
  - "Ulash" (Connect) tugmasi
  - Ulangan/ulanmagan holat ko'rsatkichi

**2. Dizayn detallari**

- Kartochkalar va glow effektlar olib tashlanadi — toza, minimal list
- Hover effekt: subtle background highlight
- Ikonkalar: hozirgi emoji iconlar saqlanadi, lekin yumaloq rangli fon bilan
- Qidiruv qatori saqlanadi, lekin yuqoriga joylashtiriladi
- Mobil qurilmalarda bitta ustunli ro'yxatga o'tadi

**3. Detail View (tool bosilganda)**

- Sahifa ichida slide-in yoki alohida ko'rinish
- Tool logotipi, nomi, batafsil tavsifi
- "Ulash" / "Uzish" tugmasi
- Faol/o'chiq holat badge

Fayllar: `src/components/AppsSection.tsx` — to'liq qayta yoziladi.

