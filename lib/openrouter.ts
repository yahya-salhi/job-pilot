import OpenAI from "openai";

const DEFAULT_RESUME_EXTRACT_MODEL = "meta-llama/llama-3.1-8b-instruct";
const DEFAULT_RESUME_GENERATE_MODEL = "meta-llama/llama-3.1-8b-instruct";
const DEFAULT_SCORING_MODEL = "openai/gpt-4o";

export function getResumeExtractModel(): string {
  return (
    process.env.OPENROUTER_RESUME_EXTRACT_MODEL ?? DEFAULT_RESUME_EXTRACT_MODEL
  );
}

export function getResumeGenerateModel(): string {
  return (
    process.env.OPENROUTER_RESUME_GENERATE_MODEL ?? DEFAULT_RESUME_GENERATE_MODEL
  );
}

export function getScoringModel(): string {
  return process.env.OPENROUTER_SCORING_MODEL ?? DEFAULT_SCORING_MODEL;
}

export function createOpenRouterClient(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });
}

type CallLLMOptions = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

type CallLLMResult =
  | { success: true; content: string }
  | { success: false; error: string };

export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  opts?: CallLLMOptions,
): Promise<CallLLMResult> {
  let openrouter: OpenAI;
  try {
    openrouter = createOpenRouterClient();
  } catch {
    return { success: false, error: "AI is not configured. Contact support." };
  }

  try {
    const response = await openrouter.chat.completions.create({
      model: opts?.model ?? getScoringModel(),
      response_format: { type: "json_object" },
      temperature: opts?.temperature ?? 0.3,
      ...(opts?.maxTokens !== undefined ? { max_tokens: opts.maxTokens } : {}),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { success: false, error: "AI returned an empty response." };
    }

    return { success: true, content };
  } catch (error) {
    console.error("[openrouter/callLLM]", error);
    return {
      success: false,
      error: "AI request failed. Please try again.",
    };
  }
}
