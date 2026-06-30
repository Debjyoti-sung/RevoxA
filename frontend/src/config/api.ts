export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  STATE: '/api/state',
  FEEDBACK: {
    BASE: '/api/feedback',
    UPLOAD: '/api/feedback/upload',
    UPDATE_STATUS: (id: string) => `/api/feedback/${id}/status`,
    DELETE: (id: string) => `/api/feedback/${id}`,
  },
  MEMORY: {
    RETAIN: '/api/memory/retain',
    RECALL: '/api/memory/recall',
    REFLECT: '/api/memory/reflect',
  },
  INSIGHTS: {
    GENERATE: '/api/insights/generate',
  },
  MODELS: {
    BASE: '/api/models',
    CREATE: '/api/models/create',
  },
  RECOMMENDATIONS: {
    RESOLVE: (id: string) => `/api/recommendations/${id}`,
  },
  TASKS: {
    BASE: '/api/tasks',
    UPDATE_STATUS: (id: string) => `/api/tasks/${id}/status`,
  },
  INTEGRATIONS: {
    TOGGLE: (id: string) => `/api/integrations/${id}/toggle`,
  },
  NOTIFICATIONS: {
    READ_ALL: '/api/notifications/read-all',
    SIMULATE: '/api/notifications/simulate',
    DELETE: (id: string) => `/api/notifications/${id}`,
  },
};
