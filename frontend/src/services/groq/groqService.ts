import { ChatMessage, LLMConfig, LLMResponse, TokenUsage } from '../../types/llm';
import { logger } from '../../utils/logger';

export class GroqService {
  private apiKey: string;
  private baseUrl: string = 'https://api.groq.com/openai/v1';
  private defaultModel: string = 'gpt-oss-120b';

  constructor() {
    this.apiKey = 
      process.env.GROQ_API_KEY || 
      process.env.NEXT_PUBLIC_GROQ_API_KEY || 
      '';
      
    if (!this.apiKey) {
      logger.warn('Groq API Key is not configured. Requests will fall back to mock returns in sandbox mode.', 'GROQ_SERVICE');
    }
  }

  /**
   * Executes a chat completion request to Groq with robust retries, timeout management, and rate limit handling.
   */
  public async chatCompletion(
    messages: ChatMessage[],
    config: Partial<LLMConfig> = {}
  ): Promise<LLMResponse> {
    const model = config.model || this.defaultModel;
    const temperature = config.temperature ?? 0.2;
    const maxTokens = config.maxTokens ?? 2048;

    // Local fallback for testing if key is empty
    if (!this.apiKey || this.apiKey.includes('mock-')) {
      return this.generateMockResponse(messages, model);
    }

    const maxRetries = 3;
    let attempt = 0;
    let delay = 1000; // start with 1 second delay

    while (attempt < maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second API timeout

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens: maxTokens,
            response_format: config.stream ? undefined : { type: 'json_object' }, // Support JSON mode directly
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.status === 429) {
          attempt++;
          logger.warn(`Rate limit hit (429) on Groq. Retrying in ${delay}ms (Attempt ${attempt}/${maxRetries})`, 'GROQ_SERVICE');
          await this.sleep(delay);
          delay *= 2; // exponential backoff
          continue;
        }

        if (!response.ok) {
          const textError = await response.text();
          throw new Error(`Groq API returned HTTP error ${response.status}: ${textError}`);
        }

        const data = await response.json();
        
        const content = data.choices?.[0]?.message?.content || '';
        const usage: TokenUsage = {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        };

        return {
          content,
          usage,
          model,
        };
      } catch (error: any) {
        attempt++;
        if (error.name === 'AbortError') {
          logger.error(`Request timed out on Groq. Attempt ${attempt}/${maxRetries}`, error, 'GROQ_SERVICE');
        } else {
          logger.error(`Error in Groq chatCompletion. Attempt ${attempt}/${maxRetries}`, error, 'GROQ_SERVICE');
        }

        if (attempt >= maxRetries) {
          throw new Error(`Failed to fetch chat completion from Groq after ${maxRetries} attempts. Original error: ${error.message}`);
        }
        await this.sleep(delay);
        delay *= 2;
      }
    }

    throw new Error('Unreachable state in Groq Service completion loop.');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Safe mock generator for development/sandbox mode when API key is missing.
   */
  private generateMockResponse(messages: ChatMessage[], model: string): LLMResponse {
    logger.info('API keys missing or running in sandbox mode; producing mock completion.', 'GROQ_SERVICE');
    const userMessage = messages[messages.length - 1]?.content || '';
    
    let content = '';
    
    // Basic heuristics to make mock look intelligent and return valid JSON where expected
    if (userMessage.includes('intent') || userMessage.includes('INTENT')) {
      content = JSON.stringify({
        intent: "GENERAL_CHAT",
        confidence: 0.95,
        requiresRetrieval: false,
        requiresMemoryStore: false,
        keywords: ["hello", "chat"],
        suggestedTools: []
      });
    } else if (userMessage.includes('extract') || userMessage.includes('memory') || userMessage.includes('MEMORY')) {
      content = JSON.stringify({
        memories: [
          {
            category: "PREFERENCE",
            content: "User prefers clean dashboard UI overlays.",
            importance: 5,
            timestamp: new Date().toISOString()
          }
        ]
      });
    } else if (userMessage.includes('reason') || userMessage.includes('plan')) {
      content = JSON.stringify({
        plan: {
          steps: ["Step 1: Check existing profile info.", "Step 2: Compare input statement with seed database context."],
          evidenceEvaluation: "No conflicting facts detected in reference logs.",
          plannedApproach: "Formulate concise overview mapping Stripe webhook lockups."
        },
        instructions: "Render a short bullet list specifying resolution steps."
      });
    } else {
      content = JSON.stringify({
        response: "Hello! This is a Sandbox environment response. To interact with Groq's GPT-OSS-120B model live, please configure GROQ_API_KEY in your local workspace environment.",
        citations: [],
        suggestions: ["How do I configure my environment keys?", "Can you explain RevoxA memory vector storage?"]
      });
    }

    return {
      content,
      model,
      usage: {
        promptTokens: 150,
        completionTokens: 80,
        totalTokens: 230,
      },
    };
  }
}

export const groqService = new GroqService();
export default groqService;
