import { chakra, Box } from '@chakra-ui/react';
import React from 'react';

import type { TimeChartData } from 'ui/shared/chart/types';

import ContentLoader from 'ui/shared/ContentLoader';

import ChainIndicatorChartContent from './ChainIndicatorChartContent';

type Props = {
  data: TimeChartData;
  isError: boolean;
  isPending: boolean;
};

const ChainIndicatorChartContainer = ({ data, isError, isPending }: Props) => {

  if (isPending) {
    return <ContentLoader mt="auto" fontSize="xs"/>;
  }

  if (isError) {
    return <chakra.span fontSize="xs">No historical data</chakra.span>;
  }

  if (data[0].items.length === 0) {
    return <chakra.span fontSize="xs">No historical data</chakra.span>;
  }

  return (
    <Box h="100%" w="100%">
      <ChainIndicatorChartContent data={ data }/>
    </Box>
  );
};

export default React.memo(ChainIndicatorChartContainer);
