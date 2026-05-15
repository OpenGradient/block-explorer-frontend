import { Box, Flex, Grid, HStack, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { route } from 'nextjs-routes';

import dayjs from 'lib/date/dayjs';
import { getTEERegistryOverview, TEE_REGISTRY_QUERY_KEY, TEE_REGISTRY_ADDRESS, type TEENodeWithStatus } from 'lib/opengradient/contracts/teeRegistry';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { PLACEHOLDER_TEE_REGISTRY_STATS, PLACEHOLDER_TEE_TYPES } from 'ui/opengradient/teeRegistry/placeholders';
import IconSvg from 'ui/shared/IconSvg';

import { HOME_BRAND } from './brand';

const { colors, fonts, panel, text } = HOME_BRAND;

const formatHash = (hash: string, head = 6, tail = 4) => {
  if (!hash) return 'N/A';
  if (hash.length <= head + tail + 3) return hash;
  return `${ hash.slice(0, head) }...${ hash.slice(-tail) }`;
};

const formatTimeAgo = (timestamp: bigint) => {
  if (timestamp === BigInt(0)) return 'Never';
  return dayjs.unix(Number(timestamp)).fromNow();
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <HStack gap={ 2 }>
    <Box
      w="6px"
      h="6px"
      borderRadius="50%"
      bg={ colors.cyan }
      boxShadow="0 0 10px rgba(36, 188, 227, 0.65)"
      flexShrink={ 0 }
    />
    <Text
      fontFamily={ fonts.mono }
      fontSize="11px"
      fontWeight={ 500 }
      letterSpacing="0.12em"
      textTransform="uppercase"
      color={ text.accent }
    >
      { children }
    </Text>
  </HStack>
);

const RegistryMetric = ({ label, value, helper, loading }: { label: string; value: React.ReactNode; helper: string; loading?: boolean }) => (
  <Box
    border="1px solid"
    borderColor={ panel.border }
    borderRadius="8px"
    bg={{ _light: 'rgba(255, 255, 255, 0.62)', _dark: 'rgba(15, 22, 38, 0.62)' }}
    px={ 4 }
    py={ 3.5 }
  >
    <Text
      fontFamily={ fonts.mono }
      fontSize="10px"
      fontWeight={ 500 }
      letterSpacing="0.08em"
      textTransform="uppercase"
      color={ text.secondary }
      mb={ 2 }
    >
      { label }
    </Text>
    <Skeleton loading={ loading } w="fit-content">
      <Text
        fontFamily={ fonts.mono }
        fontSize={{ base: '24px', lg: '30px' }}
        fontWeight={ 500 }
        lineHeight="1"
        color={ text.primary }
      >
        { value }
      </Text>
    </Skeleton>
    <Text mt={ 2 } fontSize="12px" lineHeight="1.4" color={ text.muted }>
      { helper }
    </Text>
  </Box>
);

const NodePreview = ({ node, loading }: { node: TEENodeWithStatus; loading?: boolean }) => (
  <Flex
    alignItems="center"
    justifyContent="space-between"
    gap={ 4 }
    py={ 3 }
    borderBottom="1px solid"
    borderColor={ panel.border }
    _last={{ borderBottom: 'none' }}
  >
    <Skeleton loading={ loading } flex={ 1 } minW={ 0 }>
      <Box minW={ 0 }>
        <Flex alignItems="center" gap={ 2 } mb={ 1 }>
          <Box
            w="6px"
            h="6px"
            borderRadius="50%"
            bg={ node.isActive ? '#61d199' : '#d6a33d' }
            boxShadow={ node.isActive ? '0 0 8px rgba(97, 209, 153, 0.62)' : 'none' }
          />
          <Text fontFamily={ fonts.mono } fontSize="12px" color={ text.primary } truncate>
            { formatHash(node.teeId, 8, 4) }
          </Text>
        </Flex>
        <Text fontSize="12px" color={ text.muted } truncate>
          { node.endpoint || 'No endpoint published' }
        </Text>
      </Box>
    </Skeleton>
    <Skeleton loading={ loading } w="fit-content">
      <Text fontFamily={ fonts.mono } fontSize="11px" color={ node.isActive ? text.accent : text.muted } whiteSpace="nowrap">
        { formatTimeAgo(node.lastHeartbeatAt) }
      </Text>
    </Skeleton>
  </Flex>
);

const TrustedExecution = () => {
  const query = useQuery({
    queryKey: TEE_REGISTRY_QUERY_KEY,
    queryFn: getTEERegistryOverview,
    placeholderData: {
      types: PLACEHOLDER_TEE_TYPES,
      stats: PLACEHOLDER_TEE_REGISTRY_STATS,
      nodesByType: {},
    },
  });

  const stats = query.data?.stats ?? PLACEHOLDER_TEE_REGISTRY_STATS;
  const types = query.data?.types ?? PLACEHOLDER_TEE_TYPES;
  const nodes = React.useMemo(() => {
    const nodesByType = query.data?.nodesByType ?? {};
    return Object.values(nodesByType).flat().sort((a, b) => Number(b.lastHeartbeatAt - a.lastHeartbeatAt));
  }, [ query.data?.nodesByType ]);
  const primaryType = types[0] ?? PLACEHOLDER_TEE_TYPES[0];
  const visibleNodes = nodes.slice(0, 3);
  const isLoading = query.isPlaceholderData;

  return (
    <Box
      mt={{ base: 5, lg: 6 }}
      border="1px solid"
      borderColor={ panel.border }
      borderRadius="8px"
      bg={ panel.bg }
      boxShadow={ panel.shadow }
      overflow="hidden"
    >
      <Grid
        templateColumns={{ base: '1fr', xl: '0.92fr 1.08fr' }}
        gap={ 0 }
      >
        <Box
          p={{ base: 4, md: 5, lg: 6 }}
          borderRight={{ base: 'none', xl: '1px solid' }}
          borderBottom={{ base: '1px solid', xl: 'none' }}
          borderColor={ panel.border }
          bg={{
            _light: 'linear-gradient(135deg, rgba(36, 188, 227, 0.08), rgba(255, 255, 255, 0.34))',
            _dark: 'linear-gradient(135deg, rgba(36, 188, 227, 0.10), rgba(10, 15, 25, 0.20))',
          }}
        >
          <SectionLabel>Trusted AI execution</SectionLabel>
          <Text
            as="h2"
            mt={ 4 }
            fontFamily={ fonts.sans }
            fontSize={{ base: '26px', md: '32px', lg: '36px' }}
            fontWeight={ 500 }
            lineHeight="1.08"
            color={ text.primary }
          >
            Attested TEE operators for model inference
          </Text>
          <Text
            mt={ 3 }
            fontSize={{ base: '14px', md: '15px' }}
            lineHeight="1.65"
            color={ text.secondary }
            maxW="640px"
          >
            OpenGradient routes AI workloads through registered enclaves with approved PCR identities, live heartbeats, and on-chain operator records.
          </Text>

          <Flex mt={ 5 } gap={ 3 } flexWrap="wrap">
            <Link
              href={ route({ pathname: '/tee-registry' }) }
              display="inline-flex"
              alignItems="center"
              gap={ 2 }
              px={ 3.5 }
              py={ 2.5 }
              borderRadius="8px"
              bg={{ _light: 'rgba(36, 188, 227, 0.12)', _dark: 'rgba(36, 188, 227, 0.14)' }}
              color={ text.accent }
              fontFamily={ fonts.mono }
              fontSize="11px"
              fontWeight={ 500 }
              letterSpacing="0.08em"
              textTransform="uppercase"
              _hover={{ textDecoration: 'none', bg: { _light: 'rgba(36, 188, 227, 0.18)', _dark: 'rgba(36, 188, 227, 0.20)' } }}
            >
              Open registry
              <IconSvg name="arrows/east" boxSize={ 4 }/>
            </Link>
            <Link
              href={ route({ pathname: '/address/[hash]', query: { hash: TEE_REGISTRY_ADDRESS } }) }
              display="inline-flex"
              alignItems="center"
              gap={ 2 }
              px={ 3.5 }
              py={ 2.5 }
              border="1px solid"
              borderColor={ panel.border }
              borderRadius="8px"
              color={ text.secondary }
              fontFamily={ fonts.mono }
              fontSize="11px"
              fontWeight={ 500 }
              letterSpacing="0.08em"
              textTransform="uppercase"
              _hover={{ textDecoration: 'none', color: text.accent }}
            >
              Contract
              <IconSvg name="arrows/east" boxSize={ 4 }/>
            </Link>
          </Flex>
        </Box>

        <Box p={{ base: 4, md: 5, lg: 6 }}>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, minmax(0, 1fr))' }} gap={ 3 } mb={ 4 }>
            <RegistryMetric
              label="Active TEEs"
              value={ `${ stats.activeNodes }/${ stats.enabledNodes }` }
              helper="Heartbeat-valid operators"
              loading={ isLoading }
            />
            <RegistryMetric
              label="Execution type"
              value={ primaryType.name }
              helper="Registered AI workload class"
              loading={ isLoading }
            />
            <RegistryMetric
              label="Approved PCRs"
              value={ stats.approvedPCRs.toLocaleString() }
              helper="Allowed enclave identities"
              loading={ isLoading }
            />
          </Grid>

          <Grid templateColumns={{ base: '1fr', lg: 'minmax(0, 0.86fr) minmax(0, 1.14fr)' }} gap={ 4 }>
            <Box
              border="1px solid"
              borderColor={ panel.border }
              borderRadius="8px"
              bg={{ _light: 'rgba(255, 255, 255, 0.52)', _dark: 'rgba(15, 22, 38, 0.52)' }}
              p={ 4 }
            >
              <Text fontFamily={ fonts.mono } fontSize="10px" fontWeight={ 500 } letterSpacing="0.08em" textTransform="uppercase" color={ text.secondary }>
                Primary registry type
              </Text>
              <Skeleton loading={ isLoading } w="fit-content">
                <Text mt={ 3 } fontFamily={ fonts.sans } fontSize="18px" fontWeight={ 600 } color={ text.primary }>
                  { primaryType.name }
                </Text>
              </Skeleton>
              <Grid templateColumns="repeat(3, minmax(0, 1fr))" gap={ 3 } mt={ 4 }>
                <Box>
                  <Text fontFamily={ fonts.mono } fontSize="9px" color={ text.muted } textTransform="uppercase" letterSpacing="0.08em">Active</Text>
                  <Text mt={ 1 } fontFamily={ fonts.mono } fontSize="14px" color={ text.primary }>{ primaryType.activeNodes }/{ primaryType.totalNodes }</Text>
                </Box>
                <Box>
                  <Text fontFamily={ fonts.mono } fontSize="9px" color={ text.muted } textTransform="uppercase" letterSpacing="0.08em">Enabled</Text>
                  <Text mt={ 1 } fontFamily={ fonts.mono } fontSize="14px" color={ text.primary }>{ primaryType.enabledNodes }</Text>
                </Box>
                <Box>
                  <Text fontFamily={ fonts.mono } fontSize="9px" color={ text.muted } textTransform="uppercase" letterSpacing="0.08em">PCRs</Text>
                  <Text mt={ 1 } fontFamily={ fonts.mono } fontSize="14px" color={ text.primary }>{ primaryType.approvedPCRs }</Text>
                </Box>
              </Grid>
              <Box mt={ 4 } h="3px" borderRadius="2px" bg={{ _light: 'rgba(36, 188, 227, 0.12)', _dark: 'rgba(36, 188, 227, 0.12)' }} overflow="hidden">
                <Box
                  h="100%"
                  w={ primaryType.totalNodes > 0 ? `${ Math.round((primaryType.activeNodes / primaryType.totalNodes) * 100) }%` : '0' }
                  minW={ primaryType.activeNodes > 0 ? '18px' : '0' }
                  bg={ colors.cyan }
                  borderRadius="2px"
                />
              </Box>
            </Box>

            <Box
              border="1px solid"
              borderColor={ panel.border }
              borderRadius="8px"
              bg={{ _light: 'rgba(255, 255, 255, 0.52)', _dark: 'rgba(15, 22, 38, 0.52)' }}
              px={ 4 }
              py={ 3 }
              minW={ 0 }
            >
              <Flex alignItems="center" justifyContent="space-between" gap={ 3 } mb={ 1 }>
                <Text fontFamily={ fonts.mono } fontSize="10px" fontWeight={ 500 } letterSpacing="0.08em" textTransform="uppercase" color={ text.secondary }>
                  Live operators
                </Text>
                <Text fontFamily={ fonts.mono } fontSize="10px" color={ text.muted }>
                  { stats.activeNodes } active
                </Text>
              </Flex>
              <VStack align="stretch" gap={ 0 }>
                { visibleNodes.length > 0 ? visibleNodes.map((node) => (
                  <NodePreview key={ node.teeId } node={ node } loading={ isLoading }/>
                )) : (
                  <Text py={ 5 } fontSize="13px" color={ text.muted }>
                    Registry nodes will appear here as they are indexed.
                  </Text>
                ) }
              </VStack>
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
};

export default React.memo(TrustedExecution);
