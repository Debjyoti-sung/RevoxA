import { hindsight } from '@/src/lib/api/hindsight';
import { qdrant } from '@/src/lib/api/qdrant';

export async function storeMemory(bankId: string, content: string) {
  // 1. Store in Hindsight
  const hsResult = await hindsight.retain(bankId, content);
  
  // 2. Mock vector upsert in Qdrant (if Qdrant URL is set)
  await qdrant.upsertPoints('memories', [
    {
      id: Date.now(),
      vector: Array.from({ length: 1536 }, () => Math.random()),
      payload: { bankId, content, created_at: new Date().toISOString() }
    }
  ]);

  return hsResult;
}

export async function recallMemory(bankId: string, query: string) {
  return hindsight.recall(bankId, query);
}
