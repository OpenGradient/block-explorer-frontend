// we use custom heading size for hero banner
// eslint-disable-next-line no-restricted-imports
import { Box, Flex, Heading, VStack } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import RewardsButton from 'ui/rewards/RewardsButton';
import AdBanner from 'ui/shared/ad/AdBanner';
import SearchBar from 'ui/snippets/searchBar/SearchBar';
import UserProfileDesktop from 'ui/snippets/user/profile/UserProfileDesktop';
import UserWalletDesktop from 'ui/snippets/user/wallet/UserWalletDesktop';

export const BACKGROUND_DEFAULT = { _light: 'gray.900', _dark: 'gray.800' };
const BORDER_DEFAULT = 'none';

const HeroBanner = () => {
  // Use config background if provided (could be gradient string), otherwise use premium gradient
  const configBackgroundLight = config.UI.homepage.heroBanner?.background?.[0] || config.UI.homepage.plate.background;
  const configBackgroundDark = config.UI.homepage.heroBanner?.background?.[1] ||
    config.UI.homepage.heroBanner?.background?.[0] ||
    config.UI.homepage.plate.background;

  const hasConfigBackground = Boolean(configBackgroundLight);

  // Gradient with #5178c7
  const premiumGradientLight = 'linear-gradient(135deg, #5178c7 0%, #6b8fd4 50%, #5178c7 100%)';
  const premiumGradientDark = 'linear-gradient(135deg, #2d4a7a 0%, #5178c7 50%, #2d4a7a 100%)';

  const backgroundValue = hasConfigBackground ?
    { _light: configBackgroundLight, _dark: configBackgroundDark } :
    { _light: premiumGradientLight, _dark: premiumGradientDark };

  const border = {
    _light:
      config.UI.homepage.heroBanner?.border?.[0] || BORDER_DEFAULT,
    _dark:
      config.UI.homepage.heroBanner?.border?.[1] || config.UI.homepage.heroBanner?.border?.[0] || BORDER_DEFAULT,
  };

  return (
    <Box
      position="relative"
      w="100%"
      overflow="hidden"
      { ...(hasConfigBackground && typeof configBackgroundLight === 'string' ?
        { background: backgroundValue } :
        { background: backgroundValue }) }
      border={ border }
      p={{ base: 4, md: 5, lg: 6, xl: 8 }}
      mb={{ base: 4, lg: 5 }}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(81, 120, 199, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(81, 120, 199, 0.4) 0%, transparent 50%)',
        pointerEvents: 'none',
        _dark: {
          background: 'radial-gradient(circle at 20% 50%, rgba(81, 120, 199, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(81, 120, 199, 0.25) 0%, transparent 50%)',
        },
      }}
    >
      <Flex
        position="relative"
        zIndex={ 1 }
        direction={{ base: 'column', lg: 'row' }}
        columnGap={{ base: 0, lg: 4, xl: 6 }}
        rowGap={{ base: 4, lg: 0 }}
        alignItems={{ base: 'stretch', lg: 'center' }}
        maxW={{ base: '100%', xl: '1400px' }}
        mx="auto"
      >
        <Box flexGrow={ 1 } minW={ 0 } w="100%">
          <VStack
            gap={{ base: 5, md: 6, lg: 6 }}
            alignItems="flex-start"
            mb={ 0 }
          >
            <Flex
              justifyContent="flex-start"
              alignItems={{ base: 'flex-start', lg: 'flex-start' }}
              columnGap={ 4 }
              flexDirection={{ base: 'column', lg: 'row' }}
              width="100%"
              gap={{ base: 3, lg: 4 }}
            >
              <VStack gap={ 2 } alignItems="flex-start" flex={ 1 } px={{ base: 2, md: 4, lg: 6 }}>
                <Heading
                  as="h1"
                  fontSize={{ base: '28px', md: '32px', lg: '34px', xl: '38px' }}
                  lineHeight="1.1"
                  fontWeight={ 500 }
                  color={{ _light: 'rgba(255, 255, 255, 0.98)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                  letterSpacing="-0.02em"
                  textAlign="left"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  textShadow="0 2px 8px rgba(81, 120, 199, 0.3)"
                >
                  {
                    config.meta.seo.enhancedDataEnabled ?
                      `${ config.chain.name } Explorer` :
                      `${ config.chain.name } Explorer`
                  }
                </Heading>
              </VStack>
              { config.UI.navigation.layout === 'vertical' && (
                <Box display={{ base: 'none', lg: 'flex' }} gap={ 2 } flexShrink={ 0 }>
                  { config.features.rewards.isEnabled && <RewardsButton variant="hero"/> }
                  {
                    (config.features.account.isEnabled && <UserProfileDesktop buttonVariant="hero"/>) ||
                    (config.features.blockchainInteraction.isEnabled && <UserWalletDesktop buttonVariant="hero"/>)
                  }
                </Box>
              ) }
            </Flex>
            <Box
              w="100%"
              maxW={{ base: '100%', lg: '900px', xl: '1000px' }}
              display="flex"
              justifyContent="flex-start"
              px={{ base: 2, md: 4, lg: 6 }}
            >
              <SearchBar isHomepage/>
            </Box>
          </VStack>
        </Box>
        <AdBanner
          platform="mobile"
          w="fit-content"
          flexShrink={ 0 }
          overflow="hidden"
          display={{ base: 'none', lg: 'block' }}
        />
      </Flex>
    </Box>
  );
};

export default React.memo(HeroBanner);
