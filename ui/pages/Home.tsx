import { Box, Flex, Container, VStack } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import HeroBanner from 'ui/home/HeroBanner';
import ChainIndicators from 'ui/home/indicators/ChainIndicators';
import LatestArbitrumL2Batches from 'ui/home/latestBatches/LatestArbitrumL2Batches';
import LatestZkEvmL2Batches from 'ui/home/latestBatches/LatestZkEvmL2Batches';
import LatestBlocks from 'ui/home/LatestBlocks';
import Transactions from 'ui/home/Transactions';
import TrustedExecution from 'ui/home/TrustedExecution';
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
      bg={{ _light: '#f4fcfe', _dark: '#0a0f19' }}
      minH="100vh"
    >
      <Box position="relative" zIndex={ 1 }>
        <HeroBanner/>
        <Container maxW="1600px" px={{ base: 4, lg: 0 }}>
          <AdBanner
            mt={{ base: 5, lg: 6 }}
            mx="auto"
            display={{ base: 'flex', lg: 'none' }}
            justifyContent="center"
          />

          <TrustedExecution/>

          <Flex
            mt={{ base: 5, lg: 6 }}
            direction={{ base: 'column', lg: 'row' }}
            columnGap={{ base: 5, lg: 6, xl: 8 }}
            rowGap={{ base: 5, lg: 6 }}
            alignItems={{ base: 'stretch', lg: 'stretch' }}
          >
            <Box
              width={{ base: '100%', lg: '360px' }}
              flexShrink={ 0 }
            >
              <VStack align="stretch" gap={{ base: 5, lg: 6 }}>
                <ChainIndicators/>
                { leftWidget }
              </VStack>
            </Box>

            <Box
              flexGrow={ 1 }
              position="relative"
              display="flex"
              minW={ 0 }
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
