import OpenAI from "openai";

const DEFAULT_RESUME_EXTRACT_MODEL = "meta-llama/llama-3.1-8b-instruct";
const DEFAULT_RESUME_GENERATE_MODEL = "meta-llama/llama-3.1-8b-instruct";

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
