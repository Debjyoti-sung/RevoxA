import { MemoryUnit } from '../../types/llm';

export interface ContextRankingStrategy {
  rank(memories: MemoryUnit[], query: string): MemoryUnit[];
}

// Simple Vector Similarity/Relevance Similarity heuristic ranking
export class RelevanceRankingStrategy implements ContextRankingStrategy {
  public rank(memories: MemoryUnit[], query: string): MemoryUnit[] {
    const queryTerms = query.toLowerCase().split(/\s+/);
    
    return memories
      .map(m => {
        let score = m.importance * 0.5; // base score on importance weight
        
        // Boost score based on keyword intersections with user query
        const contentLower = m.content.toLowerCase();
        queryTerms.forEach(term => {
          if (term.length > 2 && contentLower.includes(term)) {
            score += 2.0; // match boost
          }
        });

        return { memory: m, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(item => item.memory);
  }
}

export class ContextBuilder {
  private ranker: ContextRankingStrategy;
  private maxContextTokens: number = 4096; // budget limit threshold

  constructor(ranker?: ContextRankingStrategy) {
    this.ranker = ranker || new RelevanceRankingStrategy();
  }

  /**
   * Builds a unified, ranked, and compressed context string from memories and raw database context.
   */
  public assembleContext(
    query: string,
    rawMemories: MemoryUnit[],
    systemTelemetryContext: string = ''
  ): {
    contextString: string;
    usedMemories: MemoryUnit[];
  } {
    // 1. Deduplicate memories based on exact match content
    const uniqueMemories = this.deduplicate(rawMemories);

    // 2. Rank memories based on prompt relevance and base priority scores
    const rankedMemories = this.ranker.rank(uniqueMemories, query);

    // 3. Assemble and compress contexts inside window limits
    const usedMemories: MemoryUnit[] = [];
    let memoryStringAccumulator = '';
    
    // Allocate 50% budget to memories, 50% to telemetry
    for (const mem of rankedMemories) {
      const entry = `- [${mem.category}] ${mem.content}\n`;
      // Check approximate token length (4 chars = 1 token heuristic)
      if ((memoryStringAccumulator.length + entry.length) / 4 > this.maxContextTokens * 0.5) {
        break; // exceed memory budget allocation
      }
      memoryStringAccumulator += entry;
      usedMemories.push(mem);
    }

    // Heuristic compression on raw system context if needed
    const compressedTelemetry = this.compressText(systemTelemetryContext, this.maxContextTokens * 0.5);

    const contextString = `[PERSISTENT MEMORY MODULE]\n${memoryStringAccumulator || 'No active user memories stored.'}\n\n[SYSTEM STATE TELEMETRY]\n${compressedTelemetry || 'No system state telemetry provided.'}`;

    return {
      contextString,
      usedMemories
    };
  }

  private deduplicate(memories: MemoryUnit[]): MemoryUnit[] {
    const seen = new Set<string>();
    return memories.filter(m => {
      const norm = m.content.trim().toLowerCase();
      if (seen.has(norm)) return false;
      seen.add(norm);
      return true;
    });
  }

  /**
   * Compresses longer payload text details using character length constraints.
   */
  private compressText(text: string, tokenLimit: number): string {
    const charLimit = tokenLimit * 4;
    if (text.length <= charLimit) return text;
    
    // Simple compression: truncate and add marker
    return text.substring(0, charLimit) + '\n... [Context truncated for performance optimization]';
  }
}

export const contextBuilder = new ContextBuilder();
export default contextBuilder;
