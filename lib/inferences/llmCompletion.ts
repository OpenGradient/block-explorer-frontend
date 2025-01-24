import { type LLMCompletionResponse } from 'types/client/inference/llmCompletion';

export const convertArrayToLLMCompletionResponse = (value: unknown): false | LLMCompletionResponse => {
  if (!Array.isArray(value) || value.length !== 1) {
    return false;
  }
  const [ answer ] = value;

  return typeof answer === 'string' ? { answer } : false;
};
