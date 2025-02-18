export interface ToolCall {
  id: string;
  name: string;
  arguments: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: string;
}

export interface ChatMessage {
  role: string;
  content: string;
  name: string;
  toolCallId: string;
  toolCalls: Array<ToolCall>;
}

export interface LLMChatRequest {
  mode: BigInt;
  modelCID: string;
  messages: Array<ChatMessage>;
  tools?: Array<ToolDefinition>;
  toolChoice?: string;
  maxTokens: BigInt;
  stopSequence: Array<string>;
  temperature: BigInt;
}

export interface LLMChatResponse {
  finishReason: string;
  message: ChatMessage;
}

/**
 * ```ts
 * [string, string, string]
 * ```
 */
export type ToolCallArray = [string, string, string];

/**
 * ```ts
 * [string, string, string, string, ToolCallArray[]]
 * ```
 */
export type ChatMessageArray = [string, string, string, string, Array<ToolCallArray>];

/**
 * ```ts
 * [string, ChatMessageArray]
 * ```
 */
export type LLMChatResponseArray = [string, ChatMessageArray];
