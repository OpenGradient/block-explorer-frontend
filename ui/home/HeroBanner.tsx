// we use custom heading size for hero banner

import { Box, Flex, VStack } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import AdBanner from 'ui/shared/ad/AdBanner';
import SearchBar from 'ui/snippets/searchBar/SearchBar';

export const BACKGROUND_DEFAULT = { _light: 'gray.900', _dark: 'gray.800' };

const HeroBanner = () => {
  // Dark, minimal backgrounds
  const premiumGradientLight = '#0a0a0a';
  const premiumGradientDark = '#0a0a0a';

  const configBackgroundLight = config.UI.homepage.heroBanner?.background?.[0] || config.UI.homepage.plate.background;
  const configBackgroundDark = config.UI.homepage.heroBanner?.background?.[1] ||
    config.UI.homepage.heroBanner?.background?.[0] ||
    config.UI.homepage.plate.background;

  const hasConfigBackground = Boolean(configBackgroundLight);
  const backgroundValue = hasConfigBackground ?
    { _light: configBackgroundLight, _dark: configBackgroundDark } :
    { _light: premiumGradientLight, _dark: premiumGradientDark };

  return (
    <Box
      position="relative"
      w="100%"
      overflow="hidden"
      background={ backgroundValue }
      border="none"
      borderRadius="0"
      p={{ base: 4, md: 6, lg: 8, xl: 10 }}
      mb={{ base: 4, lg: 6 }}
    >
      { /* Minimal noise texture */ }
      <Box
        position="absolute"
        top={ 0 }
        left={ 0 }
        right={ 0 }
        bottom={ 0 }
        opacity={ 0.02 }
        backgroundImage="url(data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E)"
        pointerEvents="none"
      />

      <Flex
        position="relative"
        zIndex={ 1 }
        direction={{ base: 'column', lg: 'row' }}
        columnGap={{ base: 0, lg: 8, xl: 10 }}
        rowGap={{ base: 8, lg: 0 }}
        alignItems={{ base: 'stretch', lg: 'center' }}
        maxW={{ base: '100%', xl: '1400px' }}
        mx="auto"
      >
        <Box flexGrow={ 1 } minW={ 0 } w="100%">
          <VStack
            gap={{ base: 4, md: 5, lg: 6 }}
            alignItems="center"
            mb={ 0 }
          >
            <Box
              w="100%"
              maxW={{ base: '100%', lg: '900px', xl: '1000px' }}
              position="relative"
              mx="auto"
              boxShadow={{ _light: '0 0 4px rgba(0, 150, 255, 0.8)', _dark: '0 0 4px rgba(0, 150, 255, 0.9)' }}
            >
              { /* Subtle border glow */ }
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                borderRadius="0"
                border="1px solid"
                borderColor="rgba(0, 255, 255, 0.15)"
              />

              { /* Content */ }
              <Box
                w="100%"
                h="100%"
                borderRadius="0"
                position="relative"
                overflow="hidden"
                bg={{ _light: 'white', _dark: 'rgba(10, 10, 10, 0.95)' }}
                backdropFilter="blur(10px)"
                boxShadow="inset 0 1px 0 0 rgba(255, 255, 255, 0.05)"
                transition="all 0.3s ease"
                _hover={{
                  boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
                }}
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
