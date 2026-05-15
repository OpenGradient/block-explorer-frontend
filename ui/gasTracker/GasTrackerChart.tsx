import { Box, Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import { Resolution } from '@blockscout/stats-types';
import type { Block, BlocksResponse } from 'types/api/block';
import type { TimeChartItem } from 'ui/shared/chart/types';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import { Link } from 'toolkit/chakra/link';
import { OPENGRADIENT_BRAND } from 'ui/opengradient/brand';
import ChartWidget from 'ui/shared/chart/ChartWidget';
import useChartQuery from 'ui/shared/chart/useChartQuery';

const GAS_PRICE_CHART_ID = 'averageGasPrice';
const DEFAULT_GAS_PRICE_CHART = {
  title: 'Average gas price',
  description: 'Average gas price for the period',
  units: 'Gwei',
};
const RECENT_BLOCK_GAS_CHART = {
  title: 'Recent block gas price',
  description: 'Base fee per gas from latest blocks',
  units: 'Gwei',
};
const RECENT_BLOCK_USAGE_CHART = {
  title: 'Recent block utilization',
  description: 'Gas used across latest blocks',
  units: '%',
};
const BLOCKS_PLACEHOLDER: BlocksResponse = {
  items: [],
  next_page_params: null,
};

const GasTrackerChart = () => {
  const { items: statsItems, lineQuery } = useChartQuery(GAS_PRICE_CHART_ID, Resolution.DAY, 'oneMonth');
  const shouldUseRecentBlocks = lineQuery.isError || (!lineQuery.isPlaceholderData && (!statsItems || statsItems.length < 3));

  const blocksQuery = useApiQuery('blocks', {
    queryOptions: {
      enabled: shouldUseRecentBlocks,
      placeholderData: BLOCKS_PLACEHOLDER,
    },
  });

  const recentBlockFallback = React.useMemo(() => buildRecentBlockFallback(blocksQuery.data?.items), [ blocksQuery.data?.items ]);
  const chart = shouldUseRecentBlocks ? recentBlockFallback.chart : DEFAULT_GAS_PRICE_CHART;
  const chartItems = shouldUseRecentBlocks ? recentBlockFallback.items : statsItems;
  const isLoading = lineQuery.isPlaceholderData || (shouldUseRecentBlocks && blocksQuery.isPlaceholderData);
  const isError = shouldUseRecentBlocks && blocksQuery.isError;

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={ 6 }>
        <chakra.h3 color={ OPENGRADIENT_BRAND.text.primary } textStyle="h3">Gas activity</chakra.h3>
        <Link href={ route({ pathname: '/stats', hash: 'gas' }) }>Charts & stats</Link>
      </Flex>
      <ChartWidget
        title={ chart.title }
        description={ chart.description }
        units={ chart.units }
        items={ chartItems }
        isLoading={ isLoading }
        isError={ isError }
        emptyText="No gas price samples yet"
        h="320px"
      />
    </Box>
  );
};

export default React.memo(GasTrackerChart);

function buildRecentBlockFallback(blocks?: Array<Block>): { chart: typeof RECENT_BLOCK_GAS_CHART; items?: Array<TimeChartItem> } {
  const priceItems = blocksToChartItems(blocks, (block) => Number(block.base_fee_per_gas ?? 0) / 1_000_000_000);
  const hasGasPriceMovement = Boolean(priceItems?.some((item) => item.value > 0));

  if (hasGasPriceMovement) {
    return {
      chart: RECENT_BLOCK_GAS_CHART,
      items: priceItems,
    };
  }

  return {
    chart: RECENT_BLOCK_USAGE_CHART,
    items: blocksToChartItems(blocks, getBlockUtilization),
  };
}

function blocksToChartItems(blocks: Array<Block> | undefined, getValue: (block: Block) => number): Array<TimeChartItem> | undefined {
  const items = blocks
    ?.filter((block) => block.type === 'block')
    .slice()
    .reverse()
    .map((block) => {
      const value = getValue(block);

      return {
        date: new Date(block.timestamp),
        date_to: new Date(block.timestamp),
        value: Number.isFinite(value) ? value : 0,
      };
    });

  return items && items.length > 2 ? items : undefined;
}

function getBlockUtilization(block: Block): number {
  if (typeof block.gas_used_percentage === 'number') {
    return block.gas_used_percentage;
  }

  const gasUsed = Number(block.gas_used ?? 0);
  const gasLimit = Number(block.gas_limit);

  if (!Number.isFinite(gasUsed) || !Number.isFinite(gasLimit) || gasLimit === 0) {
    return 0;
  }

  return (gasUsed / gasLimit) * 100;
}
