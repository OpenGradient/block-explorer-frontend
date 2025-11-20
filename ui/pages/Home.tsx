import { Box, Flex, Container } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import HeroBanner from 'ui/home/HeroBanner';
import ChainIndicators from 'ui/home/indicators/ChainIndicators';
import LatestArbitrumL2Batches from 'ui/home/latestBatches/LatestArbitrumL2Batches';
import LatestZkEvmL2Batches from 'ui/home/latestBatches/LatestZkEvmL2Batches';
import LatestBlocks from 'ui/home/LatestBlocks';
import Stats from 'ui/home/Stats';
import Transactions from 'ui/home/Transactions';
import AdBanner from 'ui/shared/ad/AdBanner';

const rollupFeature = config.features.rollup;

const Home = () => {

  const leftWidget = (() => {
    if (rollupFeature.isEnabled && !rollupFeature.homepage.showLatestBlocks) {
      switch (rollupFeature.type) {
        case 'zkEvm':
          return <LatestZkEvmL2Batches/>;
        case 'arbitrum':
          return <LatestArbitrumL2Batches/>;
      }
    }

    return <LatestBlocks/>;
  })();

  return (
    <Box as="main" position="relative">
      <HeroBanner/>
      <Container maxW="container.xl" px={{ base: 4, lg: 6 }}>
        <Box
          position="relative"
          mb={{ base: 6, lg: 8 }}
        >
          <Flex
            flexDir={{ base: 'column', lg: 'row' }}
            columnGap={{ base: 4, lg: 6 }}
            rowGap={{ base: 4, lg: 6 }}
            _empty={{ mt: 0 }}
          >
            <Box
              flex={ 1 }
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                inset: 0,
                padding: '1px',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 50%, rgba(79, 172, 254, 0.1) 100%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                _dark: {
                  background: 'linear-gradient(135deg, rgba(66, 153, 225, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(79, 172, 254, 0.15) 100%)',
                },
                pointerEvents: 'none',
              }}
            >
              <Box
                bg={{ _light: 'white', _dark: 'rgba(26, 32, 44, 0.6)' }}
                backdropFilter="blur(10px)"
                p={{ base: 4, lg: 6 }}
              >
                <Stats/>
              </Box>
            </Box>
            <Box
              flex={ 1 }
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                inset: 0,
                padding: '1px',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 50%, rgba(79, 172, 254, 0.1) 100%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                _dark: {
                  background: 'linear-gradient(135deg, rgba(66, 153, 225, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(79, 172, 254, 0.15) 100%)',
                },
                pointerEvents: 'none',
              }}
            >
              <Box
                bg={{ _light: 'white', _dark: 'rgba(26, 32, 44, 0.6)' }}
                backdropFilter="blur(10px)"
                p={{ base: 4, lg: 6 }}
              >
                <ChainIndicators/>
              </Box>
            </Box>
          </Flex>
        </Box>
        <AdBanner
          mt={{ base: 6, lg: 8 }}
          mx="auto"
          display={{ base: 'flex', lg: 'none' }}
          justifyContent="center"
        />
        <Flex
          mt={{ base: 8, lg: 10 }}
          direction={{ base: 'column', lg: 'row' }}
          columnGap={{ base: 6, lg: 8 }}
          rowGap={{ base: 6, lg: 8 }}
        >
          <Box
            width={{ base: '100%', lg: '280px' }}
            flexShrink={ 0 }
          >
            <Box
              bg={{ _light: 'white', _dark: 'rgba(26, 32, 44, 0.6)' }}
              backdropFilter="blur(10px)"
              height="fit-content"
            >
              { leftWidget }
            </Box>
          </Box>
          <Box
            flexGrow={ 1 }
            position="relative"
            _before={{
              content: '""',
              position: 'absolute',
              inset: 0,
              padding: '1px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 50%, rgba(79, 172, 254, 0.1) 100%)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              _dark: {
                background: 'linear-gradient(135deg, rgba(66, 153, 225, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(79, 172, 254, 0.15) 100%)',
              },
              pointerEvents: 'none',
            }}
          >
            <Box
              bg={{ _light: 'white', _dark: 'rgba(26, 32, 44, 0.6)' }}
              backdropFilter="blur(10px)"
            >
              <Transactions/>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Home;
