import type {
  ToolCall,
  ToolDefinition,
  ChatMessage,
  ToolCallArray,
  ChatMessageArray,
  LLMChatRequest,
  ToolDefinition,
} from 'types/client/inference/llmChat';

import { isValidStringArray } from 'lib/array';

import { convertChatMessageArray } from './response';

type ToolDefinitionArray = [ string, string, string ];

export const convertArrayToLLMChatRequest = (value: unknown): false | LLMChatRequest => {
  const request: LLMChatRequest = {
    mode: BigInt(0),
    modelCID: '',
    messages: [],
    maxTokens: BigInt(0),
    stopSequence: [],
    temperature: BigInt(0),
  };

  // Check if it's an array of 8 elements
  if (!Array.isArray(value) || value.length !== 8) {
    return false;
  }

  const [ mode, modelCID, messages, tools, toolChoice, maxTokens, stopSequence, temperature ] = value;

  // Validate required fields
  if (typeof mode !== 'bigint' ||
      typeof modelCID !== 'string' ||
      !Array.isArray(messages) ||
      typeof maxTokens !== 'bigint' ||
      !isValidStringArray(stopSequence) ||
      typeof temperature !== 'bigint') {
    return false;
  }

  // Validate messages array
  if (!messages.every(isValidChatMessageArray)) {
    return false;
  }

  request.mode = mode;
  request.modelCID = modelCID;
  request.messages = messages.map(convertChatMessageArray);
  request.maxTokens = maxTokens;
  request.stopSequence = stopSequence;
  request.temperature = temperature;

  // Handle optional fields
  if (Array.isArray(tools) && tools.length > 0) {
    if (!tools.every(isValidToolDefinitionArray)) {
      return false;
    }
    request.tools = tools.map(convertToolDefinitionArray);
  }

  if (typeof toolChoice === 'string' && toolChoice.length > 0) {
    request.toolChoice = toolChoice;
  }

  return request;
};

const isValidToolDefinitionArray = (value: unknown): value is ToolDefinitionArray => {
  if (!isValidStringArray(value) || value.length !== 3) {
    return false;
  }

  return true;
};

const convertToolDefinitionArray = (value: ToolDefinitionArray): ToolDefinition => {
  const [ description, name, parameters ] = value;
  return {
    description,
    name,
    parameters,
  };
};

const isValidToolCallArray = (value: unknown): value is ToolCallArray => {
  if (!isValidStringArray(value) || value.length !== 3) {
    return false;
  }

  return true;
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

const isValidToolCall = (value: unknown): value is ToolCall => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const toolCall = value as Record<string, unknown>;

  return typeof toolCall.id === 'string' &&
         typeof toolCall.name === 'string' &&
         typeof toolCall.arguments === 'string';
};

const isValidToolDefinition = (value: unknown): value is ToolDefinition => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const toolDef = value as Record<string, unknown>;

  return typeof toolDef.name === 'string' &&
         typeof toolDef.description === 'string' &&
         typeof toolDef.parameters === 'string';
};

const isValidChatMessage = (value: unknown): value is ChatMessage => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const message = value as Record<string, unknown>;

  return typeof message.role === 'string' &&
         typeof message.content === 'string' &&
         typeof message.name === 'string' &&
         typeof message.toolCallId === 'string' &&
         Array.isArray(message.toolCalls) &&
         message.toolCalls.every(isValidToolCall);
};

const isBigInt = (value: unknown): value is BigInt => {
  return typeof value === 'bigint' ||
         (typeof value === 'object' &&
          value !== null &&
          value.constructor === BigInt);
};

export const isLLMChatRequest = (value: unknown): value is LLMChatRequest => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const request = value as Record<string, unknown>;

  // Check required fields
  if (!isBigInt(request.mode) ||
      typeof request.modelCID !== 'string' ||
      !Array.isArray(request.messages) ||
      !request.messages.every(isValidChatMessage) ||
      !isBigInt(request.maxTokens) ||
      !isValidStringArray(request.stopSequence) ||
      !isBigInt(request.temperature)) {
    return false;
  }

  // Check optional fields if they exist
  if ('tools' in request &&
      request.tools !== undefined &&
      (!Array.isArray(request.tools) || !request.tools.every(isValidToolDefinition))) {
    return false;
  }

  if ('toolChoice' in request &&
      request.toolChoice !== undefined &&
      typeof request.toolChoice !== 'string') {
    return false;
  }

  return true;
};
