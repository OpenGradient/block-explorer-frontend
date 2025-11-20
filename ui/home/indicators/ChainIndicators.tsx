import { Flex, Text } from '@chakra-ui/react';
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
import ChainIndicatorItem from './ChainIndicatorItem';
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
      return <Skeleton loading h="36px" w="215px"/>;
    }

    if (!hasData) {
      return <Text fontSize="xs">There is no data</Text>;
    }

    return (
      <Text fontWeight={ 700 } fontSize="32px" lineHeight="40px" letterSpacing="-0.02em">
        { indicatorValue }
      </Text>
    );
  })();

  const valueDiff = (() => {
    if (indicatorValueDiff === undefined || indicatorValueDiff === null) {
      return null;
    }

    const diffColor = indicatorValueDiff >= 0 ? 'green.500' : 'red.500';

    return (
      <Skeleton loading={ statsApiQueryResult.isPlaceholderData } display="flex" alignItems="center" color={ diffColor } ml={ 2 }>
        <IconSvg name="arrows/up-head" boxSize={ 5 } mr={ 1 } transform={ indicatorValueDiff < 0 ? 'rotate(180deg)' : 'rotate(0)' }/>
        <Text color={ diffColor } fontWeight={ 600 }>{ indicatorValueDiff }%</Text>
      </Skeleton>
    );
  })();

  return (
    <Flex
      px={{ base: 4, lg: 6 }}
      py={ 4 }
      borderRadius="xl"
      bgColor={{ _light: 'white', _dark: 'whiteAlpha.50' }}
      border="1px solid"
      borderColor={{ _light: 'gray.100', _dark: 'whiteAlpha.200' }}
      boxShadow={{ _light: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)', _dark: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)' }}
      columnGap={{ base: 3, lg: 4 }}
      rowGap={ 0 }
      flexBasis="50%"
      flexGrow={ 1 }
      alignItems="stretch"
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
      <Flex flexGrow={ 1 } flexDir="column">
        <Flex alignItems="center" mb={ 2 }>
          <Text fontWeight={ 600 } fontSize="sm" textTransform="uppercase" letterSpacing="0.05em" color="text.secondary">{ title }</Text>
          { hint && <Hint label={ hint } ml={ 1 }/> }
        </Flex>
        <Flex mb={{ base: 2, lg: 3 }} mt={ 1 } alignItems="end">
          { valueTitle }
          { valueDiff }
        </Flex>
        <Flex h={{ base: '80px', lg: '110px' }} alignItems="flex-start" flexGrow={ 1 }>
          <ChainIndicatorChartContainer { ...queryResult }/>
        </Flex>
      </Flex>
      { indicators.length > 1 && (
        <Flex
          flexShrink={ 0 }
          flexDir="column"
          as="ul"
          borderRadius="lg"
          rowGap="6px"
          m={{ base: 'auto 0', lg: 0 }}
        >
          { indicators.map((indicator) => (
            <ChainIndicatorItem
              key={ indicator.id }
              id={ indicator.id }
              title={ indicator.title }
              icon={ indicator.icon }
              isSelected={ selectedIndicator === indicator.id }
              onClick={ selectIndicator }
              { ...getIndicatorValues(indicator, statsMicroserviceQueryResult?.data, statsApiQueryResult?.data) }
              isLoading={ isPlaceholderData }
              hasData={ hasData }
            />
          )) }
        </Flex>
      ) }
    </Flex>
  );
};

export default ChainIndicators;
