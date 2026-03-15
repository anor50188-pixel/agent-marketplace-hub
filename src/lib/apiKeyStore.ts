// Shared mock API key connection state

export interface ApiConnection {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  color: string;
}

const initialConnections: ApiConnection[] = [
  {
    id: "minimax",
    name: "MiniMax API",
    icon: "🧠",
    description: "Asosiy AI modeli — agentlarning fikrlash va javob berish qobiliyatini ta'minlaydi.",
    connected: true,
    color: "hsl(260 60% 65%)",
  },
  {
    id: "web-search",
    name: "Web Search API",
    icon: "🔍",
    description: "Google qidiruv natijalarini olish. Agentlar internetdan real-time ma'lumot qidirishi uchun.",
    connected: false,
    color: "hsl(230 80% 60%)",
  },
  {
    id: "http-request",
    name: "HTTP Request API",
    icon: "🌐",
    description: "Tashqi API'larga so'rov yuborish. Webhook, REST API va boshqa xizmatlar bilan integratsiya.",
    connected: false,
    color: "hsl(190 70% 50%)",
  },
  {
    id: "database",
    name: "Database API",
    icon: "🗄️",
    description: "Ma'lumotlar bazasiga yozish va o'qish. Agent natijalarini saqlash va tarixni boshqarish.",
    connected: false,
    color: "hsl(150 60% 50%)",
  },
];

let connections: ApiConnection[] = [...initialConnections];
let listeners: (() => void)[] = [];

export const apiKeyStore = {
  getConnections: () => connections,
  isConnected: (id: string) => connections.find((c) => c.id === id)?.connected ?? false,
  toggle: (id: string) => {
    connections = connections.map((c) => (c.id === id ? { ...c, connected: !c.connected } : c));
    listeners.forEach((fn) => fn());
  },
  subscribe: (fn: () => void) => {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },
};
