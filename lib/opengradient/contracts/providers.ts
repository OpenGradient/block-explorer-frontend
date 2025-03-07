import { ethers } from 'ethers';

import { OPENGRADIENT_ETH_DEVNET_RPC_URL } from '../constants';

export const ethDevnetProvider = new ethers.JsonRpcProvider(OPENGRADIENT_ETH_DEVNET_RPC_URL);
