export type ModelCapability =
  | "scoring"
  | "research"
  | "resume-extract"
  | "resume-generate";

export type LLMExtractOptions = {
  capability?: ModelCapability;
  temperature?: number;
  maxTokens?: number;
};

export type LLMResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface ILLMProvider {
  extractJson<T>(
    system: string,
    user: string,
    validate: (raw: unknown) => T | null,
    opts?: LLMExtractOptions,
  ): Promise<LLMResult<T>>;

  chat(
    system: string,
    user: string,
    opts?: LLMExtractOptions,
  ): Promise<LLMResult<string>>;

  modelFor(capability: ModelCapability): string;
}
