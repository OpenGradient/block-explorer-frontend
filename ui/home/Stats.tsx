import { Grid, Text, Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { HOMEPAGE_STATS, HOMEPAGE_STATS_MICROSERVICE } from 'stubs/stats';
import { LinkBox, LinkOverlay } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import IconSvg from 'ui/shared/IconSvg';

const isStatsFeatureEnabled = config.features.stats.isEnabled;

const Stats = () => {
  // Fetch stats data
  const statsQuery = useApiQuery('stats_main', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: isStatsFeatureEnabled ? HOMEPAGE_STATS_MICROSERVICE : undefined,
      enabled: isStatsFeatureEnabled,
    },
  });

  const apiQuery = useApiQuery('stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const isPlaceholderData = statsQuery.isPlaceholderData || apiQuery.isPlaceholderData;

  // Get total transactions from either microservice or regular API
  const totalTransactions = React.useMemo(() => {
    const statsData = statsQuery.data;
    const apiData = apiQuery.data;

    if (statsData?.total_transactions?.value) {
      return Number(statsData.total_transactions.value);
    }

    if (apiData?.total_transactions) {
      return Number(apiData.total_transactions);
    }

    return null;
  }, [ statsQuery.data, apiQuery.data ]);

  // Format number with compact notation
  const formatTransactionCount = (count: number | null): string => {
    if (count === null) {
      return '—';
    }

    if (count >= 1_000_000) {
      return `${ (count / 1_000_000).toFixed(1) }M`;
    }

    if (count >= 1_000) {
      return `${ (count / 1_000).toFixed(1) }K`;
    }

    return count.toLocaleString();
  };

  const metrics = [
    {
      label: 'Models Hosted',
      value: '435',
      href: 'https://hub.opengradient.ai',
      external: true,
    },
    {
      label: 'Transactions',
      value: formatTransactionCount(totalTransactions),
      isLoading: isPlaceholderData,
      href: route({ pathname: '/txs' }),
      external: false,
    },
    {
      label: 'Inference Nodes',
      value: '16',
    },
    {
      label: 'Blockchain Validators',
      value: '4',
    },
  ];

  return (
    <Grid
      gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
      gridGap={ 0 }
      w="100%"
    >
      { metrics.map((metric, index) => {
        const isLastRow = index >= metrics.length - 2;
        const isEvenIndex = index % 2 === 0;
        const isLastItem = index === metrics.length - 1;

        const content = (
          <>
            <Flex
              alignItems="center"
              gap={ 1.5 }
              mb={{ base: 2, lg: 3 }}
            >
              <Text
                fontSize={{ base: '10px', lg: '11px' }}
                fontWeight={ 500 }
                letterSpacing="0.05em"
                textTransform="uppercase"
                color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                { metric.label }
              </Text>
              { metric.href && (
                <IconSvg
                  name={ metric.external ? 'link_external' : 'link' }
                  boxSize={ 3 }
                  color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
                />
              ) }
            </Flex>
            <Skeleton
              loading={ metric.isLoading }
              w="fit-content"
            >
              <Text
                fontSize={{ base: '24px', lg: '36px' }}
                fontWeight={ 300 }
                letterSpacing="-0.02em"
                color={{ _light: 'rgba(0, 0, 0, 0.9)', _dark: 'rgba(255, 255, 255, 0.95)' }}
                lineHeight="1.1"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                { metric.value }
              </Text>
            </Skeleton>
          </>
        );

        const boxProps = {
          p: { base: 3, lg: 4 },
          borderBottom: { base: !isLastItem ? '1px solid' : 'none', md: !isLastRow ? '1px solid' : 'none' },
          borderRight: { base: 'none', md: isEvenIndex && !isLastItem ? '1px solid' : 'none' },
          borderColor: { _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(255, 255, 255, 0.08)' },
        };

        if (metric.href) {
          const linkHref = metric.external ?
            metric.href :
            route({ pathname: '/txs' as const });

          return (
            <LinkBox
              key={ metric.label }
              { ...boxProps }
              transition="opacity 0.2s ease"
              _hover={{ opacity: 0.7 }}
            >
              <LinkOverlay
                href={ linkHref }
                external={ metric.external }
                noIcon
              />
              { content }
            </LinkBox>
          );
        }

        return (
          <Box
            key={ metric.label }
            { ...boxProps }
          >
            { content }
          </Box>
        );
      }) }
    </Grid>
  );
};

export default Stats;
