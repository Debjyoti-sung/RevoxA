import { env } from '@/src/config/env';

export class ResendClient {
  private static instance: ResendClient;
  private apiKey: string;

  private constructor() {
    this.apiKey = env.RESEND_API_KEY || '';
  }

  public static getInstance(): ResendClient {
    if (!ResendClient.instance) {
      ResendClient.instance = new ResendClient();
    }
    return ResendClient.instance;
  }

  public async sendEmail(to: string, subject: string, html: string, from = 'Memora AI <onboarding@resend.dev>') {
    if (!this.apiKey || this.apiKey.includes('mock')) {
      console.log(`[Resend Mock] Email to: ${to}, Subject: ${subject}`);
      return { id: `mock-email-${Date.now()}` };
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend Email Error: ${err}`);
    }

    return res.json();
  }
}

export const resend = ResendClient.getInstance();
