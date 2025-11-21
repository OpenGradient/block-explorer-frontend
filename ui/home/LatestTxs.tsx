import { Box, Text } from '@chakra-ui/react';
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
    content = <Text>No data. Please reload the page.</Text>;
  }

  if (data) {
    const txsUrl = route({ pathname: '/txs' });
    content = (
      <>
        <SocketNewItemsNotice borderBottomRadius={ 0 } url={ txsUrl } num={ num } alert={ socketAlert } isLoading={ isPlaceholderData }/>
        <Box display={{ base: 'block', lg: 'none' }} width="100%">
          { data.slice(0, txsCount).map(((tx, index) => (
            <Box
              key={ tx.hash + (isPlaceholderData ? index : '') }
              borderBottom={ index < txsCount - 1 ? '1px solid' : 'none' }
              borderColor={{ _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(255, 255, 255, 0.08)' }}
            >
              <LatestTxsItemMobile
                tx={ tx }
                isLoading={ isPlaceholderData }
              />
            </Box>
          ))) }
        </Box>
        <AddressHighlightProvider>
          <Box display={{ base: 'none', lg: 'block' }} width="100%">
            { data.slice(0, txsCount).map(((tx, index) => (
              <Box
                key={ tx.hash + (isPlaceholderData ? index : '') }
                borderBottom={ index < txsCount - 1 ? '1px solid' : 'none' }
                borderColor={{ _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(255, 255, 255, 0.08)' }}
              >
                <LatestTxsItem
                  tx={ tx }
                  isLoading={ isPlaceholderData }
                />
              </Box>
            ))) }
          </Box>
        </AddressHighlightProvider>
        <Box mt={ 2 } px={{ base: 3, lg: 4 }} pb={{ base: 3, lg: 4 }}>
          <Link
            href={ txsUrl }
            fontSize={{ base: '14px', lg: '15px' }}
            fontWeight={ 500 }
            letterSpacing="0.05em"
            textTransform="uppercase"
            color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
            fontFamily="system-ui, -apple-system, sans-serif"
            width="100%"
            display="block"
            textAlign="center"
            py={ 2 }
            transition="opacity 0.2s ease"
            _hover={{
              textDecoration: 'none',
              opacity: 0.7,
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
      <Box px={{ base: 3, lg: 4 }} pt={{ base: 3, lg: 5 }} pb={ 5 }>
        <Text
          fontSize={{ base: '14px', lg: '18px' }}
          fontWeight={ 500 }
          letterSpacing="0.05em"
          textTransform="uppercase"
          color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          Latest transactions
        </Text>
      </Box>
      <Box>
        { content }
      </Box>
    </Box>
  );
};

export default LatestTransactions;
