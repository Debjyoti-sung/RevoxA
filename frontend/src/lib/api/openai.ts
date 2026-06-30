import { env } from '@/src/config/env';

export class OpenAIClient {
  private static instance: OpenAIClient;
  private apiKey: string;

  private constructor() {
    this.apiKey = env.OPENAI_API_KEY || '';
  }

  public static getInstance(): OpenAIClient {
    if (!OpenAIClient.instance) {
      OpenAIClient.instance = new OpenAIClient();
    }
    return OpenAIClient.instance;
  }

  public async chat(messages: { role: string; content: string }[], model = 'gpt-4-turbo') {
    if (!this.apiKey || this.apiKey.includes('mock')) {
      return {
        choices: [
          {
            message: {
              role: 'assistant',
              content: 'Mock OpenAI response: API key is not configured or is running in mock mode.',
            },
          },
        ],
      };
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API Error: ${err}`);
    }

    return res.json();
  }
}

export const openai = OpenAIClient.getInstance();
