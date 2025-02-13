import { InferenceEvents } from 'types/client/inference/event';

export const getInferenceEvent = (value: string | undefined) => (
  INFERENCE_EVENTS.find(event => value?.startsWith(event))
);

export const INFERENCE_EVENTS = Object.values(InferenceEvents);
