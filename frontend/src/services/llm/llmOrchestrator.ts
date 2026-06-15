import { groqService } from '../groq/groqService';
import { promptManager } from '../prompts/promptManager';
import { contextBuilder } from '../memory/contextBuilder';
import { reasoningEngine } from '../reasoning/reasoningEngine';
import { memoryExtractor } from '../memory/memoryExtractor';
import { supabase } from '../../lib/supabase';
import {
  ChatMessage,
  IntentAnalysisResult,
  MemoryUnit,
  OrchestratorOutput,
  ReasoningOutput
} from '../../types/llm';
import { logger } from '../../utils/logger';

export class LLMOrchestrator {
  /**
   * Runs the complete request pipeline turn.
   */
  public async executePipeline(
    query: string,
    history: ChatMessage[] = [],
    userId?: string
  ): Promise<OrchestratorOutput> {
    const startTime = Date.now();
    logger.info(`Starting execution lifecycle for user query: "${query.substring(0, 60)}..."`, 'LLM_ORCHESTRATOR');

    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;
    let intentResult: IntentAnalysisResult | null = null;
    let activeMemories: MemoryUnit[] = [];
    let reasoningOutput: ReasoningOutput | null = null;
    let finalResponseText = '';
    let extractedMemories: MemoryUnit[] = [];

    try {
      // 1. Analyze Intent
      intentResult = await this.analyzeIntent(query, history);
      
      // 2. Memory Retrieval (if intent requires or prompts retrieval)
      if (intentResult.requiresRetrieval && userId) {
        activeMemories = await this.retrieveMemories(query, userId);
      }

      // 3. Assemble Prompt Context (Rank and filter memories)
      // Provide a mock system context or grab real database telemetry if available
      const systemTelemetry = 'Active workspace: default-dev. Server latency: normal. Qdrant vector index status: active.';
      const { contextString, usedMemories } = contextBuilder.assembleContext(
        query,
        activeMemories,
        systemTelemetry
      );

      // 4. Chain-of-Thought Reasoning
      reasoningOutput = await reasoningEngine.generateReasoningPlan(
        query,
        contextString,
        usedMemories
      );

      // 5. Generate Response (using Groq completions)
      const responseMessages = promptManager.compileResponsePrompt(
        query,
        reasoningOutput.instructions,
        contextString
      );

      const responseCompletion = await groqService.chatCompletion(responseMessages, {
        temperature: 0.7, // higher temperature for natural language generation
        maxTokens: 1024,
      });

      finalResponseText = responseCompletion.content;
      
      // Aggregate token usage metrics
      if (responseCompletion.usage) {
        totalPromptTokens += responseCompletion.usage.promptTokens;
        totalCompletionTokens += responseCompletion.usage.completionTokens;
      }

      // 6. Memory Extraction from Dialog Turn
      extractedMemories = await memoryExtractor.extractMemory(query, finalResponseText);

      // 7. Persist Extracted Memories to Vector Database
      if (intentResult.requiresMemoryStore && extractedMemories.length > 0 && userId) {
        await this.persistMemories(extractedMemories, userId);
      }

    } catch (error: any) {
      logger.error('Pipeline execution encountered a critical exception.', error, 'LLM_ORCHESTRATOR');
      finalResponseText = `I encountered an unexpected internal system error processing your intelligence telemetry: ${error.message}`;
    }

    const latencyMs = Date.now() - startTime;
    const tokensUsed = {
      promptTokens: totalPromptTokens,
      completionTokens: totalCompletionTokens,
      totalTokens: totalPromptTokens + totalCompletionTokens,
    };

    const estimatedCost = logger.calculateCost(tokensUsed);

    // Track execution telemetry
    logger.trackInference(groqService.constructor.name, {
      latencyMs,
      tokens: tokensUsed,
      cost: estimatedCost,
      model: 'gpt-oss-120b',
    });

    return {
      response: finalResponseText,
      citations: this.parseCitations(finalResponseText),
      extractedMemories,
      intent: intentResult?.intent || 'GENERAL_CHAT',
      metrics: {
        latencyMs,
        tokensUsed,
        estimatedCost,
      },
    };
  }

  /**
   * Internal wrapper to run Intent Detection Engine
   */
  private async analyzeIntent(query: string, history: ChatMessage[]): Promise<IntentAnalysisResult> {
    const messages = promptManager.compileIntentPrompt(query, history);
    
    try {
      const completion = await groqService.chatCompletion(messages, {
        temperature: 0.0,
        maxTokens: 256,
      });
      
      const cleanJson = completion.content.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      return {
        intent: parsed.intent || 'GENERAL_CHAT',
        confidence: parsed.confidence ?? 1.0,
        requiresRetrieval: parsed.requiresRetrieval ?? false,
        requiresMemoryStore: parsed.requiresMemoryStore ?? false,
        keywords: parsed.keywords || [],
        suggestedTools: parsed.suggestedTools || [],
      };
    } catch (e) {
      logger.warn('Failed parsing intent JSON outcome. Defaulting to GENERAL_CHAT.', 'LLM_ORCHESTRATOR');
      return {
        intent: 'GENERAL_CHAT',
        confidence: 0.9,
        requiresRetrieval: true, // conservative fallback
        requiresMemoryStore: true,
        keywords: [],
        suggestedTools: [],
      };
    }
  }

  /**
   * Fetches user-linked vector memories from Supabase
   */
  private async retrieveMemories(query: string, userId: string): Promise<MemoryUnit[]> {
    try {
      // In production, we execute vector match searches via RPC or RPC queries in Qdrant/Supabase PgVector.
      // Here is a production-ready Supabase query wrapper with error recovery safety checks:
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', userId)
        .limit(10);

      if (error) throw error;
      
      if (!data) return [];

      return data.map(item => ({
        id: item.id,
        category: item.category,
        content: item.content,
        importance: item.importance || 5,
        timestamp: item.created_at || new Date().toISOString(),
        metadata: item.metadata || {}
      }));
    } catch (error: any) {
      logger.error(`Database memory retrieval lookup error: ${error.message}. Returning empty log.`, error, 'LLM_ORCHESTRATOR');
      return [];
    }
  }

  /**
   * Persists extracted memory units to Supabase database
   */
  private async persistMemories(memories: MemoryUnit[], userId: string): Promise<void> {
    try {
      const records = memories.map(mem => ({
        user_id: userId,
        category: mem.category,
        content: mem.content,
        importance: mem.importance,
        metadata: mem.metadata,
        created_at: mem.timestamp || new Date().toISOString()
      }));

      const { error } = await supabase
        .from('memories')
        .insert(records);

      if (error) throw error;
      logger.info(`Successfully stored ${memories.length} memories into Supabase database.`, 'LLM_ORCHESTRATOR');
    } catch (error: any) {
      logger.error(`Failed storing memory records to database: ${error.message}`, error, 'LLM_ORCHESTRATOR');
    }
  }

  private parseCitations(text: string): string[] {
    const regex = /\[(\d+)\]/g;
    const citations = new Set<string>();
    let match;
    while ((match = regex.exec(text)) !== null) {
      citations.add(match[0]);
    }
    return Array.from(citations);
  }
}

export const llmOrchestrator = new LLMOrchestrator();
export default llmOrchestrator;
