import { InferenceEvent } from 'types/client/inference/event';

export const getInferenceEvent = (value: string | undefined): InferenceEvent | undefined => (
  INFERENCE_EVENTS.find(event => value?.startsWith(event))
);

export const INFERENCE_EVENTS = Object.values(InferenceEvent);
