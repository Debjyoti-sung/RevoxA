import { create } from 'zustand';
import { memoryDebugManager } from '../lib/debug/memory-debug';
import { 
  mockFeedback, 
  mockClusters, 
  mockFeatureRequests, 
  mockRecommendations, 
  mockMentalModels, 
  mockTimelineEvents, 
  mockIntegrations, 
  mockNotifications, 
  mockWorkspaceMembers, 
  mockWorkspaceTasks,
  Feedback,
  Cluster,
  FeatureRequest,
  Recommendation,
  MentalModel,
  TimelineEvent,
  Integration
} from '../lib/seedData';

// Proxy base (Next.js API routes) — used for reads
const API_BASE_URL = '';
// Direct FastAPI base — bypasses Next.js proxy for faster write ops
const BACKEND_URL = typeof window !== 'undefined' ? 'http://127.0.0.1:8000' : (process.env.BACKEND_URL || 'http://127.0.0.1:8000');

// Shared fast fetch config for write operations
const WRITE_OPTS = { cache: 'no-store' as RequestCache, keepalive: true };

interface StoreState {
  // Database Entities
  feedbacks: Feedback[];
  clusters: Cluster[];
  features: FeatureRequest[];
  recommendations: Recommendation[];
  mentalModels: MentalModel[];
  timelineEvents: TimelineEvent[];
  integrations: Integration[];
  notifications: typeof mockNotifications;
  workspaceMembers: typeof mockWorkspaceMembers;
  workspaceTasks: typeof mockWorkspaceTasks;

  // Search & Filter States
  searchText: string;
  sourceFilter: string;
  sentimentFilter: string;
  severityFilter: string;
  featureFilter: string;
  statusFilter: string;

  // AI & Memory States
  recallQuery: string;
  recallResults: Feedback[];
  recallConfidence: number;
  reflectionQuestion: string;
  reflectionAnswer: string;
  reflectionConfidence: number;
  reflectionEvidence: string[];
  aiChatHistory: { role: 'user' | 'assistant'; content: string; timestamp: Date; confidence?: number }[];
  isThinking: boolean;

  // Dashboard Stats
  dashboardStats: {
    totalFeedback: number;
    totalMemories: number;
    memoryGrowth: number;
    activeMentalModels: number;
    aiInsightsGenerated: number;
    reasoningConfidence: number;
    criticalTrendsCount: number;
    openIssuesCount: number;
    sentimentScore: number;
    featureRequestsCount: number;
  };

  // Actions
  fetchState: () => Promise<void>;
  setSearchText: (text: string) => void;
  setFilters: (filters: { 
    source?: string; 
    sentiment?: string; 
    severity?: string; 
    feature?: string; 
    status?: string; 
  }) => void;
  resetFilters: () => void;

  // Feedback Hub Action
  addFeedback: (item: Omit<Feedback, 'id' | 'created_at'>) => Promise<void>;
  updateFeedbackStatus: (id: string, status: Feedback['status']) => Promise<void>;

  // Memory Suite Actions
  retainMemory: (content: string, source: string) => Promise<void>;
  recallMemory: (query: string) => Promise<void>;
  reflectMemory: (question: string) => Promise<void>;
  createMentalModel: (name: string, summary: string) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;

  // Workspace Actions
  addTask: (title: string, assignee: string, priority: string) => Promise<void>;
  updateTaskStatus: (id: string, status: string) => Promise<void>;

  // AI Chat Action
  sendAiMessage: (message: string) => Promise<void>;

  // Real-Time Sync Ingestion Simulation
  simulateFeedbackIngestion: () => Promise<void>;
  toggleIntegration: (id: string) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initialize States with default seed values (as local fallbacks)
  feedbacks: mockFeedback,
  clusters: mockClusters,
  features: mockFeatureRequests,
  recommendations: mockRecommendations,
  mentalModels: mockMentalModels,
  timelineEvents: mockTimelineEvents,
  integrations: mockIntegrations,
  notifications: mockNotifications,
  workspaceMembers: mockWorkspaceMembers,
  workspaceTasks: mockWorkspaceTasks,

  searchText: '',
  sourceFilter: 'all',
  sentimentFilter: 'all',
  severityFilter: 'all',
  featureFilter: 'all',
  statusFilter: 'all',

  recallQuery: '',
  recallResults: [],
  recallConfidence: 0,
  reflectionQuestion: '',
  reflectionAnswer: '',
  reflectionConfidence: 0,
  reflectionEvidence: [],
  aiChatHistory: [
    { 
      role: 'assistant', 
      content: 'Hello! I am RevoxA Intelligence, your permanent memory copilot. Ask me anything about customer feedback history, trends, active clusters, or feature recommendations.', 
      timestamp: new Date() 
    }
  ],
  isThinking: false,

  dashboardStats: {
    totalFeedback: 5120,
    totalMemories: 4890,
    memoryGrowth: 18.4,
    activeMentalModels: mockMentalModels.length,
    aiInsightsGenerated: 245,
    reasoningConfidence: 94.5,
    criticalTrendsCount: 3,
    openIssuesCount: 12,
    sentimentScore: 78,
    featureRequestsCount: mockFeatureRequests.length
  },

  // 1. Initial State Sync Actions
  fetchState: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/state`);
      if (res.ok) {
        const data = await res.json();
        
        // Count memories in fetched feedbacks
        const memoriesCount = data.feedbacks.filter(
          (f: Feedback) => f.status === 'processed' || f.feature_tag === 'Memory'
        ).length;
        
        // Calculate counts
        const openIssues = data.workspaceTasks.filter(
          (t: any) => t.status !== 'Resolved'
        ).length;

        set({
          feedbacks: data.feedbacks,
          clusters: data.clusters,
          features: data.features,
          recommendations: data.recommendations,
          timelineEvents: data.timelineEvents,
          integrations: data.integrations,
          notifications: data.notifications,
          workspaceMembers: data.workspaceMembers,
          workspaceTasks: data.workspaceTasks,
          mentalModels: data.mentalModels,
          dashboardStats: {
            ...get().dashboardStats,
            totalFeedback: data.feedbacks.length,
            totalMemories: memoriesCount,
            activeMentalModels: data.mentalModels.length,
            featureRequestsCount: data.features.length,
            openIssuesCount: openIssues
          }
        });
        console.log("[useStore] Connected to RevoxA backend successfully.");
      }
    } catch (e) {
      console.warn("[useStore] Backend offline. Falling back to frontend client mock state.");
    }
  },

  // Filter Actions
  setSearchText: (text) => set({ searchText: text }),
  setFilters: (filters) => set((state) => ({
    ...(filters.source    !== undefined && { sourceFilter:    filters.source }),
    ...(filters.sentiment !== undefined && { sentimentFilter: filters.sentiment }),
    ...(filters.severity  !== undefined && { severityFilter:  filters.severity }),
    ...(filters.feature   !== undefined && { featureFilter:   filters.feature }),
    ...(filters.status    !== undefined && { statusFilter:    filters.status }),
  })),
  resetFilters: () => set({
    sourceFilter: 'all',
    sentimentFilter: 'all',
    severityFilter: 'all',
    featureFilter: 'all',
    statusFilter: 'all',
    searchText: ''
  }),

  // Add Feedback
  addFeedback: async (item) => {
    // Optimistic local add
    const newId = `feedback-opt-${Date.now()}`;
    const newItem: Feedback = {
      ...item,
      id: newId,
      created_at: new Date().toISOString()
    };
    
    set((state) => ({
      feedbacks: [newItem, ...state.feedbacks],
      dashboardStats: {
        ...state.dashboardStats,
        totalFeedback: state.dashboardStats.totalFeedback + 1
      }
    }));

    // Fire-and-forget to FastAPI directly — UI already updated optimistically above
    fetch(`${BACKEND_URL}/api/feedbacks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
      ...WRITE_OPTS,
    }).then(res => res.ok ? res.json() : null)
      .then(saved => {
        if (saved) {
          set(state => ({ feedbacks: state.feedbacks.map(f => f.id === newId ? saved : f) }));
        }
      })
      .catch(() => console.warn('[useStore] Failed to persist feedback to backend — using local state.'));
  },

  updateFeedbackStatus: async (id, status) => {
    // Optimistic update
    set((state) => ({
      feedbacks: state.feedbacks.map((f) => f.id === id ? { ...f, status } : f)
    }));

    fetch(`${BACKEND_URL}/api/feedbacks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      ...WRITE_OPTS,
    }).catch(() => console.warn('[useStore] Failed to update feedback status in backend.'));
  },

  // Memory Actions
  retainMemory: async (content, source) => {
    // Update debug state
    memoryDebugManager.updateState({
      retainCalled: true,
      memoriesStored: memoryDebugManager.getState().memoriesStored + 1,
      lastStoredMemory: content,
    });

    // Optimistic local update
    const newFeedback: Feedback = {
      id: `feedback-memory-${Date.now()}`,
      title: `Manually stored memory via ${source}`,
      content: content,
      source_type: 'csv',
      customer_name: 'System Admin',
      customer_email: 'admin@workspace.com',
      sentiment: 'neutral',
      sentiment_score: 0,
      severity: 'low',
      status: 'processed',
      cluster_id: 'cluster-1',
      feature_tag: 'Memory',
      created_at: new Date().toISOString()
    };

    set((state) => ({
      feedbacks: [newFeedback, ...state.feedbacks],
      dashboardStats: {
        ...state.dashboardStats,
        totalMemories: state.dashboardStats.totalMemories + 1,
        totalFeedback: state.dashboardStats.totalFeedback + 1
      }
    }));

    // Fire-and-forget retain
    fetch(`${BACKEND_URL}/api/memory/retain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bank_id: 'default', content }),
      ...WRITE_OPTS,
    }).catch(() => {
      console.warn('[useStore] Failed to retain memory in backend.');
      memoryDebugManager.updateState({ vectorStoreConnected: false });
    });
  },

  deleteMemory: async (id) => {
    // Optimistic delete
    set((state) => ({
      feedbacks: state.feedbacks.filter((f) => f.id !== id),
      dashboardStats: {
        ...state.dashboardStats,
        totalMemories: Math.max(0, state.dashboardStats.totalMemories - 1),
        totalFeedback: Math.max(0, state.dashboardStats.totalFeedback - 1)
      }
    }));

    fetch(`${BACKEND_URL}/api/feedbacks/${id}`, { method: 'DELETE', ...WRITE_OPTS })
      .catch(() => console.warn('[useStore] Failed to delete memory in backend.'));
  },

  recallMemory: async (query) => {
    if (!query.trim()) {
      set({ recallResults: [], recallQuery: query, recallConfidence: 0 });
      return;
    }
    set({ isThinking: true, recallQuery: query });

    const startTime = performance.now();

    try {
      const res = await fetch(`${BACKEND_URL}/api/memory/recall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bank_id: 'default', query }),
        cache: 'no-store',
      });
      if (res.ok) {
        const result = await res.json();
        const items = result.items.map((item: any) => ({
          id: item.id,
          title: item.title || "Recall Vector Match",
          content: item.content,
          source_type: item.source_type || 'csv',
          customer_name: item.customer_name || 'System Recall',
          customer_email: item.customer_email || 'recall@revoxa.ai',
          sentiment: item.sentiment || 'neutral',
          sentiment_score: item.sentiment_score || 0.0,
          severity: item.severity || 'low',
          status: item.status || 'processed',
          cluster_id: item.cluster_id || 'cluster-1',
          feature_tag: item.feature_tag || 'Memory',
          created_at: item.created_at || new Date().toISOString()
        }));

        // Calculate and update memory debug state metrics
        const latency = Math.round(performance.now() - startTime);
        const topScore = items.length > 0 ? parseFloat((items[0].sentiment_score || 0.93).toFixed(2)) : 0;
        const retrievedMemories = items.map((i: any) => ({
          content: i.content,
          score: parseFloat((i.sentiment_score || 0.85).toFixed(2)),
        })).sort((a: any, b: any) => b.score - a.score);

        memoryDebugManager.updateState({
          recallCalled: true,
          vectorStoreConnected: true,
          memoriesRetrieved: items.length,
          topSimilarityScore: topScore,
          recallLatencyMs: latency,
          lastQuery: query,
          retrievedMemories,
        });
        
        set({ recallResults: items, recallConfidence: result.confidence, isThinking: false });
        return;
      }
    } catch (e) {
      console.warn("[useStore] Recall API failed. Falling back to local text matches.");
      memoryDebugManager.updateState({ vectorStoreConnected: false });
    }

    // Heuristics Fallback
    setTimeout(() => {
      const results = get().feedbacks.filter(f => 
        f.content.toLowerCase().includes(query.toLowerCase()) || 
        f.title.toLowerCase().includes(query.toLowerCase()) ||
        f.feature_tag.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);

      const confidence = results.length > 0 ? Math.floor(Math.random() * 10) + 88 : 0;
      
      const latency = Math.round(performance.now() - startTime);
      const topScore = results.length > 0 ? parseFloat((0.92 - (Math.random() * 0.05)).toFixed(2)) : 0;
      const retrieved = results.map((r, index) => ({
        content: r.content,
        score: parseFloat((topScore - (index * 0.08)).toFixed(2)),
      }));

      memoryDebugManager.updateState({
        recallCalled: true,
        memoriesRetrieved: results.length,
        topSimilarityScore: topScore,
        recallLatencyMs: latency,
        lastQuery: query,
        retrievedMemories: retrieved,
      });

      set({ recallResults: results, recallConfidence: confidence, isThinking: false });
    }, 800);
  },

  reflectMemory: async (question) => {
    if (!question.trim()) {
      set({ reflectionQuestion: question, reflectionAnswer: '', reflectionConfidence: 0, reflectionEvidence: [] });
      return;
    }
    set({ isThinking: true, reflectionQuestion: question });

    try {
      const res = await fetch(`${BACKEND_URL}/api/memory/reflect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bank_id: 'default', question }),
        cache: 'no-store',
      });
      if (res.ok) {
        const result = await res.json();
        set({ 
          reflectionAnswer: result.answer, 
          reflectionConfidence: result.confidence, 
          reflectionEvidence: result.evidence, 
          isThinking: false 
        });
        return;
      }
    } catch (e) {
      console.warn("[useStore] Reflect API failed. Falling back to local reflection.");
    }

    // Heuristics Fallback
    setTimeout(() => {
      let answer = `Based on RevoxA Memory intelligence, the question regarding "${question}" can be traced to recurring feedback clusters. `;
      let confidence = 92;
      let evidence: string[] = [];

      if (question.toLowerCase().includes('payment') || question.toLowerCase().includes('checkout')) {
        answer += "We found that checkout friction peaks around credit card authentication and API timeouts on Stripe integrations (specifically response code 402). Over 140 critical-severity reports have been recorded this quarter.";
        confidence = 96;
        evidence = [
          "Subscription renew failing with error code 402 (Clara Vance, Gmail)",
          "Stripe Checkout Gateway Timeout Cluster (#1 growth rate in June)",
          "Upgrade Stripe Webhook Concurrency Limits Recommendation"
        ];
      } else if (question.toLowerCase().includes('onboarding') || question.toLowerCase().includes('invite')) {
        answer += "Onboarding drop-offs are primarily tied to early member workspace invitations expiring within 2 hours. Setting the invitation token lifespan to 24 hours is predicted to restore activation rates by 14.5%.";
        confidence = 91;
        evidence = [
          "Onboarding flow is incredibly confusing (Mark Harrison, Zendesk)",
          "Workspace Invitation Links Expiring Cluster",
          "Redesign Workspace Member Invitation Flow Recommendation"
        ];
      } else {
        answer += `Analytics show stable trends for query themes. Related feedback logs indicate minor UX concerns but no critical risk factors. We will continue tracking incoming vectors.`;
        confidence = 88;
        evidence = [
          "Customer Pain Points General Vector Bank",
          "Knowledge Evolution timeline entry of May 2026"
        ];
      }

      set({ 
        reflectionAnswer: answer, 
        reflectionConfidence: confidence, 
        reflectionEvidence: evidence, 
        isThinking: false 
      });
    }, 1000);
  },

  createMentalModel: async (name, summary) => {
    // Optimistic local add
    const newModel: MentalModel = {
      id: `model-${Date.now()}`,
      name,
      summary,
      memory_coverage: parseFloat((Math.random() * 15 + 75).toFixed(1)),
      last_updated: new Date().toISOString()
    };
    set((state) => ({
      mentalModels: [...state.mentalModels, newModel],
      dashboardStats: {
        ...state.dashboardStats,
        activeMentalModels: state.dashboardStats.activeMentalModels + 1
      }
    }));

    fetch(`${BACKEND_URL}/api/models/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bank_id: 'default', name, source_query: name }),
      ...WRITE_OPTS,
    }).catch(() => console.warn('[useStore] Failed to save mental model in backend.'));
  },

  // Task Actions
  addTask: async (title, assignee, priority) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title,
      assignee,
      status: 'Open',
      priority
    };
    set((state) => ({ workspaceTasks: [newTask, ...state.workspaceTasks] }));

    fetch(`${BACKEND_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, assignee, priority }),
      ...WRITE_OPTS,
    }).catch(() => console.warn('[useStore] Failed to save task in backend.'));
  },

  updateTaskStatus: async (id, status) => {
    set((state) => ({
      workspaceTasks: state.workspaceTasks.map(t => t.id === id ? { ...t, status } : t)
    }));

    fetch(`${BACKEND_URL}/api/tasks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      ...WRITE_OPTS,
    }).catch(() => console.warn('[useStore] Failed to update task status in backend.'));
  },

  // Chat Actions
  sendAiMessage: async (message) => {
    if (!message.trim()) return;

    set((state) => ({
      aiChatHistory: [...state.aiChatHistory, { role: 'user', content: message, timestamp: new Date() }],
      isThinking: true
    }));

    try {
      const res = await fetch(`${BACKEND_URL}/api/memory/reflect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bank_id: 'default', question: message }),
        cache: 'no-store',
      });
      if (res.ok) {
        const result = await res.json();
        let content = `### AI Memory Reflection\n\n${result.answer}`;
        if (result.evidence && result.evidence.length > 0) {
          content += `\n\n**Supporting Evidence:**\n` + result.evidence.map((ev: string) => `* ${ev}`).join('\n');
        }
        set((state) => ({
          aiChatHistory: [
            ...state.aiChatHistory,
            { role: 'assistant', content, timestamp: new Date(), confidence: result.confidence }
          ],
          isThinking: false
        }));
        return;
      }
    } catch (e) {
      console.warn("[useStore] AI Chat query failed. Falling back to client completions.");
    }

    // Heuristics Fallback
    setTimeout(() => {
      let content = "";
      let confidence = 95;

      const lower = message.toLowerCase();
      if (lower.includes("payment") || lower.includes("stripe")) {
        content = "### Stripe Checkout Issues Summary\n\nI have retrieved 143 memory records regarding checkout failures. Here is the AI Reasoning Trace:\n\n* **Root Cause**: Thread-pool bottlenecks on Stripe webhooks (timeout rate: 12.4%).\n* **Revenue Risk**: $42,000 USD is currently gated.\n* **Recommendation**: Implement asynchronous webhook queueing (Priority: Critical).";
        confidence = 96;
      } else if (lower.includes("onboarding") || lower.includes("invite")) {
        content = "### Onboarding Friction Details\n\nLong-term hindsight reflection identifies two primary hurdles:\n\n1. Workspace registration invitation link expires in 2 hours.\n2. CSV templates fail when headers don't match exactly.\n\n* **Recommendation**: Increase token lifespan to 24 hours, and add format sanitization to file uploads.";
        confidence = 91;
      } else if (lower.includes("summarize") || lower.includes("month") || lower.includes("trends")) {
        content = "### Executive Monthly Intelligence Summary\n\n* **Total Ingested logs**: 1,245 (+12% MoM)\n* **Primary Clusters**: Stripe Gateway (Critical), Slack notifications delays (Medium).\n* **Average Sentiment**: Positive (72%), Neutral (20%), Negative (8%).\n* **AI Recommended Priority**: Action Stripe checkout update first.";
        confidence = 94;
      } else {
        content = `I have recalled relevant memory matrices for your query: "${message}". The long-term memory indexes indicate stable configurations with minor user requests regarding UI themes. I recommend referencing our Feature Board for details.`;
        confidence = 89;
      }

      set((state) => ({
        aiChatHistory: [
          ...state.aiChatHistory, 
          { role: 'assistant', content, timestamp: new Date(), confidence }
        ],
        isThinking: false
      }));
    }, 1200);
  },

  // Real-Time Simulator
  simulateFeedbackIngestion: async () => {
    // Simulate locally first for instant feedback, then sync to backend
    try {
      fetch(`${BACKEND_URL}/api/notifications/simulate`, { method: 'POST', ...WRITE_OPTS })
        .catch(() => {/* ignore */});
    } catch (e) { /* ignore */ }

    // Heuristics Fallback
    const sources: Feedback['source_type'][] = ['slack', 'discord', 'gmail', 'zendesk', 'hubspot', 'intercom', 'reddit', 'twitter'];
    const names = ['Evelyn Vance', 'Liam Brody', 'Siddharth Nair', 'Emma Watson', 'James Miller', 'Keiko Tanaka'];
    const issues = [
      "Mobile checkout button is hidden behind navigation bar",
      "Stripe payment failed on mobile client safari",
      "Gmail sync credentials rejected on secondary account",
      "Slack notifications for dashboard errors not triggering",
      "Zendesk ticket status is showing out of sync with workspace"
    ];
    
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomIssue = issues[Math.floor(Math.random() * issues.length)];
    
    const newFeedback: Feedback = {
      id: `feedback-live-${Date.now()}`,
      title: `Live Alert: ${randomIssue}`,
      content: `User report: "${randomIssue}". Ingested from {randomSource}. Connection status is healthy.`,
      source_type: randomSource,
      customer_name: randomName,
      customer_email: `${randomName.toLowerCase().replace(' ', '')}@livefeedback.com`,
      sentiment: 'negative',
      sentiment_score: -0.7,
      severity: Math.random() > 0.6 ? 'critical' : 'high',
      status: 'new',
      cluster_id: 'cluster-1',
      feature_tag: 'Mobile App',
      created_at: new Date().toISOString()
    };

    const newNotification = {
      id: `not-live-${Date.now()}`,
      title: `Critical feedback from ${randomName}`,
      message: randomIssue,
      type: 'ai' as const,
      read: false,
      time: 'Just now'
    };

    set((state) => {
      const currentStats = state.dashboardStats;
      const updatedIntegrations = state.integrations.map(int => 
        int.name.toLowerCase().includes(randomSource) 
          ? { ...int, records_synced: int.records_synced + 1, last_sync: 'Just now' }
          : int
      );

      return {
        feedbacks: [newFeedback, ...state.feedbacks],
        notifications: [newNotification, ...state.notifications],
        integrations: updatedIntegrations,
        dashboardStats: {
          ...currentStats,
          totalFeedback: currentStats.totalFeedback + 1,
          totalMemories: currentStats.totalMemories + 1,
          criticalTrendsCount: currentStats.criticalTrendsCount + (newFeedback.severity === 'critical' ? 1 : 0)
        }
      };
    });
  },

  // Toggle Connection Status
  toggleIntegration: async (id) => {
    // Optimistic toggle locally
    set((state) => ({
      integrations: state.integrations.map(int => 
        int.id === id 
          ? { ...int, status: int.status === 'Connected' ? 'Disconnected' : 'Connected', health: int.status === 'Connected' ? 'warning' : 'healthy' }
          : int
      )
    }));

    fetch(`${BACKEND_URL}/api/integrations/${id}/toggle`, { method: 'POST', ...WRITE_OPTS })
      .catch(() => console.warn('[useStore] Failed to toggle integration in backend.'));
  }
}));

// Automatically trigger sync fetch once imported client-side
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useStore.getState().fetchState();
  }, 200);
}
