import { useMemo } from 'react';

import type { Transaction } from 'types/api/transaction';
import { InferenceEvents } from 'types/client/inference/event';
import type { InferenceMode } from 'types/client/inference/event';

import { SUPPORTED_INFERENCE_ADDRESSES } from 'lib/inferences/address';
import { getInferenceEvent } from 'lib/inferences/event';
import { decodePrecompileData } from 'lib/inferences/precompile';
import { LOG } from 'stubs/log';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

export type InferenceType = 'ML Inference' | 'LLM Chat Inference' | 'LLM Completion Inference' | null;

export interface InferenceInfo {
  type: InferenceType;
  modelCID: string | null;
  mode: InferenceMode | null;
}

/**
 * Hook to determine the inference type, model CID, and execution mode for a transaction.
 * Fetches logs only if the transaction is to the InferenceHub.
 */
export default function useInferenceType(tx: Transaction | undefined, isLoading: boolean): InferenceInfo | null {
  const isInferenceTx = tx?.to?.hash === SUPPORTED_INFERENCE_ADDRESSES.InferenceHub;

  const { data: logsData } = useQueryWithPages({
    resourceName: 'tx_logs',
    pathParams: { hash: tx?.hash || '' },
    options: {
      enabled: !isLoading && isInferenceTx && Boolean(tx?.hash) && Boolean(tx?.status),
      placeholderData: generateListStub<'tx_logs'>(LOG, 3, { next_page_params: null }),
    },
  });

  return useMemo(() => {
    if (!isInferenceTx || !logsData?.items) {
      return null;
    }

    // Find InferenceHub logs and their corresponding precompile logs
    const items = logsData.items;
    const inferenceHubLogs = items.map((item, index) => {
      const prevItem = index > 0 ? items[index - 1] : undefined;

      if (item.address.hash === SUPPORTED_INFERENCE_ADDRESSES.InferenceHub &&
          prevItem?.address.hash === SUPPORTED_INFERENCE_ADDRESSES.Precompile) {
        return {
          ...item,
          preCompileData: prevItem.data,
        };
      }

      return item;
    }).filter((i) => i.address.hash === SUPPORTED_INFERENCE_ADDRESSES.InferenceHub);

    if (!inferenceHubLogs.length) {
      return null;
    }

    // Get the first inference log and determine its type
    const firstLog = inferenceHubLogs[0];
    const event = getInferenceEvent(firstLog.decoded?.method_call);

    let type: InferenceType = null;
    if (event === InferenceEvents.InferenceResult) {
      type = 'ML Inference';
    } else if (event === InferenceEvents.LLMChatResult) {
      type = 'LLM Chat Inference';
    } else if (event === InferenceEvents.LLMCompletionResult) {
      type = 'LLM Completion Inference';
    } else {
      type = 'ML Inference'; // Default fallback
    }

    // Decode precompile data to get model CID and mode
    const precompileDecoded = decodePrecompileData(firstLog.preCompileData);
    const modelCID = precompileDecoded?.modelCID || null;
    const mode = precompileDecoded?.mode || null;

    return {
      type,
      modelCID,
      mode,
    };
  }, [ isInferenceTx, logsData ]);
}
