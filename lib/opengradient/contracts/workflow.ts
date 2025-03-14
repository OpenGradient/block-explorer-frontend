import { ethers } from 'ethers';
import type { Address } from 'viem';

import { type ModelOutput } from 'types/client/inference/traditional';

import { convertArrayToModelOutput } from '../../inferences/traditional/convert';
import PriceHistoryInferenceAbi from './abi/PriceHistoryInference.json';
import { ethDevnetProvider } from './providers';

export const getReadWorkflowResultQueryKey = (contractAddress: Address) => [ 'opengradient', 'readWorkflowResult', contractAddress ];

export type ReadWorkflowResultReturnType = Awaited<ReturnType<typeof readWorkflowResult>>;

export const READ_WORKFLOW_RESULT_PLACEHOLDER_DATA = {
  modelCid: 'somemodelcid',
  output: {
    numbers: [ { name: 'Y', values: [ { value: '3774157376028597354888916016', decimals: '31' } ], shape: [ 1 ] } ],
    strings: [],
    jsons: [],
    isSimulationResult: true,
  },
} satisfies ReadWorkflowResultReturnType;

/**
 * Reads the latest inference result from a deployed workflow contract.
 * @param contractAddress The address of the workflow contract.
 * @returns `{ modelCid: string; output: false | ModelOutput }`
 */
export const readWorkflowResult = async(contractAddress: Address): Promise<{ modelCid: string; output: false | ModelOutput } > => {
  const contract = new ethers.Contract(contractAddress, PriceHistoryInferenceAbi, ethDevnetProvider);

  const result = await contract.getInferenceResult();
  const modelId = await contract.modelId();
  return {
    modelCid: modelId,
    output: convertArrayToModelOutput(result),
  };
};
