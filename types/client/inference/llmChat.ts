export interface ToolCall {
  id: string;
  name: string;
  arguments: string;
}

export interface ChatMessage {
  role: string;
  content: string;
  name: string;
  toolCallId: string;
  toolCalls: Array<ToolCall>;
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
