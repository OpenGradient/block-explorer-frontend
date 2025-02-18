import { isNil } from 'es-toolkit';
import { Interface, type Result } from 'ethers';

import type { InferenceMode } from 'types/client/inference/event';
import { InferenceModes } from 'types/client/inference/event';
import type { LLMChatRequest, LLMChatResponse } from 'types/client/inference/llmChat';
import type { LLMCompletionResponse } from 'types/client/inference/llmCompletion';
import type { ModelInput, ModelOutput } from 'types/client/inference/traditional';

import { getObjectEntries } from 'lib/object';

import { abi } from './abi.json';
import { convertArrayToLLMChatRequest } from './llmChat/request';
import { convertArrayToLLMChatResponse } from './llmChat/response';
import { convertArrayToModelInput, convertArrayToModelOutput } from './traditional/convert';

const PRECOMPILE_EVENTS = [ 'LLMChat', 'LLMCompletionEvent', 'ModelInferenceEvent' ] as const;

type PrecompileEvent = typeof PRECOMPILE_EVENTS[number];

// Interface for decoded event data
export interface PrecompileDecodedData {
  event: PrecompileEvent;
  inferenceID: string;
  mode: InferenceMode;
  modelCID: string;
  request: false | ModelInput | LLMChatRequest; // TODO(next): Handle other requests here
  response: false | ModelOutput | LLMChatResponse | LLMCompletionResponse;
}

const buildDecodedData = (eventName: PrecompileEvent, decodedData: Result): PrecompileDecodedData | undefined => {
  // Try converting the decodedData[1] (mode) from bigint into InferenceMode string
  let inferenceMode: InferenceMode | undefined;

  const request = decodedData[1];
  const response = decodedData[2];

  // console.log('request', request)
  // console.log('response', response)

  try {
    const numberMode = Number(request[0]);
    inferenceMode = getObjectEntries(InferenceModes).find((m) => m[1] === numberMode)?.[0];
  } catch {}

  const inferenceID = decodedData[0];
  const mode = isNil(inferenceMode) ? 'UNKNOWN' : inferenceMode;
  const modelCID = typeof request[1] === 'string' ? request[1] : '';

  // Handle input and output parsing differently with events
  if (eventName === 'LLMChat') {
    return {
      event: eventName,
      inferenceID,
      mode,
      modelCID,
      request: convertArrayToLLMChatRequest(request),
      response: convertArrayToLLMChatResponse(response),
    };
  } else if (eventName === 'ModelInferenceEvent') {
    return {
      event: eventName,
      inferenceID, mode, modelCID, request: convertArrayToModelInput(request[2]), response: convertArrayToModelOutput(response),
    };
  };
};

/*
TODOS

1) print out decoded output from new example
http://localhost:3002/tx/0xd38b51b1b663feec32c73d251f709e5724c57ef55e6e14f1f50e0b33cf22b313?tab=inferences
2) write a type-guard to check that format
3) if it's incorrectly formatted, throw an error
*/
export const decodePrecompileData = (data: string | undefined): PrecompileDecodedData | undefined => {
  if (isNil(data)) {
    return;
  }

  try {
    // Create interface from ABI with proper type assertion
    const iface = new Interface(abi);

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

    throw new Error('Could not decode event data with any known event type');
  } catch (error) {}
};
