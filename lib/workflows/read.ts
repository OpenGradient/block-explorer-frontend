import { ethers } from 'ethers';

import { type ModelOutput } from 'types/client/inference/traditional';

import { getEnvValue } from 'configs/app/utils';

import { convertArrayToModelOutput } from '../inferences/traditional/convert';
import PriceHistoryInferenceAbi from './PriceHistoryInferenceAbi.json';

export const readWorkflowResult = async(contractAddress: string): Promise<false | ModelOutput> => {
  const provider = new ethers.JsonRpcProvider(getEnvValue('NEXT_PUBLIC_OPENGRADIENT_ETH_DEVNET_RPC_URL'));

  // Get the contract interface
  const contract = new ethers.Contract(contractAddress, PriceHistoryInferenceAbi, provider);

  // Get the result from the contract
  const result = await contract.getInferenceResult();

  // Convert the array to a model output
  return convertArrayToModelOutput(result);
};
