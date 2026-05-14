import { SimpleGrid } from '@chakra-ui/react';
import React from 'react';

import type { GasPrices } from 'types/api/stats';

import GasTrackerPriceSnippet from './GasTrackerPriceSnippet';

interface Props {
  prices: GasPrices;
  isLoading: boolean;
}

const GasTrackerPrices = ({ prices, isLoading }: Props) => {
  return (
    <SimpleGrid
      as="ul"
      columns={{ base: 1, lg: 3 }}
      gap={ 4 }
    >
      { prices.fast && <GasTrackerPriceSnippet type="fast" data={ prices.fast } isLoading={ isLoading }/> }
      { prices.average && <GasTrackerPriceSnippet type="average" data={ prices.average } isLoading={ isLoading }/> }
      { prices.slow && <GasTrackerPriceSnippet type="slow" data={ prices.slow } isLoading={ isLoading }/> }
    </SimpleGrid>
  );
};

export default React.memo(GasTrackerPrices);
