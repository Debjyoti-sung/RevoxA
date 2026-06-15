import { ChatMessage } from '../../types/llm';

export class PromptManager {
  private static instance: PromptManager;

  private constructor() {}

  public static getInstance(): PromptManager {
    if (!PromptManager.instance) {
      PromptManager.instance = new PromptManager();
    }
    return PromptManager.instance;
  }

  /**
   * Builds the prompt configuration for the Intent Analysis Engine
   */
  public compileIntentPrompt(query: string, history: ChatMessage[] = []): ChatMessage[] {
    const systemPrompt = `You are the RevoxA Intent Detection Engine. Your job is to classify the user's input query into a structured JSON classification output.
Analyze the query and previous messages to determine the classification parameters.

Supported Intents:
- GENERAL_CHAT: Casual greeting, small talk, or generic conversation statements.
- MEMORY_QUERY: Requesting to recall, lookup, retrieve, search, or review their stored facts/memories.
- FACT_RETRIEVAL: Asking explicit factual questions about the system or external information.
- PROFILE_UPDATE: Supplying personal facts, update instructions, name corrections, workspace changes, or metadata preferences.
- TASK_REQUEST: Requesting task creations, issue resolutions, roadmap schedules, or ticket assignments.
- SEARCH_REQUEST: Asking to search vector repositories or databases for documents.
- REASONING_REQUEST: Requesting complex calculations, deep multi-step diagnostic reviews, or logic troubleshooting.
- SUMMARY_REQUEST: Asking to summarize a document, ticket, feed stream, or context logs.
- AGENT_REQUEST: Direct commands prompting autonomous tool runs.

Return STRICTLY a JSON object with this exact shape:
{
  "intent": "GENERAL_CHAT" | "MEMORY_QUERY" | "FACT_RETRIEVAL" | "PROFILE_UPDATE" | "TASK_REQUEST" | "SEARCH_REQUEST" | "REASONING_REQUEST" | "SUMMARY_REQUEST" | "AGENT_REQUEST",
  "confidence": 0.0 to 1.0,
  "requiresRetrieval": true/false (true if memory context helps answer the prompt),
  "requiresMemoryStore": true/false (true if the query contains profile/project updates that must be persisted for long-term recall),
  "keywords": ["word1", "word2"],
  "suggestedTools": ["tool1", "tool2"]
}`;

    const userContent = `User query: "${query}"
History Context: ${JSON.stringify(history.slice(-3))}`;

    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ];
  }

  /**
   * Builds prompt configuration for the Memory Extraction Engine
   */
  public compileExtractionPrompt(query: string, response: string): ChatMessage[] {
    const systemPrompt = `You are the RevoxA Cognitive Memory Extractor.
Analyze the user request and system output to identify any long-term profile parameters, user goals, projects, preferences, or core facts that must be committed to permanent vector memory.

Memory Categories:
- PROFILE: User name, email, workspace title, background.
- PREFERENCE: Code styling preferences, layout preferences, dashboard themes, formatting style.
- GOAL: Objectives user is working towards, sprint milestones, desired capabilities.
- PROJECT: Named initiatives, code repositories, workspace campaigns.
- TASK: Assigned issues, tickets, bugs, todo items.
- RELATIONSHIP: Coworker profiles, team hierarchies, customer groups.
- CONTEXT: Unique operating environment variables, localized servers, database parameters.
- KNOWLEDGE: Facts, API URLs, custom documentation references.

Evaluate each fact for long-term utility (1-10 scale). Ignore casual pleasantries, short-term conversational context, or trivial metrics.

Return STRICTLY a JSON object with this exact shape:
{
  "memories": [
    {
      "category": "PROFILE" | "PREFERENCE" | "GOAL" | "PROJECT" | "TASK" | "RELATIONSHIP" | "CONTEXT" | "KNOWLEDGE",
      "content": "Statement containing the clean, third-person factual memory to store (e.g. 'The user is planning to migrate checkout Stripe gateways during Sprint 4.')",
      "importance": 1 to 10,
      "metadata": { "context": "Stripe gateway migration" }
    }
  ]
}`;

    const userContent = `Turn analysis:
User Query: "${query}"
System Response: "${response}"`;

    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ];
  }

  /**
   * Compiles prompt context for the primary Reasoning & Planning Engine
   */
  public compileReasoningPrompt(
    query: string,
    context: string,
    memories: string[]
  ): ChatMessage[] {
    const systemPrompt = `You are the RevoxA Hidden Chain-of-Thought Reasoning Core.
You will plan how to address the user request by reviewing the context facts and retrieved memories.
Analyze the following parameters:
1. Evidence evaluation: Are the context details sufficient to answer? Are there missing parameters?
2. Conflict resolution: Do retrieved memories contradict the context? If yes, outline how to resolve.
3. Answer planning: Chart the step-by-step logic path to generate the response.

Your reasoning is completely hidden from the user. It serves as your internal thinking step.

Return STRICTLY a JSON object matching this structure:
{
  "plan": {
    "steps": ["Step 1:...", "Step 2:..."],
    "evidenceEvaluation": "Evaluation details...",
    "conflictResolution": "Describe if any contradiction is resolved, else write 'none'"
  },
  "instructions": "Direct system directives on how to compose the final response safely and accurately."
}`;

    const userContent = `User query: "${query}"
Retrieved Vector Memories:
${memories.map((m, idx) => `[Memory #${idx + 1}] ${m}`).join('\n') || 'None'}

Retrieved Application Context:
${context || 'None'}`;

    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ];
  }

  /**
   * Compiles prompt instructions for generating final response output
   */
  public compileResponsePrompt(
    query: string,
    reasoningInstructions: string,
    context: string
  ): ChatMessage[] {
    const systemPrompt = `You are the RevoxA Conversational Intelligence Copilot.
You will answer the user's query by executing the supplied Reasoning Instructions and leveraging the provided Context details.

Always follow these guidelines:
1. Be helpful, professional, and accurate.
2. Use markdown formatting where appropriate (bullet points, bold highlights, code blocks).
3. If citing facts from the context, list short numeric index citations (e.g., [1], [2]).
4. Maintain a clear and concise tone.

Reasoning Instructions to follow:
"${reasoningInstructions}"

Context:
"${context}"`;

    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query },
    ];
  }
}

export const promptManager = PromptManager.getInstance();
export default promptManager;
