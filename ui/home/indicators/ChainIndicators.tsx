import { Grid, Text, Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { TChainIndicator } from './types';
import type { ChainIndicatorId } from 'types/homepage';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { HOMEPAGE_STATS, HOMEPAGE_STATS_MICROSERVICE } from 'stubs/stats';
import { Skeleton } from 'toolkit/chakra/skeleton';
import Hint from 'ui/shared/Hint';
import IconSvg from 'ui/shared/IconSvg';

import ChainIndicatorChartContainer from './ChainIndicatorChartContainer';
import useChartDataQuery from './useChartDataQuery';
import getIndicatorValues from './utils/getIndicatorValues';
import INDICATORS from './utils/indicators';

const isStatsFeatureEnabled = config.features.stats.isEnabled;

const indicators = INDICATORS
  .filter(({ id }) => config.UI.homepage.charts.includes(id))
  .sort((a, b) => {
    if (config.UI.homepage.charts.indexOf(a.id) > config.UI.homepage.charts.indexOf(b.id)) {
      return 1;
    }

    if (config.UI.homepage.charts.indexOf(a.id) < config.UI.homepage.charts.indexOf(b.id)) {
      return -1;
    }

    return 0;
  });

const ChainIndicators = () => {
  const [ selectedIndicator, selectIndicator ] = React.useState(indicators[0]?.id);
  const selectedIndicatorData = indicators.find(({ id }) => id === selectedIndicator);

  const queryResult = useChartDataQuery(selectedIndicatorData?.id as ChainIndicatorId);

  const statsMicroserviceQueryResult = useApiQuery('stats_main', {
    queryOptions: {
      refetchOnMount: false,
      enabled: isStatsFeatureEnabled,
      placeholderData: HOMEPAGE_STATS_MICROSERVICE,
    },
  });

  const statsApiQueryResult = useApiQuery('stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const handleIndicatorClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const id = event.currentTarget.getAttribute('data-indicator-id') as ChainIndicatorId;
    if (id) {
      selectIndicator(id);
    }
  }, []);

  if (indicators.length === 0) {
    return null;
  }

  const isPlaceholderData = (isStatsFeatureEnabled && statsMicroserviceQueryResult.isPlaceholderData) || statsApiQueryResult.isPlaceholderData;
  const hasData = Boolean(statsApiQueryResult?.data || statsMicroserviceQueryResult?.data);

  const { value: indicatorValue, valueDiff: indicatorValueDiff } =
    getIndicatorValues(selectedIndicatorData as TChainIndicator, statsMicroserviceQueryResult?.data, statsApiQueryResult?.data);

  const title = (() => {
    let title: string | undefined;
    if (isStatsFeatureEnabled && selectedIndicatorData?.titleMicroservice && statsMicroserviceQueryResult?.data) {
      title = selectedIndicatorData.titleMicroservice(statsMicroserviceQueryResult.data);
    }

    return title || selectedIndicatorData?.title;
  })();

  const hint = (() => {
    let hint: string | undefined;
    if (isStatsFeatureEnabled && selectedIndicatorData?.hintMicroservice && statsMicroserviceQueryResult?.data) {
      hint = selectedIndicatorData.hintMicroservice(statsMicroserviceQueryResult.data);
    }

    return hint || selectedIndicatorData?.hint;
  })();

  const valueTitle = (() => {
    if (isPlaceholderData) {
      return <Skeleton loading h={{ base: '24px', lg: '36px' }} w="fit-content"/>;
    }

    if (!hasData) {
      return <Text fontSize={{ base: '24px', lg: '36px' }} fontWeight={ 300 }>—</Text>;
    }

    return (
      <Text
        fontSize={{ base: '24px', lg: '36px' }}
        fontWeight={ 300 }
        letterSpacing="-0.02em"
        color={{ _light: 'rgba(0, 0, 0, 0.9)', _dark: 'rgba(255, 255, 255, 0.95)' }}
        lineHeight="1.1"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        { indicatorValue }
      </Text>
    );
  })();

  const valueDiff = (() => {
    if (indicatorValueDiff === undefined || indicatorValueDiff === null) {
      return null;
    }

    const diffColor = indicatorValueDiff >= 0 ?
      { _light: 'rgba(34, 197, 94, 0.8)', _dark: 'rgba(74, 222, 128, 0.8)' } :
      { _light: 'rgba(239, 68, 68, 0.8)', _dark: 'rgba(248, 113, 113, 0.8)' };

    return (
      <Skeleton
        loading={ statsApiQueryResult.isPlaceholderData }
        display="flex"
        alignItems="center"
        ml={ 2 }
      >
        <IconSvg
          name="arrows/up-head"
          boxSize={ 3 }
          mr={ 0.5 }
          transform={ indicatorValueDiff < 0 ? 'rotate(180deg)' : 'rotate(0)' }
          color={ diffColor }
        />
        <Text
          fontSize="xs"
          fontWeight={ 500 }
          color={ diffColor }
        >
          { Math.abs(indicatorValueDiff) }%
        </Text>
      </Skeleton>
    );
  })();

  // Create a grid layout similar to Stats.tsx
  const gridItems = indicators.map((indicator) => {
    const { value, valueDiff: diff } = getIndicatorValues(indicator, statsMicroserviceQueryResult?.data, statsApiQueryResult?.data);
    const isSelected = selectedIndicator === indicator.id;

    return {
      id: indicator.id,
      label: indicator.title,
      value,
      valueDiff: diff,
      icon: indicator.icon,
      isSelected,
    };
  });

  return (
    <Box w="100%">
      { /* Main selected indicator display */ }
      <Box
        p={{ base: 3, lg: 4 }}
        borderBottom="1px solid"
        borderColor={{ _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(255, 255, 255, 0.08)' }}
      >
        <Flex
          alignItems="center"
          gap={ 1.5 }
          mb={{ base: 2, lg: 3 }}
        >
          <Text
            fontSize="11px"
            fontWeight={ 500 }
            letterSpacing="0.1em"
            textTransform="uppercase"
            color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            { title }
          </Text>
          { hint && <Hint label={ hint }/> }
        </Flex>
        <Flex mb={{ base: 2, lg: 3 }} alignItems="end">
          { valueTitle }
          { valueDiff }
        </Flex>
        <Box h={{ base: '60px', lg: '80px' }} w="100%">
          <ChainIndicatorChartContainer { ...queryResult }/>
        </Box>
      </Box>

      { /* Indicator selector grid */ }
      { indicators.length > 1 && (
        <Grid
          gridTemplateColumns={{ base: '1fr', md: `repeat(${ Math.min(indicators.length, 2) }, 1fr)` }}
          gridGap={ 0 }
          w="100%"
        >
          { gridItems.map((item, index) => {
            const isLastRow = index >= gridItems.length - (gridItems.length % 2 === 0 ? 2 : 1);
            const isEvenIndex = index % 2 === 0;
            const isLastItem = index === gridItems.length - 1;

            const valueContent = (() => {
              if (!hasData) {
                return (
                  <Text
                    fontSize="sm"
                    fontWeight={ 300 }
                    color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
                  >
                    no data
                  </Text>
                );
              }

              return (
                <Skeleton loading={ isPlaceholderData } w="fit-content">
                  <Text
                    fontSize="sm"
                    fontWeight={ 300 }
                    color={{ _light: 'rgba(0, 0, 0, 0.7)', _dark: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    { item.value }
                  </Text>
                </Skeleton>
              );
            })();

            const diffContent = (() => {
              if (item.valueDiff === undefined || item.valueDiff === null) {
                return null;
              }

              const diffColor = item.valueDiff >= 0 ?
                { _light: 'rgba(34, 197, 94, 0.7)', _dark: 'rgba(74, 222, 128, 0.7)' } :
                { _light: 'rgba(239, 68, 68, 0.7)', _dark: 'rgba(248, 113, 113, 0.7)' };

              return (
                <Skeleton loading={ isPlaceholderData } display="flex" alignItems="center" ml={ 1 }>
                  <IconSvg
                    name="arrows/up-head"
                    boxSize={ 2.5 }
                    mr={ 0.5 }
                    transform={ item.valueDiff < 0 ? 'rotate(180deg)' : 'rotate(0)' }
                    color={ diffColor }
                  />
                  <Text
                    fontSize="xs"
                    fontWeight={ 500 }
                    color={ diffColor }
                  >
                    { Math.abs(item.valueDiff) }%
                  </Text>
                </Skeleton>
              );
            })();

            return (
              <Box
                key={ item.id }
                data-indicator-id={ item.id }
                p={{ base: 3, lg: 4 }}
                borderBottom={{ base: !isLastItem ? '1px solid' : 'none', md: !isLastRow ? '1px solid' : 'none' }}
                borderRight={{ base: 'none', md: isEvenIndex && !isLastItem ? '1px solid' : 'none' }}
                borderColor={{ _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(255, 255, 255, 0.08)' }}
                cursor="pointer"
                transition="background-color 0.2s ease"
                bgColor={ item.isSelected ? { _light: 'rgba(0, 0, 0, 0.02)', _dark: 'rgba(255, 255, 255, 0.03)' } : undefined }
                _hover={{
                  bgColor: { _light: 'rgba(0, 0, 0, 0.02)', _dark: 'rgba(255, 255, 255, 0.03)' },
                }}
                onClick={ handleIndicatorClick }
              >
                <Flex alignItems="center" gap={ 1.5 } mb={ 1.5 }>
                  <Box opacity={ item.isSelected ? 1 : 0.6 }>
                    { item.icon }
                  </Box>
                  <Text
                    fontSize="10px"
                    fontWeight={ 500 }
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                    color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    { item.label }
                  </Text>
                </Flex>
                <Flex alignItems="center">
                  { valueContent }
                  { diffContent }
                </Flex>
              </Box>
            );
          }) }
        </Grid>
      ) }
    </Box>
  );
};

export default ChainIndicators;
