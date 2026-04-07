import type CspDev from 'csp-dev';

export function walrusAggregator(): CspDev.DirectiveDescriptor {
  return {
    'connect-src': [
      'https://aggregator.suicore.com',
    ],
  };
}
