import type {
  ToolCallArray,
  ChatMessageArray,
  LLMChatResponse,
} from 'types/client/inference/llmChat';

export const convertArrayToLLMChatResponse = (value: unknown): false | LLMChatResponse => {
  const response: LLMChatResponse = {
    finishReason: '',
    message: {
      role: '',
      content: '',
      name: '',
      toolCallId: '',
      toolCalls: [],
    },
  };

  // Check if it's an array with exactly 2 elements
  if (!Array.isArray(value) || value.length !== 2) {
    return false;
  }

  const [ finishReason, message ] = value;

  if (typeof finishReason !== 'string') {
    return false;
  }
  response.finishReason = finishReason;

  if (!isValidChatMessageArray(message)) {
    return false;
  }
  const [ role, content, name, toolCallId, toolCalls ] = message;
  response.message.role = role;
  response.message.content = content;
  response.message.name = name;
  response.message.toolCallId = toolCallId;
  response.message.toolCalls = toolCalls.map(([ id, name, args ]) => ({
    id,
    name,
    arguments: args,
  }));

  return response;
};

const isValidToolCallArray = (value: unknown): value is ToolCallArray => {
  if (!Array.isArray(value) || value.length !== 3) {
    return false;
  }

  return value.every((v) => typeof v === 'string');
};

const isValidChatMessageArray = (value: unknown): value is ChatMessageArray => {
  if (!Array.isArray(value) || value.length !== 5) {
    return false;
  }

  const [ role, content, name, toolCallId, toolCalls ] = value;

  return typeof role === 'string' &&
    typeof content === 'string' &&
    typeof name === 'string' &&
    typeof toolCallId === 'string' &&
    Array.isArray(toolCalls) && toolCalls.every(isValidToolCallArray);
};
