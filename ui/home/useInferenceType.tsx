import { useMemo } from 'react';

import type { LogsResponseTx } from 'types/api/log';
import type { Transaction } from 'types/api/transaction';
import { InferenceEvents } from 'types/client/inference/event';
import type { InferenceMode } from 'types/client/inference/event';

import { SUPPORTED_INFERENCE_ADDRESSES } from 'lib/inferences/address';
import { getInferenceEvent } from 'lib/inferences/event';
import { decodePrecompileData } from 'lib/inferences/precompile';
import { LOG } from 'stubs/log';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

export type InferenceType = 'ML Inference' | 'LLM Chat Inference' | 'LLM Completion Inference' | 'LLM Inference Settlement' | null;

export interface InferenceInfo {
  type: InferenceType;
  modelCID: string | null;
  mode: InferenceMode | null;
  isLoading: boolean;
}

/**
 * Hook to determine the inference type, model CID, and execution mode for a transaction.
 * Fetches logs only if the transaction is to the InferenceHub.
 */
export default function useInferenceType(tx: Transaction | undefined, isLoading: boolean): InferenceInfo | null {
  const isInferenceTx = tx?.to?.hash === SUPPORTED_INFERENCE_ADDRESSES.InferenceHub;
  const isLLMInferenceTx = tx?.to?.hash === SUPPORTED_INFERENCE_ADDRESSES.LLMInference;
  const isTxFailed = tx?.status === 'error';
  const isQueryEnabled = !isLoading && isInferenceTx && Boolean(tx?.hash) && Boolean(tx?.status);

  const { data, isPlaceholderData, isLoading: isQueryLoading, isFetched } = useQueryWithPages({
    resourceName: 'tx_logs',
    pathParams: { hash: tx?.hash || '' },
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'tx_logs'>(LOG, 3, { next_page_params: null }),
    },
  });
  const logsData: LogsResponseTx | undefined = data;

  return useMemo(() => {
    // Check for LLM Inference Settlement transaction (x402 infrastructure posts proof to blockchain)
    if (isLLMInferenceTx && tx?.raw_input) {
      const methodSelector = tx.raw_input.slice(0, 10).toLowerCase();
      if (methodSelector === '0x6a99184a') {
        // Transaction failed - don't show inference
        if (isTxFailed) {
          return null;
        }
        return {
          type: 'LLM Inference Settlement',
          modelCID: null,
          mode: null,
          isLoading: false,
        };
      }
    }

    // Not an inference transaction
    if (!isInferenceTx) {
      return null;
    }

    // Transaction failed - don't show inference
    if (isTxFailed) {
      return null;
    }

    // Query not enabled yet (e.g., no status/hash yet)
    if (!isQueryEnabled) {
      return null;
    }

    // Show loading if: we have placeholder data OR (query is loading AND no data yet)
    if (isPlaceholderData || (isQueryLoading && !logsData?.items?.length)) {
      return {
        type: null,
        modelCID: null,
        mode: null,
        isLoading: true,
      };
    }

    // Query completed but no logs
    if (isFetched && !logsData?.items?.length) {
      return null;
    }

    // No logs data yet
    if (!logsData?.items?.length) {
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

    // No inference logs found
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
      isLoading: false, // We have real data, not loading
    };
  }, [ isInferenceTx, isLLMInferenceTx, tx, logsData, isPlaceholderData, isQueryLoading, isFetched, isTxFailed, isQueryEnabled ]);
}
