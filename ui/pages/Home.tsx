import { Box, Flex, Container } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import HeroBanner from 'ui/home/HeroBanner';
import ChainIndicators from 'ui/home/indicators/ChainIndicators';
import LatestArbitrumL2Batches from 'ui/home/latestBatches/LatestArbitrumL2Batches';
import LatestZkEvmL2Batches from 'ui/home/latestBatches/LatestZkEvmL2Batches';
import LatestBlocks from 'ui/home/LatestBlocks';
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
    <Box
      as="main"
      position="relative"
      bg={{ _light: '#ffffff', _dark: '#0a0a0a' }}
      minH="100vh"
    >
      <Box position="relative" zIndex={ 1 }>
        <HeroBanner/>
        <Container maxW="container.xl" px={{ base: 4, lg: 6 }}>
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
            { /* Left Column: Chain Indicators + Latest Blocks */ }
            <Box
              width={{ base: '100%', lg: '320px' }}
              flexShrink={ 0 }
              height="fit-content"
            >
              <Box mb={{ base: 6, lg: 8 }}>
                <ChainIndicators/>
              </Box>
              { leftWidget }
            </Box>

            { /* Right Column: Transactions */ }
            <Box
              flexGrow={ 1 }
              position="relative"
            >
              <Transactions/>
            </Box>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
