import type { ILLMProvider, LLMExtractOptions, LLMResult, ModelCapability } from "@/types/llm-provider";

export class StubLLMProvider implements ILLMProvider {
  constructor(
    private extractResponses: Map<string, unknown> = new Map(),
  ) {}

  onExtractJson(capability: string, data: unknown): this {
    this.extractResponses.set(capability, data);
    return this;
  }

  async extractJson<T>(
    _system: string,
    _user: string,
    validate: (raw: unknown) => T | null,
    opts?: LLMExtractOptions,
  ): Promise<LLMResult<T>> {
    const key = opts?.capability ?? "scoring";
    const canned = this.extractResponses.get(key);

    if (canned === undefined) {
      return { success: false, error: `No stub response for capability "${key}"` };
    }

    const data = validate(canned);
    if (!data) {
      return { success: false, error: "Stub data failed validation." };
    }

    return { success: true, data };
  }

  async chat(
    _system: string,
    _user: string,
    _opts?: LLMExtractOptions,
  ): Promise<LLMResult<string>> {
    return { success: true, data: "stubbed response" };
  }

  modelFor(capability: ModelCapability): string {
    return `stub-${capability}`;
  }
}
