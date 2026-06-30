import { openai } from '@/src/lib/api/openai';
import { anthropic } from '@/src/lib/api/anthropic';

export async function generateTextWithOpenAI(prompt: string) {
  const result = await openai.chat([
    { role: 'system', content: 'You are Memora AI Customer Feedback Intelligence copilot.' },
    { role: 'user', content: prompt }
  ]);
  return result.choices?.[0]?.message?.content || '';
}

export async function generateTextWithAnthropic(prompt: string) {
  const result = await anthropic.complete(prompt);
  return result.content?.[0]?.text || '';
}
