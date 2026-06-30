import { env } from '@/src/config/env';

export class Hindsight {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: { apiKey?: string; baseUrl?: string }) {
    this.apiKey = config.apiKey || '';
    this.baseUrl = config.baseUrl || 'https://api.hindsight.vectorize.io';
  }

  public async retain(bankId: string, content: string) {
    if (!this.apiKey || this.apiKey.includes('mock')) {
      return { status: 'success', id: `mock-mem-${Date.now()}` };
    }
    const res = await fetch(`${this.baseUrl}/v1/memories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ bank_id: bankId, content }),
    });
    return res.json();
  }

  public async recall(bankId: string, query: string) {
    if (!this.apiKey || this.apiKey.includes('mock')) {
      return { items: [], confidence: 0 };
    }
    const res = await fetch(`${this.baseUrl}/v1/memories/recall`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ bank_id: bankId, query }),
    });
    return res.json();
  }
}

export const hindsight = new Hindsight({
  apiKey: env.HINDSIGHT_API_KEY,
  baseUrl: env.HINDSIGHT_BASE_URL,
});
