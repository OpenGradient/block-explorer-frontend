import { Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { Heading } from 'toolkit/chakra/heading';
import AdaptiveTabs from 'toolkit/components/AdaptiveTabs/AdaptiveTabs';
import LatestOptimisticDeposits from 'ui/home/latestDeposits/LatestOptimisticDeposits';
import LatestTxs from 'ui/home/LatestTxs';
import LatestWatchlistTxs from 'ui/home/LatestWatchlistTxs';
import useAuth from 'ui/snippets/auth/useIsAuth';

import LatestArbitrumDeposits from './latestDeposits/LatestArbitrumDeposits';

const rollupFeature = config.features.rollup;

const TransactionsHome = () => {
  const isAuth = useAuth();
  if ((rollupFeature.isEnabled && (rollupFeature.type === 'optimistic' || rollupFeature.type === 'arbitrum')) || isAuth) {
    const tabs = [
      { id: 'txn', title: 'Latest txn', component: <LatestTxs/> },
      rollupFeature.isEnabled && rollupFeature.type === 'optimistic' &&
        { id: 'deposits', title: 'Deposits (L1→L2 txn)', component: <LatestOptimisticDeposits/> },
      rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' &&
        { id: 'deposits', title: 'Deposits (L1→L2 txn)', component: <LatestArbitrumDeposits/> },
      isAuth && { id: 'watchlist', title: 'Watch list', component: <LatestWatchlistTxs/> },
    ].filter(Boolean);
  return (
    <Box
      bgColor={{ _light: 'white', _dark: 'whiteAlpha.50' }}
      border="1px solid"
      borderColor={{ _light: 'gray.100', _dark: 'whiteAlpha.200' }}
      borderRadius="xl"
      p={ 5 }
      boxShadow={{ _light: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)', _dark: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)' }}
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 50%, rgba(59, 130, 246, 0.8) 100%)',
      }}
    >
      <Heading level="3" mb={ 4 } fontSize="lg" fontWeight={ 700 }>Transactions</Heading>
      <AdaptiveTabs tabs={ tabs } unmountOnExit={ false } listProps={{ mb: 3 }}/>
    </Box>
  );
  }

  return (
    <Box
      bgColor={{ _light: 'white', _dark: 'whiteAlpha.50' }}
      border="1px solid"
      borderColor={{ _light: 'gray.100', _dark: 'whiteAlpha.200' }}
      borderRadius="xl"
      p={ 5 }
      boxShadow={{ _light: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)', _dark: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)' }}
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 50%, rgba(59, 130, 246, 0.8) 100%)',
      }}
    >
      <Heading level="3" mb={ 4 } fontSize="lg" fontWeight={ 700 }>Latest transactions</Heading>
      <LatestTxs/>
    </Box>
  );
};

export default TransactionsHome;
