// we use custom heading size for hero banner

import { Box, Flex, VStack, Text, Grid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { getAllTasks } from 'lib/opengradient/contracts/scheduler';
import { HOMEPAGE_STATS, HOMEPAGE_STATS_MICROSERVICE } from 'stubs/stats';
import { LinkBox, LinkOverlay } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import IconSvg from 'ui/shared/IconSvg';
import SearchBar from 'ui/snippets/searchBar/SearchBar';

export const BACKGROUND_DEFAULT = { _light: 'gray.900', _dark: 'gray.800' };

const isStatsFeatureEnabled = config.features.stats.isEnabled;

const HeroBanner = () => {
  const configBackgroundLight = config.UI.homepage.heroBanner?.background?.[0] || config.UI.homepage.plate.background;
  const configBackgroundDark = config.UI.homepage.heroBanner?.background?.[1] ||
    config.UI.homepage.heroBanner?.background?.[0] ||
    config.UI.homepage.plate.background;

  const hasConfigBackground = Boolean(configBackgroundLight);
  const backgroundValue = hasConfigBackground ?
    { _light: configBackgroundLight, _dark: configBackgroundDark } :
    { _light: '#ffffff', _dark: '#0a0a0a' };

  // Fetch stats for hero metrics
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

  const workflowsQuery = useQuery({
    queryKey: [ 'opengradient', 'getAllTasks' ],
    queryFn: getAllTasks,
    refetchOnMount: false,
  });

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

  const activeWorkflowsCount = React.useMemo(() => {
    const tasks = workflowsQuery.data ?? [];
    const now = BigInt(Math.floor(Date.now() / 1000));
    return tasks.filter((t) => t.endTime > now).length;
  }, [ workflowsQuery.data ]);

  const formatNumber = (num: number | null): string => {
    if (num === null) return '—';
    if (num >= 1_000_000) return `${ (num / 1_000_000).toFixed(1) }M`;
    if (num >= 1_000) return `${ (num / 1_000).toFixed(1) }K`;
    return num.toLocaleString();
  };

  return (
    <Box
      position="relative"
      w="100%"
      overflow="hidden"
      background={ backgroundValue }
      border="none"
      borderRadius="0"
      borderBottom="1px solid"
      borderColor={{ _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(64, 209, 219, 0.1)' }}
      minH={{ base: 'auto', lg: 'auto' }}
    >
      { /* Subtle grid pattern - very minimal */ }
      <Box
        position="absolute"
        top={ 0 }
        left={ 0 }
        right={ 0 }
        bottom={ 0 }
        opacity={{ _light: 0.008, _dark: 0.02 }}
        backgroundImage={{
          _light: 'repeating-linear-gradient(0deg, transparent, transparent 99px, rgba(0, 0, 0, 0.03) 99px, rgba(0, 0, 0, 0.03) 100px), repeating-linear-gradient(90deg, transparent, transparent 99px, rgba(0, 0, 0, 0.03) 99px, rgba(0, 0, 0, 0.03) 100px)',
          _dark: 'repeating-linear-gradient(0deg, transparent, transparent 99px, rgba(64, 209, 219, 0.03) 99px, rgba(64, 209, 219, 0.03) 100px), repeating-linear-gradient(90deg, transparent, transparent 99px, rgba(64, 209, 219, 0.03) 99px, rgba(64, 209, 219, 0.03) 100px)',
        }}
        backgroundSize="100px 100px"
        pointerEvents="none"
      />

      <Box
        position="relative"
        zIndex={ 1 }
        maxW={{ base: '100%', xl: '1600px' }}
        mx="auto"
        px={{ base: 4, lg: 8, xl: 12 }}
        pt={{ base: 6, lg: 10, xl: 12 }}
        pb={{ base: 4, lg: 6, xl: 7 }}
      >
        <Grid
          templateColumns={{ base: '1fr', lg: '1.2fr 0.8fr' }}
          gap={{ base: 8, lg: 16 }}
          alignItems="flex-start"
        >
          { /* Left: Search + Title */ }
          <VStack
            align="stretch"
            gap={{ base: 4, lg: 5 }}
          >
            { /* Title Section */ }
            <Box>
              <Text
                fontSize={{ base: '32px', md: '48px', lg: '60px', xl: '66px' }}
                fontWeight={ 200 }
                letterSpacing="-0.04em"
                lineHeight="0.95"
                color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                OpenGradient Explorer
              </Text>
              <Text
                fontSize={{ base: '13px', md: '14px' }}
                fontWeight={ 400 }
                letterSpacing="0.02em"
                color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
                fontFamily="system-ui, -apple-system, sans-serif"
                mt={ 4 }
                maxW="500px"
              >
                Explore transactions, blocks, addresses, and AI workflows on the OpenGradient network.
              </Text>
            </Box>

            { /* Search Bar - Premium, polished */ }
            <Box
              w="100%"
              maxW={{ base: '100%', lg: '700px' }}
              position="relative"
              mt={ 2 }
            >
              <SearchBar isHomepage/>
            </Box>
          </VStack>

          { /* Right: Live Metrics Dashboard */ }
          <Box
            display={{ base: 'none', lg: 'block' }}
            position="relative"
          >
            <VStack
              align="stretch"
              gap={ 0 }
            >
              { /* Section Header */ }
              <Flex
                alignItems="center"
                gap={ 2 }
                mb={ 6 }
              >
                <Box
                  position="relative"
                  w="6px"
                  h="6px"
                  borderRadius="50%"
                  bg="green.500"
                  boxShadow="0 0 6px rgba(34, 197, 94, 0.6)"
                  _dark={{
                    boxShadow: '0 0 8px rgba(34, 197, 94, 0.8)',
                  }}
                  animation="pulseOpacity 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                />
                <Text
                  fontSize="11px"
                  fontWeight={ 500 }
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  Network Status
                </Text>
              </Flex>

              { /* Metrics Grid */ }
              <Grid
                templateColumns="1fr 1fr"
                gap={ 0 }
                overflow="hidden"
              >
                { /* Models Hosted */ }
                <LinkBox
                  p={ 5 }
                  borderRight="1px solid"
                  borderBottom="1px solid"
                  borderColor={{ _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(64, 209, 219, 0.1)' }}
                  transition="opacity 0.2s ease"
                  _hover={{ opacity: 0.7 }}
                >
                  <LinkOverlay
                    href="https://hub.opengradient.ai"
                    external
                    noIcon
                  />
                  <Flex
                    alignItems="center"
                    gap={ 1.5 }
                    mb={ 2 }
                  >
                    <Text
                      fontSize="10px"
                      fontWeight={ 500 }
                      letterSpacing="0.08em"
                      textTransform="uppercase"
                      color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
                      fontFamily="system-ui, -apple-system, sans-serif"
                    >
                      Models Hosted
                    </Text>
                    <IconSvg
                      name="link_external"
                      boxSize={ 3 }
                      color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
                    />
                  </Flex>
                  <Text
                    fontSize="32px"
                    fontWeight={ 200 }
                    letterSpacing="-0.02em"
                    color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                    fontFamily="system-ui, -apple-system, sans-serif"
                    lineHeight="1"
                  >
                    435
                  </Text>
                </LinkBox>

                { /* Inference Nodes */ }
                <Box
                  p={ 5 }
                  borderBottom="1px solid"
                  borderColor={{ _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(64, 209, 219, 0.1)' }}
                >
                  <Text
                    fontSize="10px"
                    fontWeight={ 500 }
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                    color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
                    fontFamily="system-ui, -apple-system, sans-serif"
                    mb={ 2 }
                  >
                    Inference Nodes
                  </Text>
                  <Text
                    fontSize="32px"
                    fontWeight={ 200 }
                    letterSpacing="-0.02em"
                    color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                    fontFamily="system-ui, -apple-system, sans-serif"
                    lineHeight="1"
                  >
                    16
                  </Text>
                </Box>

                { /* Transactions */ }
                <LinkBox
                  p={ 5 }
                  borderRight="1px solid"
                  borderColor={{ _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(64, 209, 219, 0.1)' }}
                  transition="opacity 0.2s ease"
                  _hover={{ opacity: 0.7 }}
                >
                  <LinkOverlay
                    href={ route({ pathname: '/txs' }) }
                    noIcon
                  />
                  <Flex
                    alignItems="center"
                    gap={ 1.5 }
                    mb={ 2 }
                  >
                    <Text
                      fontSize="10px"
                      fontWeight={ 500 }
                      letterSpacing="0.08em"
                      textTransform="uppercase"
                      color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
                      fontFamily="system-ui, -apple-system, sans-serif"
                    >
                      Transactions
                    </Text>
                    <IconSvg
                      name="link"
                      boxSize={ 3 }
                      color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
                    />
                  </Flex>
                  <Skeleton loading={ statsQuery.isPlaceholderData || apiQuery.isPlaceholderData } w="fit-content">
                    <Text
                      fontSize="32px"
                      fontWeight={ 200 }
                      letterSpacing="-0.02em"
                      color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                      fontFamily="system-ui, -apple-system, sans-serif"
                      lineHeight="1"
                    >
                      { formatNumber(totalTransactions) }
                    </Text>
                  </Skeleton>
                </LinkBox>

                { /* Active Workflows */ }
                <LinkBox
                  p={ 5 }
                  transition="opacity 0.2s ease"
                  _hover={{ opacity: 0.7 }}
                >
                  <LinkOverlay
                    href={ route({ pathname: '/workflows' }) }
                    noIcon
                  />
                  <Flex
                    alignItems="center"
                    gap={ 1.5 }
                    mb={ 2 }
                  >
                    <Text
                      fontSize="10px"
                      fontWeight={ 500 }
                      letterSpacing="0.08em"
                      textTransform="uppercase"
                      color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
                      fontFamily="system-ui, -apple-system, sans-serif"
                    >
                      Active Workflows
                    </Text>
                    <IconSvg
                      name="link"
                      boxSize={ 3 }
                      color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
                    />
                  </Flex>
                  <Skeleton loading={ workflowsQuery.isPlaceholderData } w="fit-content">
                    <Text
                      fontSize="32px"
                      fontWeight={ 200 }
                      letterSpacing="-0.02em"
                      color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                      fontFamily="system-ui, -apple-system, sans-serif"
                      lineHeight="1"
                    >
                      { activeWorkflowsCount.toLocaleString() }
                    </Text>
                  </Skeleton>
                </LinkBox>
              </Grid>
            </VStack>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default React.memo(HeroBanner);
