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
const TEXT_COLOR_DEFAULT = 'white';
const BORDER_DEFAULT = 'none';

const HeroBanner = () => {
  // Use config background if provided (could be gradient string), otherwise use premium gradient
  const configBackgroundLight = config.UI.homepage.heroBanner?.background?.[0] || config.UI.homepage.plate.background;
  const configBackgroundDark = config.UI.homepage.heroBanner?.background?.[1] ||
    config.UI.homepage.heroBanner?.background?.[0] ||
    config.UI.homepage.plate.background;

  const hasConfigBackground = Boolean(configBackgroundLight);

  // Bright cyan-based gradient matching OpenGradient branding
  const premiumGradientLight = 'linear-gradient(135deg, #00d4ff 0%, #00a3cc 25%, #0066ff 50%, #00d4ff 75%, #00ffff 100%)';
  const premiumGradientDark = 'linear-gradient(135deg, #001a33 0%, #003366 25%, #004080 50%, #001a33 75%, #002244 100%)';

  const backgroundValue = hasConfigBackground ?
    { _light: configBackgroundLight, _dark: configBackgroundDark } :
    { _light: premiumGradientLight, _dark: premiumGradientDark };

  const textColor = {
    _light:
      // light mode
      config.UI.homepage.heroBanner?.text_color?.[0] ||
      config.UI.homepage.plate.textColor ||
      TEXT_COLOR_DEFAULT,
    // dark mode
    _dark:
      config.UI.homepage.heroBanner?.text_color?.[1] ||
      config.UI.homepage.heroBanner?.text_color?.[0] ||
      config.UI.homepage.plate.textColor ||
      TEXT_COLOR_DEFAULT,
  };

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
      p={{ base: 6, lg: 12 }}
      mb={{ base: 6, lg: 8 }}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 102, 255, 0.4) 0%, transparent 50%)',
        pointerEvents: 'none',
        _dark: {
          background: 'radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 102, 255, 0.25) 0%, transparent 50%)',
        },
      }}
    >
      <Flex
        position="relative"
        zIndex={ 1 }
        direction={{ base: 'column', lg: 'row' }}
        columnGap={ 8 }
        rowGap={ 6 }
        alignItems={{ base: 'stretch', lg: 'center' }}
      >
        <Box flexGrow={ 1 } minW={ 0 }>
          <VStack gap={{ base: 3, lg: 4 }} alignItems={{ base: 'stretch', lg: 'flex-start' }} mb={{ base: 4, lg: 6 }}>
            <Flex
              justifyContent="space-between"
              alignItems={{ base: 'flex-start', lg: 'center' }}
              columnGap={ 4 }
              flexDirection={{ base: 'column', lg: 'row' }}
              width="100%"
            >
              <VStack gap={ 2 } alignItems={{ base: 'stretch', lg: 'flex-start' }} flex={ 1 }>
                <Heading
                  as="h1"
                  fontSize={{ base: '30px', md: '40px', lg: '50px' }}
                  lineHeight={{ base: '1.2', lg: '1.1' }}
                  fontWeight={ 700 }
                  color={ textColor }
                  letterSpacing="-0.02em"
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
              maxW={{ lg: '800px' }}
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
