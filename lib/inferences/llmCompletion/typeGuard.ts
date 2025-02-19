import { isNil } from 'es-toolkit';

import type { LLMCompletionRequest } from 'types/client/inference/llmCompletion';

import { isValidStringArray } from 'lib/array';
import { isBigInt } from 'lib/number';
import { getObjectKeys } from 'lib/object';

export const isLLMCompletionRequest = (value: unknown): value is LLMCompletionRequest => {
  if (typeof value !== 'object' || isNil(value)) {
    return false;
  }

  if (getObjectKeys(value).length !== 6) {
    return false;
  }

  if ('mode' in value && isBigInt(value.mode) && 'modelCID' in value && typeof value.modelCID === 'string' &&
'prompt' in value && typeof value.prompt === 'string' && 'maxTokens' in value && isBigInt(value.maxTokens) &&
'stopSequence' in value && isValidStringArray(value.stopSequence) && 'temperature' in value && isBigInt(value.temperature)) {
    return true;
  }

  return false;
};
