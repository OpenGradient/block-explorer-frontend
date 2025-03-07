import * as descriptors from './policies';
import * as ogDescriptors from './policies/opengradient';
import { makePolicyString, mergeDescriptors } from './utils';

function generateCspPolicy() {
  const policyDescriptor = mergeDescriptors(
    descriptors.app(),
    descriptors.ad(),
    descriptors.cloudFlare(),
    descriptors.gasHawk(),
    descriptors.googleAnalytics(),
    descriptors.googleFonts(),
    descriptors.googleReCaptcha(),
    descriptors.growthBook(),
    descriptors.helia(),
    descriptors.marketplace(),
    descriptors.mixpanel(),
    descriptors.monaco(),
    descriptors.rollbar(),
    descriptors.safe(),
    descriptors.usernameApi(),
    descriptors.walletConnect(),

    // OpenGradient descriptors
    ogDescriptors.ethereumRpc(),
  );

  return makePolicyString(policyDescriptor);
}

export default generateCspPolicy;
