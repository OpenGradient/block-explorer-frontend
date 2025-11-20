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
      <>
        <Box px={{ base: 4, lg: 6 }} pt={{ base: 4, lg: 6 }} pb={ 4 }>
          <Heading
            level="3"
            fontSize={{ base: 'xl', lg: '2xl' }}
            fontWeight={ 700 }
            letterSpacing="-0.02em"
            mb={ 4 }
          >
            Transactions
          </Heading>
        </Box>
        <Box px={{ base: 4, lg: 6 }}>
          <AdaptiveTabs tabs={ tabs } unmountOnExit={ false }/>
        </Box>
      </>
    );
  }

  return (
    <>
      <Box px={{ base: 4, lg: 6 }} pt={{ base: 4, lg: 6 }} pb={ 4 }>
        <Heading
          level="3"
          fontSize={{ base: 'xl', lg: '2xl' }}
          fontWeight={ 700 }
          letterSpacing="-0.02em"
        >
          Latest transactions
        </Heading>
      </Box>
      <LatestTxs/>
    </>
  );
};

export default TransactionsHome;
