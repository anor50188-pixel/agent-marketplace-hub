// Shared in-memory agent store for cross-page state

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  tools: string[];
  status: "active" | "draft" | "testing" | "published";
  createdAt: string;
  // Marketplace fields
  price?: number;
  description?: string;
  keywords?: string[];
  images?: string[];
  category?: string;
  apiCostPerMonth?: number;
  apiRequestsPerMonth?: number;
  publishedAt?: string;
  testStartedAt?: string;
  totalSales?: number;
  totalViews?: number;
  reviews?: { rating: number; count: number };
}

// Mock initial agents
const initialAgents: AgentConfig[] = [
  {
    id: "agent-1",
    name: "AI Trend Tracker",
    role: "Har kuni AI sohasidagi eng so'nggi yangiliklarni kuzatib boradi va hisobot tayyorlaydi",
    tools: ["web-search", "ai-brain"],
    status: "active",
    createdAt: "2025-03-10",
    category: "Research",
    apiCostPerMonth: 4.5,
    apiRequestsPerMonth: 1200,
  },
  {
    id: "agent-2",
    name: "Social Monitor",
    role: "Ijtimoiy tarmoqlarda brand mention'larni kuzatadi",
    tools: ["social-search", "ai-brain", "website-reader"],
    status: "active",
    createdAt: "2025-03-12",
    category: "Marketing",
    apiCostPerMonth: 8.2,
    apiRequestsPerMonth: 3400,
  },
];

let agents: AgentConfig[] = [...initialAgents];
let listeners: (() => void)[] = [];

export const agentStore = {
  getAgents: () => agents,
  getAgent: (id: string) => agents.find((a) => a.id === id),
  addAgent: (agent: AgentConfig) => {
    agents = [agent, ...agents];
    listeners.forEach((fn) => fn());
  },
  updateAgent: (id: string, updates: Partial<AgentConfig>) => {
    agents = agents.map((a) => (a.id === id ? { ...a, ...updates } : a));
    listeners.forEach((fn) => fn());
  },
  subscribe: (fn: () => void) => {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },
};
