import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TimeChartData } from 'ui/shared/chart/types';

import ContentLoader from 'ui/shared/ContentLoader';

import ChainIndicatorChartContent from './ChainIndicatorChartContent';

type Props = {
  data: TimeChartData;
  isError: boolean;
  isPending: boolean;
};

// Create a default TimeChartData structure with boundary items for valid date range in ghost chart
function createGhostChartData(originalData?: TimeChartData): TimeChartData {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Create two boundary items to establish valid date and value ranges for the scales
  // Using 0 and 100 to create a proper Y-axis domain that will be "niced" by the scale
  return [ {
    items: [
      { date: thirtyDaysAgo, value: 0 },
      { date: now, value: 100 },
    ],
    name: originalData?.[0]?.name || '',
    valueFormatter: originalData?.[0]?.valueFormatter,
  } ];
}

const ChainIndicatorChartContainer = ({ data, isError, isPending }: Props) => {

  if (isPending) {
    return <ContentLoader mt="auto" fontSize="xs"/>;
  }

  // For error or empty data, render ghost chart with grid lines and axes
  const chartData = (isError || data[0]?.items.length === 0) ? createGhostChartData(data) : data;
  const isEmpty = isError || data[0]?.items.length === 0;

  return (
    <Box h="100%" w="100%">
      <ChainIndicatorChartContent data={ chartData } isEmpty={ isEmpty }/>
    </Box>
  );
};

export default React.memo(ChainIndicatorChartContainer);
