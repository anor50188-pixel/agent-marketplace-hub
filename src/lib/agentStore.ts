// Shared in-memory agent store for cross-page state

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  tools: string[];
  status: "active" | "draft";
  createdAt: string;
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
  },
  {
    id: "agent-2",
    name: "Social Monitor",
    role: "Ijtimoiy tarmoqlarda brand mention'larni kuzatadi",
    tools: ["social-search", "ai-brain", "website-reader"],
    status: "active",
    createdAt: "2025-03-12",
  },
];

let agents: AgentConfig[] = [...initialAgents];
let listeners: (() => void)[] = [];

export const agentStore = {
  getAgents: () => agents,
  addAgent: (agent: AgentConfig) => {
    agents = [agent, ...agents];
    listeners.forEach((fn) => fn());
  },
  subscribe: (fn: () => void) => {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },
};
