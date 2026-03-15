// Internationalization store with Uzbek and Russian translations

export type Lang = "uz" | "ru";

export const translations: Record<Lang, Record<string, string>> = {
  uz: {
    // Settings page
    "settings.title": "Sozlamalar",
    "settings.subtitle": "Profil, bildirishnomalar va hisobni boshqaring",
    "settings.profile": "Profil",
    "settings.notifications": "Bildirishnomalar",
    "settings.apiKeys": "API kalitlari",
    "settings.account": "Hisob",
    "settings.appearance": "Ko'rinish",
    // Profile
    "profile.name": "Ism",
    "profile.namePlaceholder": "Ismingizni kiriting",
    "profile.email": "Email",
    "profile.emailPlaceholder": "Email manzilingiz",
    "profile.bio": "Bio",
    "profile.bioPlaceholder": "O'zingiz haqingizda qisqacha...",
    "profile.save": "Saqlash",
    "profile.saved": "Saqlandi!",
    // Notifications
    "notif.emailNotif": "Email bildirishnomalar",
    "notif.emailNotifDesc": "Muhim yangiliklar va yangilanishlarni emailga yuborish",
    "notif.agentAlerts": "Agent ogohlantirishlari",
    "notif.agentAlertsDesc": "Agent xatoliklari va muhim hodisalar haqida xabar berish",
    "notif.salesNotif": "Sotuv bildirshnomalari",
    "notif.salesNotifDesc": "Marketplace'dan sotuv va sharh xabarlari",
    "notif.weeklyReport": "Haftalik hisobot",
    "notif.weeklyReportDesc": "Har hafta agentlar statistikasi haqida xulosa",
    // API Keys
    "api.title": "API kalitlari",
    "api.desc": "Agentlaringiz uchun API ulanishlarni boshqaring",
    "api.connected": "Ulangan",
    "api.notConnected": "Ulanmagan",
    "api.connect": "Ulash",
    "api.disconnect": "Uzish",
    // Account
    "account.plan": "Joriy reja",
    "account.changePlan": "Rejani o'zgartirish",
    "account.danger": "Xavfli zona",
    "account.dangerDesc": "Bu amalni ortga qaytarib bo'lmaydi",
    "account.deleteAccount": "Hisobni o'chirish",
    "account.deleteConfirm": "Haqiqatan ham hisobingizni o'chirmoqchimisiz?",
    "account.exportData": "Ma'lumotlarni eksport qilish",
    // Appearance
    "appearance.theme": "Mavzu",
    "appearance.light": "Yorug'",
    "appearance.dark": "Qorong'u",
    "appearance.language": "Til",
    // General
    "general.cancel": "Bekor qilish",
    "general.save": "Saqlash",
    // Sidebar
    "sidebar.create": "Agent yaratish",
    "sidebar.myAgents": "Agentlarim",
    "sidebar.sell": "Agent sotish",
    "sidebar.apps": "Ilovalar",
    "sidebar.templates": "Shablonlar",
    "sidebar.marketplace": "Marketplace",
    "sidebar.analytics": "Statistika",
    "sidebar.subscriptions": "Obuna",
    "sidebar.settings": "Sozlamalar",
    "sidebar.tools": "Vositalar",
    "sidebar.others": "Boshqalar",
  },
  ru: {
    // Settings page
    "settings.title": "Настройки",
    "settings.subtitle": "Управляйте профилем, уведомлениями и аккаунтом",
    "settings.profile": "Профиль",
    "settings.notifications": "Уведомления",
    "settings.apiKeys": "API ключи",
    "settings.account": "Аккаунт",
    "settings.appearance": "Внешний вид",
    // Profile
    "profile.name": "Имя",
    "profile.namePlaceholder": "Введите ваше имя",
    "profile.email": "Email",
    "profile.emailPlaceholder": "Ваш email адрес",
    "profile.bio": "О себе",
    "profile.bioPlaceholder": "Коротко о себе...",
    "profile.save": "Сохранить",
    "profile.saved": "Сохранено!",
    // Notifications
    "notif.emailNotif": "Email уведомления",
    "notif.emailNotifDesc": "Получать важные новости и обновления на email",
    "notif.agentAlerts": "Оповещения агентов",
    "notif.agentAlertsDesc": "Уведомления об ошибках и важных событиях агентов",
    "notif.salesNotif": "Уведомления о продажах",
    "notif.salesNotifDesc": "Уведомления о продажах и отзывах с Marketplace",
    "notif.weeklyReport": "Еженедельный отчёт",
    "notif.weeklyReportDesc": "Сводка статистики агентов каждую неделю",
    // API Keys
    "api.title": "API ключи",
    "api.desc": "Управляйте API подключениями для ваших агентов",
    "api.connected": "Подключён",
    "api.notConnected": "Не подключён",
    "api.connect": "Подключить",
    "api.disconnect": "Отключить",
    // Account
    "account.plan": "Текущий план",
    "account.changePlan": "Изменить план",
    "account.danger": "Опасная зона",
    "account.dangerDesc": "Это действие нельзя отменить",
    "account.deleteAccount": "Удалить аккаунт",
    "account.deleteConfirm": "Вы действительно хотите удалить аккаунт?",
    "account.exportData": "Экспорт данных",
    // Appearance
    "appearance.theme": "Тема",
    "appearance.light": "Светлая",
    "appearance.dark": "Тёмная",
    "appearance.language": "Язык",
    // General
    "general.cancel": "Отмена",
    "general.save": "Сохранить",
    // Sidebar
    "sidebar.create": "Создать агента",
    "sidebar.myAgents": "Мои агенты",
    "sidebar.sell": "Продать агента",
    "sidebar.apps": "Приложения",
    "sidebar.templates": "Шаблоны",
    "sidebar.marketplace": "Маркетплейс",
    "sidebar.analytics": "Статистика",
    "sidebar.subscriptions": "Подписка",
    "sidebar.settings": "Настройки",
    "sidebar.tools": "Инструменты",
    "sidebar.others": "Прочее",
  },
};

let currentLang: Lang = "uz";
let langListeners: (() => void)[] = [];

// Stable snapshot for useSyncExternalStore
let snapshot: { lang: Lang } = { lang: currentLang };

export const i18nStore = {
  getLang: () => currentLang,
  getSnapshot: () => snapshot,
  setLang: (lang: Lang) => {
    currentLang = lang;
    snapshot = { lang: currentLang };
    langListeners.forEach((fn) => fn());
  },
  t: (key: string): string => {
    return translations[currentLang][key] || key;
  },
  subscribe: (fn: () => void) => {
    langListeners.push(fn);
    return () => {
      langListeners = langListeners.filter((l) => l !== fn);
    };
  },
};
