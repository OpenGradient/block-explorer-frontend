import { Grid, Text, Box, Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import { getAllTasks } from 'lib/opengradient/contracts/scheduler';
import { HOMEPAGE_STATS, HOMEPAGE_STATS_MICROSERVICE } from 'stubs/stats';
import { LinkBox, LinkOverlay } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import IconSvg from 'ui/shared/IconSvg';

import { HOME_BRAND } from './brand';
import isStatsMicroserviceEnabled from './utils/isStatsMicroserviceEnabled';

const { fonts, text } = HOME_BRAND;

const Stats = () => {
  const statsQuery = useApiQuery('stats_main', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: isStatsMicroserviceEnabled ? HOMEPAGE_STATS_MICROSERVICE : undefined,
      enabled: isStatsMicroserviceEnabled,
    },
  });

  const apiQuery = useApiQuery('stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const workflowsQuery = useQuery({
    queryKey: [ 'opengradient', 'getAllTasks' ],
    queryFn: getAllTasks,
    refetchOnMount: false,
  });

  const totalTransactions = React.useMemo(() => {
    const statsData = statsQuery.isPlaceholderData ? undefined : statsQuery.data;
    const apiData = apiQuery.isPlaceholderData ? undefined : apiQuery.data;

    if (statsData?.total_transactions?.value) {
      return Number(statsData.total_transactions.value);
    }

    if (apiData?.total_transactions) {
      return Number(apiData.total_transactions);
    }

    return null;
  }, [ statsQuery.data, statsQuery.isPlaceholderData, apiQuery.data, apiQuery.isPlaceholderData ]);

  const activeWorkflowsCount = React.useMemo(() => {
    const tasks = workflowsQuery.data ?? [];
    const now = BigInt(Math.floor(Date.now() / 1000));
    return tasks.filter((t) => t.endTime > now).length;
  }, [ workflowsQuery.data ]);

  const formatTransactionCount = (count: number | null): string => {
    if (count === null) {
      return '-';
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
      value: '1000+',
      href: 'https://hub.opengradient.ai',
      external: true,
    },
    {
      label: 'Transactions',
      value: formatTransactionCount(totalTransactions),
      isLoading: totalTransactions === null && (statsQuery.isPending || apiQuery.isPending),
      href: route({ pathname: '/txs' }),
      external: false,
    },
    {
      label: 'Inference Nodes',
      value: '16',
    },
    {
      label: 'Active AI Workflows',
      value: activeWorkflowsCount.toLocaleString(),
      isLoading: workflowsQuery.isPlaceholderData,
      href: route({ pathname: '/workflows' }),
      external: false,
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
                letterSpacing="0.16em"
                textTransform="uppercase"
                color={ text.accent }
                fontFamily={ fonts.mono }
              >
                { metric.label }
              </Text>
              { metric.href && (
                <IconSvg
                  name={ metric.external ? 'link_external' : 'link' }
                  boxSize={ 3 }
                  color={ text.accent }
                />
              ) }
            </Flex>
            <Skeleton
              loading={ metric.isLoading }
              w="fit-content"
            >
              <Text
                fontSize={{ base: '24px', lg: '36px' }}
                fontWeight={ 500 }
                letterSpacing="0"
                color={ text.primary }
                lineHeight="1.1"
                fontFamily={ fonts.mono }
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
          borderColor: { _light: 'rgba(36, 188, 227, 0.15)', _dark: 'rgba(36, 188, 227, 0.10)' },
        };

        if (metric.href) {
          let linkHref: string;
          if (metric.external) {
            linkHref = metric.href;
          } else if (metric.label === 'Transactions') {
            linkHref = route({ pathname: '/txs' as const });
          } else {
            linkHref = route({ pathname: '/workflows' as const });
          }

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
