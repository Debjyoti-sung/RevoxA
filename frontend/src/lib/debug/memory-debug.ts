export interface MemoryDebugState {
  memoryEngineActive: boolean;
  vectorStoreConnected: boolean;
  retainCalled: boolean;
  recallCalled: boolean;
  memoriesStored: number;
  memoriesRetrieved: number;
  topSimilarityScore: number;
  recallLatencyMs: number;
  embeddingModel: string;
  memoryType: string;
  lastQuery: string;
  lastStoredMemory: string;
  retrievedMemories: {
    content: string;
    score: number;
  }[];
}

const DEFAULT_STATE: MemoryDebugState = {
  memoryEngineActive: true,
  vectorStoreConnected: true,
  retainCalled: false,
  recallCalled: false,
  memoriesStored: 4890, // Match default dashboardStats memories
  memoriesRetrieved: 0,
  topSimilarityScore: 0,
  recallLatencyMs: 0,
  embeddingModel: 'GPT-OSS-120B (Groq)',
  memoryType: 'Semantic',
  lastQuery: '',
  lastStoredMemory: '',
  retrievedMemories: [],
};

let currentState: MemoryDebugState = { ...DEFAULT_STATE };
const listeners = new Set<(state: MemoryDebugState) => void>();

export const memoryDebugManager = {
  getState(): MemoryDebugState {
    return currentState;
  },

  updateState(updates: Partial<MemoryDebugState>) {
    currentState = { ...currentState, ...updates };
    listeners.forEach((listener) => listener(currentState));
  },

  subscribe(listener: (state: MemoryDebugState) => void) {
    listeners.add(listener);
    // Call listener immediately with current state
    listener(currentState);
    return () => {
      listeners.delete(listener);
    };
  },

  reset() {
    currentState = { ...DEFAULT_STATE };
    listeners.forEach((listener) => listener(currentState));
  },

  /**
   * Safe utility to copy debugging data payload to the user clipboard.
   */
  async copyDebugDataToClipboard(): Promise<boolean> {
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard) {
        return false;
      }
      
      const debugPayload = {
        memoryEngineActive: currentState.memoryEngineActive,
        vectorStoreConnected: currentState.vectorStoreConnected,
        retainCalled: currentState.retainCalled,
        recallCalled: currentState.recallCalled,
        memoriesStored: currentState.memoriesStored,
        memoriesRetrieved: currentState.memoriesRetrieved,
        topScore: currentState.topSimilarityScore,
        latency: currentState.recallLatencyMs,
        lastQuery: currentState.lastQuery,
        lastStoredMemory: currentState.lastStoredMemory,
        retrievedMemories: currentState.retrievedMemories,
      };

      await navigator.clipboard.writeText(JSON.stringify(debugPayload, null, 2));
      return true;
    } catch (e) {
      console.error('Failed to copy debug information to clipboard:', e);
      return false;
    }
  }
};

export default memoryDebugManager;
