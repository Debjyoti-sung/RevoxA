import { groqService } from '../groq/groqService';
import { promptManager } from '../prompts/promptManager';
import { ReasoningOutput, MemoryUnit } from '../../types/llm';
import { logger } from '../../utils/logger';

export class ReasoningEngine {
  /**
   * Generates a hidden, intermediate chain-of-thought logic path.
   * This handles conflict resolution and answer planning.
   */
  public async generateReasoningPlan(
    query: string,
    context: string,
    memories: MemoryUnit[]
  ): Promise<ReasoningOutput> {
    const memoryContents = memories.map(m => `(${m.category}) ${m.content}`);
    const messages = promptManager.compileReasoningPrompt(query, context, memoryContents);

    try {
      const response = await groqService.chatCompletion(messages, {
        temperature: 0.1, // low temperature for precise logical planning
        maxTokens: 1024,
      });

      // Parse reasoning format safely
      const parsed: ReasoningOutput = this.safeParseReasoning(response.content);
      logger.info('Reasoning plan compiled successfully.', 'REASONING_ENGINE', {
        stepsCount: parsed.plan.steps.length,
      });

      return parsed;
    } catch (error: any) {
      logger.error('Failed to generate reasoning path. Returning default fallback reasoning state.', error, 'REASONING_ENGINE');
      
      // Resilient fallback plan on error
      return {
        plan: {
          steps: ['Analyze query statement.', 'Formulate output answer using raw context state directly.'],
          evidenceEvaluation: 'Inference pipeline failure. Defaulting context relevance check to TRUE.',
          conflictResolution: 'none',
          plannedApproach: 'Context fallback'
        },
        instructions: 'Answer user query succinctly using context. Avoid referring to vector database errors.'
      };
    }
  }

  private safeParseReasoning(rawJson: string): ReasoningOutput {
    try {
      // Clean potential JSON markdown blocks if returned
      const cleanJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      return {
        plan: {
          steps: Array.isArray(parsed.plan?.steps) ? parsed.plan.steps : [],
          evidenceEvaluation: parsed.plan?.evidenceEvaluation || 'None',
          conflictResolution: parsed.plan?.conflictResolution || 'None',
          plannedApproach: parsed.plan?.plannedApproach || 'None',
        },
        instructions: parsed.instructions || 'Answer query directly based on context.',
      };
    } catch (e) {
      logger.warn('Failed parsing raw reasoning JSON content. Falling back.', 'REASONING_ENGINE');
      return {
        plan: {
          steps: ['Direct extraction from string'],
          evidenceEvaluation: 'Malformed payload JSON structure.',
          conflictResolution: 'none',
          plannedApproach: 'Parsing fallback'
        },
        instructions: 'Provide natural response answering query using raw context strings directly.'
      };
    }
  }
}

export const reasoningEngine = new ReasoningEngine();
export default reasoningEngine;
