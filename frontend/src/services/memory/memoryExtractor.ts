import { groqService } from '../groq/groqService';
import { promptManager } from '../prompts/promptManager';
import { MemoryUnit, MemoryCategory } from '../../types/llm';
import { logger } from '../../utils/logger';

export class MemoryExtractor {
  /**
   * Evaluates a chat turn and extracts potential long-term memories.
   */
  public async extractMemory(
    query: string,
    response: string
  ): Promise<MemoryUnit[]> {
    const messages = promptManager.compileExtractionPrompt(query, response);

    try {
      const completion = await groqService.chatCompletion(messages, {
        temperature: 0.1, // low temperature to ensure reliable JSON output
        maxTokens: 512,
      });

      const memories: MemoryUnit[] = this.safeParseMemories(completion.content);
      
      // Filter out low importance memories (e.g. importance score < 4) to ensure high-quality vector database storage
      const highQualityMemories = memories.filter(m => m.importance >= 4);

      if (highQualityMemories.length > 0) {
        logger.info(`Extracted ${highQualityMemories.length} high-quality memories from interaction.`, 'MEMORY_EXTRACTOR');
      }

      return highQualityMemories;
    } catch (error: any) {
      logger.error('Failed to extract memories from interaction.', error, 'MEMORY_EXTRACTOR');
      return []; // Return empty array on failure
    }
  }

  private safeParseMemories(rawJson: string): MemoryUnit[] {
    try {
      const cleanJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      if (!Array.isArray(parsed.memories)) return [];

      return parsed.memories.map((m: any) => ({
        category: this.validateCategory(m.category),
        content: String(m.content || '').trim(),
        importance: Math.min(Math.max(Number(m.importance || 5), 1), 10),
        timestamp: new Date().toISOString(),
        metadata: m.metadata || {}
      }));
    } catch (e) {
      logger.warn('Failed parsing extracted memories JSON payload.', 'MEMORY_EXTRACTOR');
      return [];
    }
  }

  private validateCategory(category: string): MemoryCategory {
    const validCategories: MemoryCategory[] = [
      'PROFILE', 'PREFERENCE', 'GOAL', 'PROJECT', 'TASK', 'RELATIONSHIP', 'CONTEXT', 'KNOWLEDGE'
    ];
    const upper = String(category).toUpperCase() as MemoryCategory;
    if (validCategories.includes(upper)) return upper;
    return 'CONTEXT'; // Default category fallback
  }
}

export const memoryExtractor = new MemoryExtractor();
export default memoryExtractor;
