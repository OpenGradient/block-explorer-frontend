import type CspDev from 'csp-dev';

import { OPENGRADIENT_ETH_DEVNET_RPC_URL } from 'lib/opengradient/constants';

export function ethereumRpc(): CspDev.DirectiveDescriptor {
  return {
    'connect-src': [
      OPENGRADIENT_ETH_DEVNET_RPC_URL,
    ],
  };
}
