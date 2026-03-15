// Subscription plan system

export type PlanType = "free" | "pro" | "pro-max";

export interface PlanConfig {
  id: PlanType;
  name: string;
  price: number;
  priceLabel: string;
  badge?: string;
  color: string;
  features: string[];
  limits: {
    maxAgents: number;
    maxToolsPerAgent: number;
    apiRequestsPerMonth: number;
    canSellAgents: boolean;
    canUseMarketplace: boolean;
    canUseTemplates: boolean;
    canUseAnalytics: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
  };
}

export const PLANS: PlanConfig[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    priceLabel: "Bepul",
    color: "from-muted-foreground to-muted-foreground",
    features: [
      "2 tagacha agent yaratish",
      "Agentga 2 ta tool",
      "500 API so'rov/oy",
      "Marketplace'dan sotib olish",
      "Asosiy shablonlar",
    ],
    limits: {
      maxAgents: 2,
      maxToolsPerAgent: 2,
      apiRequestsPerMonth: 500,
      canSellAgents: false,
      canUseMarketplace: true,
      canUseTemplates: true,
      canUseAnalytics: false,
      prioritySupport: false,
      customBranding: false,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    priceLabel: "$19/oy",
    badge: "Mashhur",
    color: "from-primary to-accent",
    features: [
      "10 tagacha agent yaratish",
      "Agentga 5 ta tool",
      "5,000 API so'rov/oy",
      "Marketplace'dan sotib olish",
      "Barcha shablonlar",
      "Batafsil statistika",
      "Ustuvor qo'llab-quvvatlash",
    ],
    limits: {
      maxAgents: 10,
      maxToolsPerAgent: 5,
      apiRequestsPerMonth: 5000,
      canSellAgents: false,
      canUseMarketplace: true,
      canUseTemplates: true,
      canUseAnalytics: true,
      prioritySupport: true,
      customBranding: false,
    },
  },
  {
    id: "pro-max",
    name: "Pro Max",
    price: 49,
    priceLabel: "$49/oy",
    badge: "Eng yaxshi",
    color: "from-secondary to-primary",
    features: [
      "Cheksiz agent yaratish",
      "Agentga barcha toollar",
      "25,000 API so'rov/oy",
      "Marketplace'dan sotib olish",
      "Barcha shablonlar",
      "Batafsil statistika",
      "Ustuvor qo'llab-quvvatlash",
      "🏷️ Agent sotish huquqi",
      "Custom branding",
    ],
    limits: {
      maxAgents: Infinity,
      maxToolsPerAgent: 7,
      apiRequestsPerMonth: 25000,
      canSellAgents: true,
      canUseMarketplace: true,
      canUseTemplates: true,
      canUseAnalytics: true,
      prioritySupport: true,
      customBranding: true,
    },
  },
];

// Simple in-memory subscription state
let currentPlan: PlanType = "free";
let planListeners: (() => void)[] = [];

export const subscriptionStore = {
  getPlan: () => currentPlan,
  getPlanConfig: () => PLANS.find((p) => p.id === currentPlan)!,
  setPlan: (plan: PlanType) => {
    currentPlan = plan;
    planListeners.forEach((fn) => fn());
  },
  canCreateAgent: (currentCount: number) => {
    const config = PLANS.find((p) => p.id === currentPlan)!;
    return currentCount < config.limits.maxAgents;
  },
  canSellAgents: () => {
    return PLANS.find((p) => p.id === currentPlan)!.limits.canSellAgents;
  },
  canUseAnalytics: () => {
    return PLANS.find((p) => p.id === currentPlan)!.limits.canUseAnalytics;
  },
  getMaxTools: () => {
    return PLANS.find((p) => p.id === currentPlan)!.limits.maxToolsPerAgent;
  },
  subscribe: (fn: () => void) => {
    planListeners.push(fn);
    return () => {
      planListeners = planListeners.filter((l) => l !== fn);
    };
  },
};
