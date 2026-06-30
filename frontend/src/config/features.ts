export const FEATURES = {
  ENABLE_AI_INSIGHTS: process.env.ENABLE_AI_INSIGHTS === 'true' || process.env.NEXT_PUBLIC_ENABLE_AI_INSIGHTS === 'true' || true,
  ENABLE_MEMORY_GRAPH: process.env.ENABLE_MEMORY_GRAPH === 'true' || process.env.NEXT_PUBLIC_ENABLE_MEMORY_GRAPH === 'true' || true,
  ENABLE_REPORTS: process.env.ENABLE_REPORTS === 'true' || process.env.NEXT_PUBLIC_ENABLE_REPORTS === 'true' || true,
};
