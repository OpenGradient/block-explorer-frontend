import { Box, Flex, Grid, HStack, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { route } from 'nextjs-routes';

import { getTEERegistryOverview, TEE_REGISTRY_QUERY_KEY, TEE_REGISTRY_ADDRESS } from 'lib/opengradient/contracts/teeRegistry';
import type { TEERegistryStats, TEETypeSummary, TEENodeWithStatus } from 'lib/opengradient/contracts/teeRegistry';
import { Checkbox } from 'toolkit/chakra/checkbox';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { OPENGRADIENT_BRAND } from 'ui/opengradient/brand';
import TEENodeDetailDrawer from 'ui/opengradient/teeRegistry/TEENodeDetailDrawer';
import TEENodesTable from 'ui/opengradient/teeRegistry/TEENodesTable';
import TEETypeCard from 'ui/opengradient/teeRegistry/TEETypeCard';
import IconSvg, { type IconName } from 'ui/shared/IconSvg';

const PLACEHOLDER_STATS: TEERegistryStats = {
  totalTypes: 3,
  totalNodes: 12,
  activeNodes: 8,
  enabledNodes: 10,
  approvedPCRs: 5,
};

const PLACEHOLDER_TYPES: Array<TEETypeSummary> = [
  { typeId: 0, name: 'LLM Inference', totalNodes: 5, enabledNodes: 4, activeNodes: 3, approvedPCRs: 2, addedAt: BigInt(0) },
  { typeId: 1, name: 'Agent Execution', totalNodes: 4, enabledNodes: 3, activeNodes: 3, approvedPCRs: 2, addedAt: BigInt(0) },
  { typeId: 2, name: 'Model Training', totalNodes: 3, enabledNodes: 3, activeNodes: 2, approvedPCRs: 1, addedAt: BigInt(0) },
];

const { colors, fonts, panel, text } = OPENGRADIENT_BRAND;

type MetricCardProps = {
  label: string;
  value: number;
  iconName: IconName;
  helper: string;
  loading?: boolean;
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

const MetricCard = ({ label, value, iconName, helper, loading }: MetricCardProps) => (
  <Box
    border="1px solid"
    borderColor={ panel.border }
    borderRadius="8px"
    bg={ panel.bg }
    px={ 4 }
    py={ 3.5 }
    minH="112px"
  >
    <Flex alignItems="center" justifyContent="space-between" gap={ 3 } mb={ 3 }>
      <Text
        fontFamily={ fonts.mono }
        fontSize="10px"
        fontWeight={ 500 }
        letterSpacing="0.08em"
        textTransform="uppercase"
        color={ text.secondary }
      >
        { label }
      </Text>
      <IconSvg name={ iconName } boxSize={ 3.5 } color={ text.accent }/>
    </Flex>
    <Skeleton loading={ loading } w="fit-content">
      <Text
        fontFamily={ fonts.mono }
        fontSize={{ base: '24px', lg: '30px' }}
        fontWeight={ 500 }
        lineHeight="1"
        color={ text.primary }
      >
        { value.toLocaleString() }
      </Text>
    </Skeleton>
    <Text
      mt={ 2 }
      fontFamily={ fonts.sans }
      fontSize="12px"
      lineHeight="1.35"
      color={ text.muted }
    >
      { helper }
    </Text>
  </Box>
);

const TEERegistry = () => {
  const [ selectedNode, setSelectedNode ] = React.useState<TEENodeWithStatus | null>(null);
  const [ selectedType, setSelectedType ] = React.useState<number | null>(null);

  const query = useQuery({
    queryKey: TEE_REGISTRY_QUERY_KEY,
    queryFn: getTEERegistryOverview,
    placeholderData: {
      types: PLACEHOLDER_TYPES,
      stats: PLACEHOLDER_STATS,
      nodesByType: {},
    },
  });

  const stats = query.data?.stats ?? PLACEHOLDER_STATS;
  const types = query.data?.types ?? PLACEHOLDER_TYPES;

  const allNodes = React.useMemo(() => {
    const nodesByType = query.data?.nodesByType ?? {};
    if (selectedType !== null) {
      return nodesByType[selectedType] ?? [];
    }
    return Object.values(nodesByType).flat();
  }, [ query.data?.nodesByType, selectedType ]);

  const hasNonDisabledNodes = React.useMemo(
    () => allNodes.some((node) => node.isActive || node.enabled),
    [ allNodes ],
  );

  const [ showDisabled, setShowDisabled ] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    setShowDisabled(null);
  }, [ selectedType ]);

  const resolvedShowDisabled = showDisabled ?? !hasNonDisabledNodes;

  const filteredNodes = React.useMemo(
    () => resolvedShowDisabled ? allNodes : allNodes.filter((node) => node.isActive || node.enabled),
    [ allNodes, resolvedShowDisabled ],
  );

  const tableTitle = selectedType !== null ?
    `${ types.find((type) => type.typeId === selectedType)?.name ?? 'Selected' } nodes` :
    'All nodes';

  const tableSubtitle = resolvedShowDisabled ?
    'Showing active, enabled, and disabled registry records.' :
    'Showing active and enabled registry records.';

  const activeVisibleCount = React.useMemo(
    () => filteredNodes.filter((node) => node.isActive).length,
    [ filteredNodes ],
  );

  const handleToggleShowDisabled = React.useCallback(() => {
    setShowDisabled((prev) => {
      const current = prev ?? !hasNonDisabledNodes;
      return !current;
    });
  }, [ hasNonDisabledNodes ]);

  const handleTypeClick = React.useCallback((typeId: number) => {
    setSelectedType((prev) => prev === typeId ? null : typeId);
  }, []);

  const handleNodeClick = React.useCallback((node: TEENodeWithStatus) => {
    setSelectedNode(node);
  }, []);

  const handleCloseDrawer = React.useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleClearFilter = React.useCallback(() => {
    setSelectedType(null);
  }, []);

  return (
    <Box>
      <Flex
        alignItems={{ base: 'stretch', lg: 'flex-end' }}
        justifyContent="space-between"
        gap={ 5 }
        flexDirection={{ base: 'column', lg: 'row' }}
        mb={ 6 }
      >
        <Box maxW="780px">
          <Text
            fontFamily={ fonts.mono }
            fontSize="11px"
            fontWeight={ 500 }
            letterSpacing="0.12em"
            textTransform="uppercase"
            color={ text.accent }
            mb={ 2 }
          >
            / Trusted execution registry
          </Text>
          <Text
            as="h1"
            fontFamily={ fonts.sans }
            fontSize={{ base: '28px', md: '36px', lg: '42px' }}
            fontWeight={ 500 }
            letterSpacing="0"
            lineHeight="1.08"
            color={ text.primary }
          >
            TEE Registry
          </Text>
          <Text
            mt={ 3 }
            fontFamily={ fonts.sans }
            fontSize={{ base: '14px', md: '15px' }}
            lineHeight="1.6"
            color={ text.secondary }
          >
            Monitor attested OpenGradient TEE operators, approved PCR identities, endpoints, and heartbeat liveness from the on-chain registry.
          </Text>
        </Box>

        <Link
          href={ route({ pathname: '/address/[hash]', query: { hash: TEE_REGISTRY_ADDRESS } }) }
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          gap={ 2 }
          px={ 3 }
          py={ 2 }
          border="1px solid"
          borderColor={ panel.border }
          borderRadius="8px"
          bg={ panel.bg }
          color={ text.secondary }
          fontFamily={ fonts.mono }
          fontSize="11px"
          fontWeight={ 500 }
          letterSpacing="0.08em"
          textTransform="uppercase"
          whiteSpace="nowrap"
          _hover={{
            textDecoration: 'none',
            color: text.accent,
            borderColor: { _light: 'rgba(36, 188, 227, 0.38)', _dark: 'rgba(80, 201, 233, 0.32)' },
          }}
        >
          Registry contract
          <IconSvg name="arrows/east" boxSize={ 4 }/>
        </Link>
      </Flex>

      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' }}
        gap={ 3 }
        mb={ 7 }
      >
        <MetricCard
          label="TEE Types"
          value={ stats.totalTypes }
          iconName="apps"
          helper="Registered execution classes"
          loading={ query.isPlaceholderData }
        />
        <MetricCard
          label="Approved PCRs"
          value={ stats.approvedPCRs }
          iconName="nft_shield"
          helper="Allowed enclave identities"
          loading={ query.isPlaceholderData }
        />
        <MetricCard
          label="Active Nodes"
          value={ stats.activeNodes }
          iconName="check"
          helper="Heartbeat within liveness window"
          loading={ query.isPlaceholderData }
        />
        <MetricCard
          label="Enabled Nodes"
          value={ stats.enabledNodes }
          iconName="certified"
          helper="Enabled registry operators"
          loading={ query.isPlaceholderData }
        />
      </Grid>

      <Box mb={ 7 }>
        <Flex alignItems="center" justifyContent="space-between" gap={ 3 } mb={ 3 }>
          <SectionLabel>TEE types</SectionLabel>
          { selectedType !== null && (
            <Text
              as="button"
              fontFamily={ fonts.mono }
              fontSize="10px"
              fontWeight={ 500 }
              letterSpacing="0.08em"
              textTransform="uppercase"
              color={ text.muted }
              cursor="pointer"
              onClick={ handleClearFilter }
              _hover={{ color: text.accent }}
            >
              Clear filter
            </Text>
          ) }
        </Flex>
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(auto-fit, minmax(240px, 320px))' }}
          gap={ 3 }
          alignItems="stretch"
        >
          { types.map((type) => (
            <TEETypeCard
              key={ type.typeId }
              type={ type }
              isSelected={ selectedType === type.typeId }
              isLoading={ query.isPlaceholderData }
              onClick={ handleTypeClick }
            />
          )) }
        </Grid>
      </Box>

      <Box
        border="1px solid"
        borderColor={ panel.border }
        borderRadius="8px"
        bg={ panel.bg }
        overflow="hidden"
      >
        <Flex
          alignItems={{ base: 'stretch', md: 'center' }}
          justifyContent="space-between"
          gap={ 4 }
          flexDirection={{ base: 'column', md: 'row' }}
          px={ 4 }
          py={ 3.5 }
          borderBottom="1px solid"
          borderColor={ panel.border }
        >
          <Box>
            <Flex alignItems="center" gap={ 3 } mb={ 1 }>
              <SectionLabel>{ tableTitle }</SectionLabel>
              <Text
                fontFamily={ fonts.mono }
                fontSize="11px"
                color={ text.muted }
              >
                { filteredNodes.length } shown / { allNodes.length } total
              </Text>
            </Flex>
            <Text fontFamily={ fonts.sans } fontSize="12px" color={ text.muted }>
              { tableSubtitle } { activeVisibleCount > 0 ? `${ activeVisibleCount } currently active.` : '' }
            </Text>
          </Box>

          <Checkbox
            size="sm"
            checked={ resolvedShowDisabled }
            onCheckedChange={ handleToggleShowDisabled }
          >
            <Text
              fontFamily={ fonts.mono }
              fontSize="11px"
              fontWeight={ 500 }
              letterSpacing="0.04em"
              color={ text.secondary }
            >
              Show disabled
            </Text>
          </Checkbox>
        </Flex>

        <TEENodesTable
          nodes={ filteredNodes }
          types={ types }
          isLoading={ query.isPlaceholderData }
          onNodeClick={ handleNodeClick }
        />

        { !query.isPlaceholderData && filteredNodes.length === 0 && (
          <Flex
            justifyContent="center"
            alignItems="center"
            py={ 12 }
            color={ text.muted }
            borderTop="1px solid"
            borderColor={ panel.border }
          >
            <Text fontSize="sm" fontFamily={ fonts.sans }>
              No TEE nodes match the current filter.
            </Text>
          </Flex>
        ) }
      </Box>

      { selectedNode && (
        <TEENodeDetailDrawer
          node={ selectedNode }
          typeName={ types.find((type) => type.typeId === selectedNode.teeType)?.name ?? `Type ${ selectedNode.teeType }` }
          onClose={ handleCloseDrawer }
        />
      ) }
    </Box>
  );
};

export default TEERegistry;
