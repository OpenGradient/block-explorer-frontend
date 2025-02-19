export interface LLMCompletionRequest {
  mode: bigint;
  modelCID: string;
  prompt: string;
  maxTokens: bigint;
  stopSequence: Array<string>;
  temperature: bigint;
}

export interface LLMCompletionResponse {
  answer: string;
}

/**
 * ```ts
 * [string]
 * ```
 */
export type LLMCompletionResponseArray = [string];
