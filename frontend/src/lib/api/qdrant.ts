import { env } from '@/src/config/env';

export class QdrantClient {
  private static instance: QdrantClient;
  private url: string;
  private apiKey: string;

  private constructor() {
    this.url = env.QDRANT_URL || '';
    this.apiKey = env.QDRANT_API_KEY || '';
  }

  public static getInstance(): QdrantClient {
    if (!QdrantClient.instance) {
      QdrantClient.instance = new QdrantClient();
    }
    return QdrantClient.instance;
  }

  public async upsertPoints(collectionName: string, points: any[]) {
    if (!this.url) {
      return { status: 'mocked', message: 'Qdrant not configured' };
    }
    const res = await fetch(`${this.url}/collections/${collectionName}/points`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey,
      },
      body: JSON.stringify({ points }),
    });
    return res.json();
  }

  public async searchPoints(collectionName: string, vector: number[], limit = 5) {
    if (!this.url) {
      return { result: [] };
    }
    const res = await fetch(`${this.url}/collections/${collectionName}/points/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey,
      },
      body: JSON.stringify({ vector, limit, with_payload: true }),
    });
    return res.json();
  }
}

export const qdrant = QdrantClient.getInstance();
