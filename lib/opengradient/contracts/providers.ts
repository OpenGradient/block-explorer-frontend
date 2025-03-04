import { ethers } from 'ethers';

import { getEnvValue } from 'configs/app/utils';

export const ethDevnetProvider = new ethers.JsonRpcProvider(getEnvValue('NEXT_PUBLIC_OPENGRADIENT_ETH_DEVNET_RPC_URL') ?? 'http://18.188.176.119:8545');
