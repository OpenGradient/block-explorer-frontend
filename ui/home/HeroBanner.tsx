// we use custom heading size for hero banner
// eslint-disable-next-line no-restricted-imports
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import RewardsButton from 'ui/rewards/RewardsButton';
import AdBanner from 'ui/shared/ad/AdBanner';
import SearchBar from 'ui/snippets/searchBar/SearchBar';
import UserProfileDesktop from 'ui/snippets/user/profile/UserProfileDesktop';
import UserWalletDesktop from 'ui/snippets/user/wallet/UserWalletDesktop';

export const BACKGROUND_DEFAULT =
  'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.95) 25%, rgba(59, 130, 246, 0.95) 50%, rgba(16, 185, 129, 0.95) 75%, rgba(99, 102, 241, 0.95) 100%), radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)';
const TEXT_COLOR_DEFAULT = 'white';
const BORDER_DEFAULT = 'none';

const HeroBanner = () => {
  const background = {
    _light:
      config.UI.homepage.heroBanner?.background?.[0] ||
      config.UI.homepage.plate.background ||
      BACKGROUND_DEFAULT,
    _dark:
      config.UI.homepage.heroBanner?.background?.[1] ||
      config.UI.homepage.heroBanner?.background?.[0] ||
      config.UI.homepage.plate.background ||
      BACKGROUND_DEFAULT,
  };

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
    <Flex
      w="100%"
      background={ background }
      border={ border }
      borderRadius="xl"
      p={{ base: 6, lg: 10 }}
      columnGap={ 8 }
      alignItems="center"
      position="relative"
      overflow="hidden"
      boxShadow="0 20px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
      }}
      _after={{
        content: '""',
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    >
      <Box flexGrow={ 1 } position="relative" zIndex={ 1 }>
        <Flex mb={{ base: 3, lg: 4 }} justifyContent="space-between" alignItems="flex-start" columnGap={ 2 }>
          <Box>
            <Heading
              as="h1"
              fontSize={{ base: '24px', lg: '42px' }}
              lineHeight={{ base: '32px', lg: '48px' }}
              fontWeight={ 700 }
              color={ textColor }
              letterSpacing="-0.02em"
              mb={ 1 }
            >
              {
                config.meta.seo.enhancedDataEnabled ?
                  `${ config.chain.name } Explorer` :
                  `${ config.chain.name } Explorer`
              }
            </Heading>
            <Text
              fontSize={{ base: 'sm', lg: 'md' }}
              color={ textColor }
              opacity={ 0.9 }
              fontWeight={ 400 }
            >
              Advanced blockchain explorer powered by AI
            </Text>
          </Box>
          { config.UI.navigation.layout === 'vertical' && (
            <Box display={{ base: 'none', lg: 'flex' }} gap={ 2 }>
              { config.features.rewards.isEnabled && <RewardsButton variant="hero"/> }
              {
                (config.features.account.isEnabled && <UserProfileDesktop buttonVariant="hero"/>) ||
                (config.features.blockchainInteraction.isEnabled && <UserWalletDesktop buttonVariant="hero"/>)
              }
            </Box>
          ) }
        </Flex>
        <Box
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(10px)"
          borderRadius="xl"
          p={ 1 }
          border="1px solid rgba(255, 255, 255, 0.2)"
        >
          <SearchBar isHomepage/>
        </Box>
      </Box>
      <AdBanner platform="mobile" w="fit-content" flexShrink={ 0 } borderRadius="md" overflow="hidden" display={{ base: 'none', lg: 'block ' }}/>
    </Flex>
  );
};

export default React.memo(HeroBanner);
