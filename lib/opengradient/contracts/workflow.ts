import { ethers } from 'ethers';
import type { Address } from 'viem';

import { type ModelOutput } from 'types/client/inference/traditional';

import { convertArrayToModelOutput } from '../../inferences/traditional/convert';
import PriceHistoryInferenceAbi from './abi/PriceHistoryInference.json';
import { ethDevnetProvider } from './providers';

/**
 * Reads the latest inference result from a deployed workflow contract.
 * @param address The address of the workflow contract.
 * @returns `false` or `ModelOutput`
 */
export const readWorkflowResult = async(address: Address): Promise<false | ModelOutput> => {
  const contract = new ethers.Contract(address, PriceHistoryInferenceAbi, ethDevnetProvider);

  const result = await contract.getInferenceResult();
  return convertArrayToModelOutput(result);
};
