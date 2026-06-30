import { env } from '@/src/config/env';

export class AnthropicClient {
  private static instance: AnthropicClient;
  private apiKey: string;

  private constructor() {
    this.apiKey = env.ANTHROPIC_API_KEY || '';
  }

  public static getInstance(): AnthropicClient {
    if (!AnthropicClient.instance) {
      AnthropicClient.instance = new AnthropicClient();
    }
    return AnthropicClient.instance;
  }

  public async complete(prompt: string, model = 'claude-3-opus-20240229') {
    if (!this.apiKey || this.apiKey.includes('mock')) {
      return {
        content: [{ text: 'Mock Anthropic response: API key is not configured.' }],
      };
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic API Error: ${err}`);
    }

    return res.json();
  }
}

export const anthropic = AnthropicClient.getInstance();
