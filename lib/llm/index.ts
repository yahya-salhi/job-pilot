import { OpenRouterAdapter } from "./openrouter-adapter";
import type { ILLMProvider } from "@/types/llm-provider";

let _instance: ILLMProvider | null = null;

export function createLLMProvider(): ILLMProvider {
  if (!_instance) {
    _instance = new OpenRouterAdapter();
  }
  return _instance;
}

export const llm: ILLMProvider = createLLMProvider();
