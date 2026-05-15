import { Box, Flex, VStack, Text, Grid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import { getTEERegistryOverview, TEE_REGISTRY_QUERY_KEY } from 'lib/opengradient/contracts/teeRegistry';
import { HOMEPAGE_STATS, HOMEPAGE_STATS_MICROSERVICE } from 'stubs/stats';
import { LinkBox, LinkOverlay } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { PLACEHOLDER_TEE_REGISTRY_STATS, PLACEHOLDER_TEE_TYPES } from 'ui/opengradient/teeRegistry/placeholders';
import IconSvg, { type IconName } from 'ui/shared/IconSvg';
import SearchBar from 'ui/snippets/searchBar/SearchBar';

import { HOME_BRAND } from './brand';
import isStatsMicroserviceEnabled from './utils/isStatsMicroserviceEnabled';

export const BACKGROUND_DEFAULT = { _light: '#e9f8fc', _dark: '#0a0f19' };

const { colors, fonts, panel, text } = HOME_BRAND;

type MetricCardProps = {
  href: string;
  external?: boolean;
  label: string;
  iconName: IconName;
  value: React.ReactNode;
  loading?: boolean;
};

const MetricCard = ({ href, external, label, iconName, value, loading }: MetricCardProps) => {
  const valueText = (
    <Text
      fontSize={{ base: '22px', lg: '28px' }}
      fontWeight={ 500 }
      letterSpacing="0"
      color={ text.primary }
      fontFamily={ fonts.mono }
      lineHeight="1"
    >
      { value }
    </Text>
  );

  return (
    <LinkBox
      p={{ base: 3, lg: 4 }}
      position="relative"
      borderRadius="8px"
      border="1px solid"
      borderColor={ panel.border }
      bg={ panel.bg }
      backdropFilter="blur(12px)"
      transition="background-color 0.18s ease, border-color 0.18s ease"
      _hover={{
        bg: { _light: 'rgba(255, 255, 255, 0.94)', _dark: 'rgba(15, 22, 38, 0.84)' },
        borderColor: { _light: 'rgba(36, 188, 227, 0.38)', _dark: 'rgba(80, 201, 233, 0.32)' },
      }}
    >
      <LinkOverlay href={ href } external={ external } noIcon/>
      <Flex alignItems="center" gap={ 1.5 } mb={ 2 }>
        <Text
          fontSize="9px"
          fontWeight={ 500 }
          letterSpacing="0.08em"
          textTransform="uppercase"
          color={ text.accent }
          fontFamily={ fonts.mono }
          whiteSpace="nowrap"
        >
          { label }
        </Text>
        <IconSvg
          name={ iconName }
          boxSize={ 3 }
          color={ text.accent }
        />
      </Flex>
      { loading ? <Skeleton loading w="fit-content">{ valueText }</Skeleton> : valueText }
    </LinkBox>
  );
};

const HeroBanner = () => {
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

  const teeRegistryQuery = useQuery({
    queryKey: TEE_REGISTRY_QUERY_KEY,
    queryFn: getTEERegistryOverview,
    placeholderData: {
      types: PLACEHOLDER_TEE_TYPES,
      stats: PLACEHOLDER_TEE_REGISTRY_STATS,
      nodesByType: {},
    },
  });

  const settlementContractAddress = '0xAa3bB22c5Ef24fe3837134A25A4D801308E2516d';
  const settlementContractAddressV2 = '0xf1dc0d5Dcf2A01924faC78185B9227CF3EC839A5';
  const settlementQuery = useApiQuery('address_counters', {
    pathParams: { hash: settlementContractAddress },
    queryOptions: {
      refetchOnMount: false,
    },
  });
  const settlementQueryV2 = useApiQuery('address_counters', {
    pathParams: { hash: settlementContractAddressV2 },
    queryOptions: {
      refetchOnMount: false,
    },
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

  const llmBatchSettlementsCount = React.useMemo(() => {
    const countersData = settlementQuery.data;
    const countersDataV2 = settlementQueryV2.data;
    const v1Count = countersData?.transactions_count ? Number(countersData.transactions_count) : 0;
    const v2Count = countersDataV2?.transactions_count ? Number(countersDataV2.transactions_count) : 0;
    if (v1Count === 0 && v2Count === 0) {
      return null;
    }
    return v1Count + v2Count;
  }, [ settlementQuery.data, settlementQueryV2.data ]);
  const isSettlementCountLoading = llmBatchSettlementsCount === null && (settlementQuery.isPending || settlementQueryV2.isPending);
  const teeStats = teeRegistryQuery.data?.stats ?? PLACEHOLDER_TEE_REGISTRY_STATS;

  const formatNumber = (num: number | null, decimals: number = 2): string => {
    if (num === null) return '-';
    if (num >= 1_000_000) return `${ (num / 1_000_000).toFixed(decimals) }M`;
    if (num >= 1_000) return `${ (num / 1_000).toFixed(decimals) }K`;
    return num.toLocaleString();
  };

  return (
    <Box
      position="relative"
      w="100%"
      overflow="hidden"
      background={{ _light: '#e9f8fc', _dark: '#0a0f19' }}
      borderBottom="1px solid"
      borderColor={ panel.border }
      borderRadius="0"
      minH={{ base: 'auto', lg: 'auto' }}
    >
      <Box
        position="absolute"
        inset={ 0 }
        pointerEvents="none"
        zIndex={ 0 }
        backgroundImage={{
          _light: [
            'linear-gradient(90deg, rgba(14, 75, 91, 0.06) 1px, transparent 1px)',
            'linear-gradient(0deg, rgba(14, 75, 91, 0.06) 1px, transparent 1px)',
          ].join(', '),
          _dark: [
            'linear-gradient(90deg, rgba(189, 235, 247, 0.04) 1px, transparent 1px)',
            'linear-gradient(0deg, rgba(189, 235, 247, 0.04) 1px, transparent 1px)',
          ].join(', '),
        }}
        backgroundSize="72px 72px"
        opacity={{ _light: 0.44, _dark: 0.52 }}
      />

      <Box
        position="relative"
        zIndex={ 1 }
        maxW={{ base: '100%', xl: '1600px' }}
        mx="auto"
        px={{ base: 4, lg: 8, xl: 12 }}
        pt={{ base: 5, lg: 6, xl: 7 }}
        pb={{ base: 5, lg: 6 }}
      >
        <Grid
          position="relative"
          zIndex={ 1 }
          templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) minmax(420px, 520px)' }}
          gap={{ base: 6, lg: 8, xl: 10 }}
          alignItems="end"
        >
          <VStack
            align="stretch"
            gap={{ base: 4, lg: 5 }}
          >
            <Box>
              <Text
                fontSize="11px"
                fontWeight={ 500 }
                letterSpacing="0.12em"
                textTransform="uppercase"
                color={ text.accent }
                fontFamily={ fonts.mono }
                mb={ 3 }
              >
                / AI Execution Network Explorer
              </Text>

              <Text
                as="h1"
                fontSize={{ base: '30px', md: '38px', lg: '44px', xl: '48px' }}
                fontWeight={ 500 }
                letterSpacing="0"
                lineHeight="1.06"
                fontFamily={ fonts.sans }
              >
                <Box
                  as="span"
                  color={ text.primary }
                >
                  OpenGradient AI
                </Box>
                <Box
                  as="span"
                  color={ text.accent }
                >
                  { ' ' }Explorer
                </Box>
              </Text>
              <Text
                fontSize={{ base: '14px', md: '16px' }}
                fontWeight={ 400 }
                letterSpacing="0"
                lineHeight="1.6"
                color={ text.secondary }
                fontFamily={ fonts.sans }
                mt={ 3 }
                maxW="620px"
              >
                Trace model inference, x402 settlements, TEE attestations, and AI workflow activity across the OpenGradient network.
              </Text>
            </Box>

            <Box
              w="100%"
              maxW={{ base: '100%', lg: '680px' }}
              position="relative"
            >
              <SearchBar isHomepage/>
            </Box>
          </VStack>

          <Box
            display={{ base: 'none', lg: 'block' }}
            position="relative"
          >
            <VStack
              align="stretch"
              gap={ 0 }
              border="1px solid"
              borderColor={ panel.border }
              borderRadius="8px"
              bg={ panel.bg }
              backdropFilter="blur(18px)"
              p={ 3 }
            >
              <Flex
                alignItems="center"
                gap={ 2 }
                mb={ 3 }
              >
                <Box
                  position="relative"
                  w="6px"
                  h="6px"
                  borderRadius="50%"
                  bg={ colors.cyan }
                  boxShadow="0 0 10px rgba(36, 188, 227, 0.8), 0 0 20px rgba(36, 188, 227, 0.4)"
                  animation="pulseOpacity 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                />
                <Text
                  fontSize="11px"
                  fontWeight={ 500 }
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                  color={ text.accent }
                  fontFamily={ fonts.mono }
                >
                  Live network stats
                </Text>
              </Flex>

              <Grid
                templateColumns="1fr 1fr"
                gap={ 2.5 }
                overflow="visible"
              >
                <MetricCard
                  href="https://hub.opengradient.ai"
                  external
                  label="Models Hosted"
                  iconName="link_external"
                  value="4,500+"
                />
                <MetricCard
                  href={ route({ pathname: '/tee-registry' }) }
                  label="TEE Operators"
                  iconName="nft_shield"
                  loading={ teeRegistryQuery.isPlaceholderData }
                  value={ `${ teeStats.activeNodes }/${ teeStats.enabledNodes }` }
                />
                <MetricCard
                  href={ route({ pathname: '/address/[hash]', query: { hash: settlementContractAddress } }) }
                  label="AI Settlements"
                  iconName="transactions_slim"
                  loading={ isSettlementCountLoading }
                  value={ formatNumber(llmBatchSettlementsCount) }
                />
                <MetricCard
                  href={ route({ pathname: '/txs' }) }
                  label="Network Txns"
                  iconName="transactions_slim"
                  loading={ totalTransactions === null && (statsQuery.isPending || apiQuery.isPending) }
                  value={ formatNumber(totalTransactions) }
                />
              </Grid>
            </VStack>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default React.memo(HeroBanner);
