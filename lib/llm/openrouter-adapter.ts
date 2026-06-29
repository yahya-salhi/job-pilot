import OpenAI from "openai";
import type { ILLMProvider, LLMExtractOptions, LLMResult, ModelCapability } from "@/types/llm-provider";

const MODEL_DEFAULTS: Record<ModelCapability, string> = {
  scoring: "openai/gpt-4o",
  research: "meta-llama/llama-3.1-8b-instruct",
  "resume-extract": "meta-llama/llama-3.1-8b-instruct",
  "resume-generate": "meta-llama/llama-3.1-8b-instruct",
};

function resolveModel(capability: ModelCapability): string {
  const envMap: Record<ModelCapability, string | undefined> = {
    scoring: process.env.OPENROUTER_SCORING_MODEL,
    research: process.env.OPENROUTER_RESEARCH_MODEL,
    "resume-extract": process.env.OPENROUTER_RESUME_EXTRACT_MODEL,
    "resume-generate": process.env.OPENROUTER_RESUME_GENERATE_MODEL,
  };
  return envMap[capability] ?? MODEL_DEFAULTS[capability];
}

function safeParseJson<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export class OpenRouterAdapter implements ILLMProvider {
  private client: OpenAI | null = null;

  private getClient(): OpenAI {
    if (!this.client) {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY is not configured.");
      }
      this.client = new OpenAI({
        apiKey,
        baseURL: "https://openrouter.ai/api/v1",
      });
    }
    return this.client;
  }

  modelFor(capability: ModelCapability): string {
    return resolveModel(capability);
  }

  async extractJson<T>(
    system: string,
    user: string,
    validate: (raw: unknown) => T | null,
    opts?: LLMExtractOptions,
  ): Promise<LLMResult<T>> {
    const result = await this.callLLM(system, user, opts);
    if (!result.success) return result;

    const parsed = safeParseJson(result.data, null);
    if (!parsed) {
      return { success: false, error: "AI returned invalid JSON." };
    }

    const data = validate(parsed);
    if (!data) {
      return { success: false, error: "AI response failed validation." };
    }

    return { success: true, data };
  }

  async chat(
    system: string,
    user: string,
    opts?: LLMExtractOptions,
  ): Promise<LLMResult<string>> {
    return this.callLLM(system, user, opts);
  }

  private async callLLM(
    system: string,
    user: string,
    opts?: LLMExtractOptions,
  ): Promise<LLMResult<string>> {
    let openrouter: OpenAI;
    try {
      openrouter = this.getClient();
    } catch {
      return { success: false, error: "AI is not configured. Contact support." };
    }

    const capability = opts?.capability ?? "scoring";

    try {
      const response = await openrouter.chat.completions.create({
        model: opts?.capability ? resolveModel(opts.capability) : MODEL_DEFAULTS.scoring,
        response_format: { type: "json_object" },
        temperature: opts?.temperature ?? 0.3,
        ...(opts?.maxTokens !== undefined ? { max_tokens: opts.maxTokens } : {}),
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return { success: false, error: "AI returned an empty response." };
      }

      return { success: true, data: content };
    } catch (error) {
      console.error("[openrouter/callLLM]", error);
      return {
        success: false,
        error: "AI request failed. Please try again.",
      };
    }
  }
}
