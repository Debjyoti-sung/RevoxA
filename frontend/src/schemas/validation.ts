import { z } from 'zod';

// Zod Schema representing the Intent Analyzer output structures
export const IntentSchema = z.object({
  intent: z.enum([
    'GENERAL_CHAT',
    'MEMORY_QUERY',
    'FACT_RETRIEVAL',
    'PROFILE_UPDATE',
    'TASK_REQUEST',
    'SEARCH_REQUEST',
    'REASONING_REQUEST',
    'SUMMARY_REQUEST',
    'AGENT_REQUEST'
  ]),
  confidence: z.number().min(0.0).max(1.0),
  requiresRetrieval: z.boolean(),
  requiresMemoryStore: z.boolean(),
  keywords: z.array(z.string()),
  suggestedTools: z.array(z.string())
});

// Zod Schema representing single extracted user memories
export const MemoryUnitSchema = z.object({
  category: z.enum([
    'PROFILE',
    'PREFERENCE',
    'GOAL',
    'PROJECT',
    'TASK',
    'RELATIONSHIP',
    'CONTEXT',
    'KNOWLEDGE'
  ]),
  content: z.string().min(5),
  importance: z.number().min(1).max(10),
  metadata: z.record(z.any()).optional()
});

// Zod Schema representing multiple extracted memories returned in an LLM turn
export const MemoryExtractionSchema = z.object({
  memories: z.array(MemoryUnitSchema)
});

// Zod Schema representing internal reasoning planners
export const ReasoningPlanSchema = z.object({
  plan: z.object({
    steps: z.array(z.string()),
    evidenceEvaluation: z.string(),
    conflictResolution: z.string().optional()
  }),
  instructions: z.string()
});
