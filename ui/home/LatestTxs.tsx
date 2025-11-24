import { Box, Text, Flex } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useIsMobile from 'lib/hooks/useIsMobile';
import useNewTxsSocket from 'lib/hooks/useNewTxsSocket';
import { TX } from 'stubs/tx';
import { Link } from 'toolkit/chakra/link';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import LatestTxsItem from './LatestTxsItem';
import LatestTxsItemMobile from './LatestTxsItemMobile';

const LatestTransactions = () => {
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 2 : 6;
  const { data, isPlaceholderData, isError } = useApiQuery('homepage_txs', {
    queryOptions: {
      placeholderData: Array(txsCount).fill(TX),
    },
  });

  const { num, socketAlert } = useNewTxsSocket();

  let content;

  if (isError) {
    content = (
      <Box px={{ base: 4, lg: 6 }} py={ 8 }>
        <Text
          fontSize="sm"
          color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          No data. Please reload the page.
        </Text>
      </Box>
    );
  }

  if (data) {
    const txsUrl = route({ pathname: '/txs' });
    content = (
      <>
        <SocketNewItemsNotice borderBottomRadius={ 0 } url={ txsUrl } num={ num } alert={ socketAlert } isLoading={ isPlaceholderData }/>
        <Box
          display={{ base: 'block', lg: 'none' }}
          width="100%"
          bg={{ _light: '#ffffff', _dark: '#0a0a0a' }}
          border="1px solid"
          borderColor={{ _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(64, 209, 219, 0.1)' }}
          borderRadius="0"
          overflow="hidden"
        >
          { data.slice(0, txsCount).map(((tx, index) => (
            <Box
              key={ tx.hash + (isPlaceholderData ? index : '') }
              borderBottom={ index < txsCount - 1 ? '1px solid' : 'none' }
              borderColor={{ _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(64, 209, 219, 0.1)' }}
            >
              <LatestTxsItemMobile
                tx={ tx }
                isLoading={ isPlaceholderData }
              />
            </Box>
          ))) }
        </Box>
        <AddressHighlightProvider>
          <Box
            display={{ base: 'none', lg: 'block' }}
            width="100%"
            bg={{ _light: '#ffffff', _dark: '#0a0a0a' }}
            border="1px solid"
            borderColor={{ _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(64, 209, 219, 0.1)' }}
            borderRadius="0"
            overflow="hidden"
            position="relative"
          >
            { /* Subtle grid pattern overlay */ }
            <Box
              position="absolute"
              top={ 0 }
              left={ 0 }
              right={ 0 }
              bottom={ 0 }
              opacity={{ _light: 0.005, _dark: 0.015 }}
              backgroundImage={{
                _light: 'repeating-linear-gradient(0deg, transparent, transparent 99px, rgba(0, 0, 0, 0.02) 99px, rgba(0, 0, 0, 0.02) 100px), repeating-linear-gradient(90deg, transparent, transparent 99px, rgba(0, 0, 0, 0.02) 99px, rgba(0, 0, 0, 0.02) 100px)',
                _dark: 'repeating-linear-gradient(0deg, transparent, transparent 99px, rgba(64, 209, 219, 0.02) 99px, rgba(64, 209, 219, 0.02) 100px), repeating-linear-gradient(90deg, transparent, transparent 99px, rgba(64, 209, 219, 0.02) 99px, rgba(64, 209, 219, 0.02) 100px)',
              }}
              backgroundSize="100px 100px"
              pointerEvents="none"
            />
            <Box position="relative" zIndex={ 1 }>
              { data.slice(0, txsCount).map(((tx, index) => (
                <Box
                  key={ tx.hash + (isPlaceholderData ? index : '') }
                  borderBottom={ index < txsCount - 1 ? '1px solid' : 'none' }
                  borderColor={{ _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(64, 209, 219, 0.1)' }}
                >
                  <LatestTxsItem
                    tx={ tx }
                    isLoading={ isPlaceholderData }
                  />
                </Box>
              ))) }
            </Box>
          </Box>
        </AddressHighlightProvider>
        <Box
          mt={ 3 }
          px={{ base: 4, lg: 6 }}
          pb={{ base: 4, lg: 5 }}
          pt={ 2 }
        >
          <Link
            href={ txsUrl }
            fontSize="10px"
            fontWeight={ 500 }
            letterSpacing="0.08em"
            textTransform="uppercase"
            color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
            fontFamily="system-ui, -apple-system, sans-serif"
            width="100%"
            display="block"
            textAlign="center"
            py={ 2.5 }
            transition="all 0.2s ease"
            _hover={{
              textDecoration: 'none',
              opacity: 0.7,
              color: { _light: 'rgba(0, 0, 0, 0.6)', _dark: 'rgba(255, 255, 255, 0.6)' },
            }}
          >
            View all transactions
          </Link>
        </Box>
      </>
    );
  }

  return (
    <Box width="100%">
      { /* Premium Header Section */ }
      <Flex
        alignItems="center"
        gap={ 2 }
        px={{ base: 4, lg: 6 }}
        pt={{ base: 4, lg: 6 }}
        pb={ 5 }
      >
        <Box
          position="relative"
          w="6px"
          h="6px"
          borderRadius="50%"
          bg="green.500"
          boxShadow="0 0 6px rgba(34, 197, 94, 0.6)"
          _dark={{
            boxShadow: '0 0 8px rgba(34, 197, 94, 0.8)',
          }}
          animation="pulseOpacity 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
        />
        <Text
          fontSize="11px"
          fontWeight={ 500 }
          letterSpacing="0.1em"
          textTransform="uppercase"
          color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          Latest transactions
        </Text>
      </Flex>
      <Box>
        { content }
      </Box>
    </Box>
  );
};

export default LatestTransactions;
