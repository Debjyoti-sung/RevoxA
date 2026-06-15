export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatMessage {
  role: MessageRole;
  content: string;
  name?: string;
}

export interface LLMConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stream?: boolean;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface CostTracker {
  promptCost: number;
  completionCost: number;
  totalCost: number;
}

export interface LLMResponse {
  content: string;
  usage?: TokenUsage;
  model: string;
}

// Intent Analysis Categorizations
export type IntentType =
  | 'GENERAL_CHAT'
  | 'MEMORY_QUERY'
  | 'FACT_RETRIEVAL'
  | 'PROFILE_UPDATE'
  | 'TASK_REQUEST'
  | 'SEARCH_REQUEST'
  | 'REASONING_REQUEST'
  | 'SUMMARY_REQUEST'
  | 'AGENT_REQUEST';

export interface IntentAnalysisResult {
  intent: IntentType;
  confidence: number;
  requiresRetrieval: boolean;
  requiresMemoryStore: boolean;
  keywords: string[];
  suggestedTools: string[];
}

// Memory System Interfaces
export type MemoryCategory =
  | 'PROFILE'
  | 'PREFERENCE'
  | 'GOAL'
  | 'PROJECT'
  | 'TASK'
  | 'RELATIONSHIP'
  | 'CONTEXT'
  | 'KNOWLEDGE';

export interface MemoryUnit {
  id?: string;
  category: MemoryCategory;
  content: string;
  importance: number; // 1-10 scale
  timestamp: string;
  metadata?: Record<string, any>;
}

// Reasoning Engine Outputs
export interface ReasoningPlan {
  steps: string[];
  conflictResolution?: string;
  evidenceEvaluation: string;
  plannedApproach: string;
}

export interface ReasoningOutput {
  plan: ReasoningPlan;
  instructions: string;
}

// Final Orchestrator Response
export interface OrchestratorOutput {
  response: string;
  citations: string[];
  extractedMemories: MemoryUnit[];
  intent: IntentType;
  metrics: {
    latencyMs: number;
    tokensUsed?: TokenUsage;
    estimatedCost?: number;
  };
}
