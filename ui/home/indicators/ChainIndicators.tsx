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

import { HOME_BRAND } from '../brand';
import isStatsMicroserviceEnabled from '../utils/isStatsMicroserviceEnabled';
import ChainIndicatorChartContainer from './ChainIndicatorChartContainer';
import useChartDataQuery from './useChartDataQuery';
import getIndicatorValues from './utils/getIndicatorValues';
import INDICATORS from './utils/indicators';

const { colors, fonts, panel, text } = HOME_BRAND;

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
      enabled: isStatsMicroserviceEnabled,
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

  const statsMicroserviceData = isStatsMicroserviceEnabled && !statsMicroserviceQueryResult.isPlaceholderData ?
    statsMicroserviceQueryResult.data :
    undefined;
  const statsApiData = !statsApiQueryResult.isPlaceholderData ? statsApiQueryResult.data : undefined;
  const isLoading = !statsMicroserviceData && !statsApiData && (statsMicroserviceQueryResult.isPending || statsApiQueryResult.isPending);
  const hasData = Boolean(statsApiData || statsMicroserviceData);

  const { value: indicatorValue, valueDiff: indicatorValueDiff } =
    getIndicatorValues(selectedIndicatorData as TChainIndicator, statsMicroserviceData, statsApiData);

  const title = (() => {
    let title: string | undefined;
    if (isStatsMicroserviceEnabled && selectedIndicatorData?.titleMicroservice && statsMicroserviceData) {
      title = selectedIndicatorData.titleMicroservice(statsMicroserviceData);
    }

    return title || selectedIndicatorData?.title;
  })();

  const hint = (() => {
    let hint: string | undefined;
    if (isStatsMicroserviceEnabled && selectedIndicatorData?.hintMicroservice && statsMicroserviceData) {
      hint = selectedIndicatorData.hintMicroservice(statsMicroserviceData);
    }

    return hint || selectedIndicatorData?.hint;
  })();

  const valueTitle = (() => {
    if (isLoading) {
      return <Skeleton loading h={{ base: '18px', lg: '24px' }} w="fit-content"/>;
    }

    if (!hasData) {
      return <Text fontSize={{ base: '22px', lg: '30px' }} fontWeight={ 500 } fontFamily={ fonts.mono } color={ text.primary }>-</Text>;
    }

    return (
      <Text
        fontSize={{ base: '22px', lg: '30px' }}
        fontWeight={ 500 }
        letterSpacing="0"
        color={ text.primary }
        lineHeight="1.1"
        fontFamily={ fonts.mono }
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
      { _light: '#2e9e66', _dark: '#61d199' } :
      { _light: '#bf0d0d', _dark: '#f66f6f' };

    return (
      <Skeleton
        loading={ isLoading }
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
          fontFamily={ fonts.mono }
        >
          { Math.abs(indicatorValueDiff) }%
        </Text>
      </Skeleton>
    );
  })();

  const gridItems = indicators.map((indicator) => {
    const { value, valueDiff: diff } = getIndicatorValues(indicator, statsMicroserviceData, statsApiData);
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
    <Box
      w="100%"
      border="1px solid"
      borderColor={ panel.border }
      borderRadius="8px"
      bg={ panel.bg }
      boxShadow={ panel.shadow }
      backdropFilter="blur(18px)"
      overflow="hidden"
    >
      <Box
        p={{ base: 4, lg: 4 }}
        borderBottom="1px solid"
        borderColor={ panel.border }
        position="relative"
      >
        <Flex
          alignItems="center"
          gap={ 2 }
          mb={{ base: 2, lg: 3 }}
          position="relative"
          zIndex={ 1 }
        >
          <Box
            w="6px"
            h="6px"
            borderRadius="50%"
            bg={ colors.cyan }
            boxShadow="0 0 10px rgba(36, 188, 227, 0.65)"
            flexShrink={ 0 }
          />
          <Text
            fontSize="11px"
            fontWeight={ 500 }
            letterSpacing="0.12em"
            textTransform="uppercase"
            color={ text.accent }
            fontFamily={ fonts.mono }
          >
            / { title }
          </Text>
          { hint && <Hint label={ hint }/> }
        </Flex>
        <Flex mb={ 3 } alignItems="end" position="relative" zIndex={ 1 }>
          { valueTitle }
          { valueDiff }
        </Flex>
        <Box h={{ base: '78px', lg: '92px' }} w="100%" position="relative" zIndex={ 1 }>
          <ChainIndicatorChartContainer { ...queryResult }/>
        </Box>
      </Box>

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
                    fontWeight={ 500 }
                    color={ text.muted }
                    fontFamily={ fonts.mono }
                  >
                    no data
                  </Text>
                );
              }

              return (
                <Skeleton loading={ isLoading } w="fit-content">
                  <Text
                    fontSize="sm"
                    fontWeight={ 500 }
                    color={ text.secondary }
                    fontFamily={ fonts.mono }
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
                { _light: '#2e9e66', _dark: '#61d199' } :
                { _light: '#bf0d0d', _dark: '#f66f6f' };

              return (
                <Skeleton loading={ isLoading } display="flex" alignItems="center" ml={ 1 }>
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
                    fontFamily={ fonts.mono }
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
                p={ 3 }
                borderBottom={{ base: !isLastItem ? '1px solid' : 'none', md: !isLastRow ? '1px solid' : 'none' }}
                borderRight={{ base: 'none', md: isEvenIndex && !isLastItem ? '1px solid' : 'none' }}
                borderColor={ panel.border }
                cursor="pointer"
                transition="background-color 0.2s ease, color 0.2s ease"
                bgColor={ item.isSelected ? { _light: 'rgba(36, 188, 227, 0.07)', _dark: 'rgba(36, 188, 227, 0.10)' } : undefined }
                _hover={{
                  bgColor: { _light: 'rgba(36, 188, 227, 0.07)', _dark: 'rgba(36, 188, 227, 0.10)' },
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
                    letterSpacing="0.10em"
                    textTransform="uppercase"
                    color={ item.isSelected ? text.accent : text.muted }
                    fontFamily={ fonts.mono }
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
