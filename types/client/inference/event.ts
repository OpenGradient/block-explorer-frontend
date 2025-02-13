export const InferenceEvents = {
  InferenceResult: 'InferenceResult',
  LLMChatResult: 'LLMChatResult',
  LLMCompletionResult: 'LLMCompletionResult',

  // Pre-compile events - https://github.com/OpenGradient/artela-rollkit/blob/main/x/evm/contracts/og_inference/OGInference.sol#L110
  ModelInferenceEvent: 'ModelInferenceEvent',
  LLMCompletionEvent: 'LLMCompletionEvent',
  LLMChat: 'LLMChat',
} as const;
type InferenceEventsType = typeof InferenceEvents;
export type InferenceEvent = InferenceEventsType[keyof InferenceEventsType];

export const InferenceModes = {
  UNKNOWN: -1,
  VANILLA: 0,
  ZKML: 1,
  TEE: 2,
} as const;
type InferenceModesType = typeof InferenceModes;
export type InferenceMode = keyof InferenceModesType;
