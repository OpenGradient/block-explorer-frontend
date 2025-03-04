import { ethers } from 'ethers';

import { type ModelOutput } from 'types/client/inference/traditional';

import { getEnvValue } from 'configs/app/utils';

import { convertArrayToModelOutput } from '../../inferences/traditional/convert';
import PriceHistoryInferenceAbi from './abi/PriceHistoryInference.json';
import { ethDevnetProvider } from './providers';

const address = getEnvValue('NEXT_PUBLIC_OPENGRADIENT_INFERENCE_CONTRACT_ADDRESS') ?? '0x8383C9bD7462F12Eb996DD02F78234C0421A6FaE';
const contract = new ethers.Contract(address, PriceHistoryInferenceAbi, ethDevnetProvider);

export const readWorkflowResult = async(): Promise<false | ModelOutput> => {
  try {
    const result = await contract.getInferenceResult();
    return convertArrayToModelOutput(result);
  } catch (error) {
    // eslint-disable-next-line
    console.log('error when reading workflow', error);
  }

  return false;
};
