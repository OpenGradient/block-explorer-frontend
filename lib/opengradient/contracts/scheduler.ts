import { ethers } from 'ethers';

import { getEnvValue } from 'configs/app/utils';

import TaskSchedulerAbi from './abi/TaskScheduler.json';
import { ethDevnetProvider } from './providers';

const address = getEnvValue('NEXT_PUBLIC_OPENGRADIENT_SCHEDULER_CONTRACT_ADDRESS') ?? '0x7179724De4e7FF9271FA40C0337c7f90C0508eF6';
const contract = new ethers.Contract(address, TaskSchedulerAbi, ethDevnetProvider);

export const getAllTasks = async(): Promise<void> => {
  try {
    const result = await contract.getAllTasks();

    // eslint-disable-next-line
    console.log('listing all workflows', result);
  } catch (error) {
    // eslint-disable-next-line
    console.error(error);
  }
};
