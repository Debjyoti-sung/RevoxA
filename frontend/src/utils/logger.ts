import { TokenUsage } from '../types/llm';

export interface LogMetrics {
  latencyMs: number;
  tokens?: TokenUsage;
  cost?: number;
  model?: string;
  metadata?: Record<string, any>;
}

export class TelemetryLogger {
  private static instance: TelemetryLogger;
  
  // Cost matrix per 1M tokens (GPT-OSS-120B is represented in pricing terms similar to standard LLMs)
  // For GPT-OSS-120B on Groq, cost is set to a representative value or configurable.
  private readonly PRICE_PER_1M_PROMPT = 0.50; // $0.50 per 1M prompt tokens
  private readonly PRICE_PER_1M_COMPLETION = 1.50; // $1.50 per 1M completion tokens

  private constructor() {}

  public static getInstance(): TelemetryLogger {
    if (!TelemetryLogger.instance) {
      TelemetryLogger.instance = new TelemetryLogger();
    }
    return TelemetryLogger.instance;
  }

  public info(message: string, context?: string, metadata?: any) {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] [${timestamp}] [${context || 'SYSTEM'}] ${message}`, metadata ? JSON.stringify(metadata) : '');
  }

  public warn(message: string, context?: string, metadata?: any) {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] [${timestamp}] [${context || 'SYSTEM'}] ${message}`, metadata ? JSON.stringify(metadata) : '');
  }

  public error(message: string, error?: any, context?: string) {
    const timestamp = new Date().toISOString();
    console.error(
      `[ERROR] [${timestamp}] [${context || 'SYSTEM'}] ${message}`,
      error?.stack || error || ''
    );
  }

  public trackInference(model: string, metrics: LogMetrics) {
    const timestamp = new Date().toISOString();
    const cost = metrics.cost ?? this.calculateCost(metrics.tokens);
    
    console.log(
      `[METRIC] [${timestamp}] [INFERENCE] Model: ${model} | Latency: ${metrics.latencyMs}ms | Tokens: ${metrics.tokens?.totalTokens || 0} (${metrics.tokens?.promptTokens || 0} prompt, ${metrics.tokens?.completionTokens || 0} completion) | Estimated Cost: $${cost.toFixed(6)}`
    );
  }

  public calculateCost(tokens?: TokenUsage): number {
    if (!tokens) return 0;
    const promptCost = (tokens.promptTokens / 1000000) * this.PRICE_PER_1M_PROMPT;
    const completionCost = (tokens.completionTokens / 1000000) * this.PRICE_PER_1M_COMPLETION;
    return promptCost + completionCost;
  }
}

export const logger = TelemetryLogger.getInstance();
export default logger;
