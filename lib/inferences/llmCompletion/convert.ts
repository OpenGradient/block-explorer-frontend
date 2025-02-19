import type { LLMCompletionRequest, LLMCompletionResponse } from 'types/client/inference/llmCompletion';

import { isValidStringArray } from 'lib/array';
import { isBigInt } from 'lib/number';

export const convertArrayToLLMCompletionRequest = (value: unknown): false | LLMCompletionRequest => {
  if (!Array.isArray(value) || value.length !== 6) {
    return false;
  }
  const [ mode, modelCID, prompt, maxTokens, stopSequence, temperature ] = value;

  if (isBigInt(mode) && typeof modelCID === 'string' && typeof prompt === 'string' && isBigInt(maxTokens) &&
    isValidStringArray(stopSequence) && isBigInt(temperature)) {
    return {
      mode,
      modelCID,
      prompt,
      maxTokens,
      stopSequence,
      temperature,
    } satisfies LLMCompletionRequest;
  }

  return false;
};

export const convertArrayToLLMCompletionResponse = (value: unknown): false | LLMCompletionResponse => {
  if (!Array.isArray(value) || length !== 1) {
    return false;
  }
  const [ answer ] = value;

  return typeof answer === 'string' ? { answer } : false;
};
