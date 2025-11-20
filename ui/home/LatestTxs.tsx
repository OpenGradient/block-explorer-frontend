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

  if (isError) {
    return <Text mt={ 4 }>No data. Please reload the page.</Text>;
  }

  if (data) {
    const txsUrl = route({ pathname: '/txs' });
    return (
      <>
        <SocketNewItemsNotice borderBottomRadius={ 0 } url={ txsUrl } num={ num } alert={ socketAlert } isLoading={ isPlaceholderData }/>
        <Box display={{ base: 'block', lg: 'none' }} width="100%">
          { data.slice(0, txsCount).map(((tx, index) => (
            <LatestTxsItemMobile
              key={ tx.hash + (isPlaceholderData ? index : '') }
              tx={ tx }
              isLoading={ isPlaceholderData }
            />
          ))) }
        </Box>
        <AddressHighlightProvider>
          <Box display={{ base: 'none', lg: 'block' }} width="100%">
            { data.slice(0, txsCount).map(((tx, index) => (
              <LatestTxsItem
                key={ tx.hash + (isPlaceholderData ? index : '') }
                tx={ tx }
                isLoading={ isPlaceholderData }
              />
            ))) }
          </Box>
        </AddressHighlightProvider>
        <Box mt={ 4 }>
          <Link
            textStyle="sm"
            href={ txsUrl }
            color={{ _light: 'blue.600', _dark: 'blue.300' }}
            fontWeight={ 500 }
            px={ 4 }
            py={ 2 }
            width="100%"
            display="block"
            textAlign="center"
            transition="all 0.2s"
            _hover={{
              textDecoration: 'none',
              bg: { _light: 'blue.50', _dark: 'blue.900' },
              color: { _light: 'blue.700', _dark: 'blue.200' },
            }}
          >
            View all transactions
          </Link>
        </Box>
      </>
    );
  }

  return null;
};

export default LatestTransactions;
