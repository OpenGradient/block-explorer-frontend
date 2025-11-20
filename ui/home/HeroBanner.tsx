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

  // Premium gradient backgrounds for web3/AI aesthetic
  const premiumGradientLight = 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)';
  const premiumGradientDark = 'linear-gradient(135deg, #0f0c29 0%, #302b63 25%, #24243e 50%, #1a1a2e 75%, #16213e 100%)';

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
        background: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
        pointerEvents: 'none',
        _dark: {
          background: 'radial-gradient(circle at 20% 50%, rgba(66, 153, 225, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
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
                  fontSize={{ base: '28px', md: '36px', lg: '48px' }}
                  lineHeight={{ base: '1.2', lg: '1.1' }}
                  fontWeight={ 800 }
                  color={ textColor }
                  letterSpacing="-0.02em"
                  background={ hasConfigBackground ? 'none' : {
                    _light: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                    _dark: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                  } }
                  backgroundClip={ hasConfigBackground ? 'unset' : 'text' }
                  style={ hasConfigBackground ? {} : { WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }
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
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                inset: '-2px',
                padding: '2px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                _dark: {
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
                },
                pointerEvents: 'none',
              }}
            >
              <Box
                position="relative"
                bg={{ _light: 'rgba(255, 255, 255, 0.95)', _dark: 'rgba(0, 0, 0, 0.4)' }}
                backdropFilter="blur(20px)"
                p={ 1 }
              >
                <SearchBar isHomepage/>
              </Box>
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
