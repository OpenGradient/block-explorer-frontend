import { isNotNil } from 'es-toolkit';
import { ethers } from 'ethers';
import type { Address } from 'viem';

import { getEnvValue } from 'configs/app/utils';

import TaskSchedulerAbi from './abi/TaskScheduler.json';
import { ethDevnetProvider } from './providers';

const address = (getEnvValue('NEXT_PUBLIC_OPENGRADIENT_SCHEDULER_CONTRACT_ADDRESS') ?? '0x7179724De4e7FF9271FA40C0337c7f90C0508eF6') as Address;
const contract = new ethers.Contract(address, TaskSchedulerAbi, ethDevnetProvider);

export interface SchedulerTask {
  user: Address;
  contractAddress: Address;
  endTime: bigint;
  frequency: bigint;
}

type EthersTask = {
  user: Address;
  contractAddress: Address;
  endTime: ethers.BigNumberish;
  frequency: ethers.BigNumberish;
} & Array<unknown>;

/**
 * Fetches all deployed workflow contracts registered with the scheduler.
 */
export const getAllTasks = async(): Promise<Array<SchedulerTask>> => {
  const tasks = await contract.getAllTasks();

  if (!Array.isArray(tasks)) {
    return [];
  }

  return (tasks as Array<EthersTask>).map((task) => {
    if (!Array.isArray(task) || task.length !== 4) {
      return;
    }

    return {
      user: task.user,
      contractAddress: task.contractAddress,
      endTime: BigInt(task.endTime),
      frequency: BigInt(task.frequency),
    };
  }).filter(isNotNil);
};
