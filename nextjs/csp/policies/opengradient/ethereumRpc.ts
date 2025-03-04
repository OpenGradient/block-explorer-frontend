import type CspDev from 'csp-dev';

import { getEnvValue } from 'configs/app/utils';

export function ethereumRpc(): CspDev.DirectiveDescriptor {
  return {
    'connect-src': [
      getEnvValue('NEXT_PUBLIC_OPENGRADIENT_ETH_DEVNET_RPC_URL') ?? 'http://18.188.176.119:8545',
    ],
  };
}
