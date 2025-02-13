import { isNil } from 'es-toolkit';
import { Interface, type Result } from 'ethers';

import type { InferenceMode } from 'types/client/inference/event';
import { InferenceModes } from 'types/client/inference/event';

import { getObjectEntries } from 'lib/object';

import { abi } from './abi.json';

const PRECOMPILE_EVENTS = [ 'LLMChat', 'LLMCompletionEvent', 'ModelInferenceEvent' ] as const;

type PrecompileEvent = typeof PRECOMPILE_EVENTS[number];

// Interface for decoded event data
export interface PrecompileDecodedData {
  event: PrecompileEvent;
  data: {
    inferenceID: string;
    mode: InferenceMode;
    modelCID: string;
  };
}

const buildDecodedData = (eventName: PrecompileEvent, decodedData: Result): PrecompileDecodedData => {
  // Try converting the decodedData[1] (mode) from bigint into InferenceMode string
  let mode: InferenceMode | undefined;
  try {
    const numberMode = Number(decodedData[1]);
    mode = getObjectEntries(InferenceModes).find((m) => m[1] === numberMode)?.[0];
  } catch {}

  return {
    event: eventName,
    data: {
      inferenceID: decodedData[0],
      mode: isNil(mode) ? 'UNKNOWN' : mode,
      modelCID: decodedData[2],
    },
  };
};

export const decodePrecompileData = (data: string, topics?: Array<string>): PrecompileDecodedData => {
  try {
    // Create interface from ABI with proper type assertion
    const iface = new Interface(abi);

    // If topics are provided, use topic0 to identify the event
    if (topics?.length) {
      const topic0 = topics[0];

      for (const eventName of PRECOMPILE_EVENTS) {
        const eventFragment = iface.getEvent(eventName);
        if (!eventFragment) continue;

        if (eventFragment.topicHash === topic0) {
          const decodedData = iface.decodeEventLog(eventFragment, data, topics);
          return buildDecodedData(eventName, decodedData);
        }
      }
      throw new Error(`Unknown event type for topic: ${ topic0 }`);
    } else {
      for (const eventName of PRECOMPILE_EVENTS) {
        try {
          const eventFragment = iface.getEvent(eventName);
          if (!eventFragment) continue;

          const decodedData = iface.decodeEventLog(eventFragment, data);
          return buildDecodedData(eventName, decodedData);
        } catch (error) {
          continue; // Try next event type if this one fails
        }
      }
    }

    throw new Error('Could not decode event data with any known event type');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to decode event data: ${ error.message }`);
    }
    throw new Error('Failed to decode event data: Unknown error');
  }
};
