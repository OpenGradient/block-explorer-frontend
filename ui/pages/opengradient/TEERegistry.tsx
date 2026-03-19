import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { route } from 'nextjs-routes';

import { getTEERegistryOverview, TEE_REGISTRY_QUERY_KEY, TEE_REGISTRY_ADDRESS } from 'lib/opengradient/contracts/teeRegistry';
import type { TEERegistryStats, TEETypeSummary, TEENodeWithStatus } from 'lib/opengradient/contracts/teeRegistry';
import { Checkbox } from 'toolkit/chakra/checkbox';
import { Heading } from 'toolkit/chakra/heading';
import { Link, LinkBox } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import TEENodeDetailDrawer from 'ui/opengradient/teeRegistry/TEENodeDetailDrawer';
import TEENodesTable from 'ui/opengradient/teeRegistry/TEENodesTable';
import TEETypeCard from 'ui/opengradient/teeRegistry/TEETypeCard';
import IconSvg from 'ui/shared/IconSvg';

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

  // All nodes flat list for the table
  const allNodes = React.useMemo(() => {
    const nbt = query.data?.nodesByType ?? {};
    if (selectedType !== null) {
      return nbt[selectedType] ?? [];
    }
    return Object.values(nbt).flat();
  }, [ query.data?.nodesByType, selectedType ]);

  const hasNonDisabledNodes = React.useMemo(
    () => allNodes.some((n) => n.isActive || n.enabled),
    [ allNodes ],
  );

  const [ showDisabled, setShowDisabled ] = React.useState<boolean | null>(null);

  // Reset when allNodes changes (e.g. type filter changed)
  React.useEffect(() => {
    setShowDisabled(null);
  }, [ selectedType ]);

  const resolvedShowDisabled = showDisabled ?? !hasNonDisabledNodes;

  const filteredNodes = React.useMemo(
    () => resolvedShowDisabled ? allNodes : allNodes.filter((n) => n.isActive || n.enabled),
    [ allNodes, resolvedShowDisabled ],
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
    <>
      <Heading
        as="h1"
        fontSize={{ base: '22px', md: '26px', lg: '28px' }}
        fontWeight={ 300 }
        letterSpacing="-0.03em"
        lineHeight="1.15"
        color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
        fontFamily="system-ui, -apple-system, sans-serif"
        mb={ 4 }
        mt={{ base: 1, lg: 2 }}
      >
        TEE Registry
      </Heading>

      { /* Description */ }
      <Box
        mb={ 6 }
        p={{ base: 4, lg: 5 }}
        bg={{ _light: 'rgba(0, 0, 0, 0.01)', _dark: 'rgba(255, 255, 255, 0.01)' }}
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor={{ _light: 'rgba(0, 0, 0, 0.04)', _dark: 'rgba(255, 255, 255, 0.04)' }}
      >
        <Flex
          gap={ 3 }
          alignItems="flex-start"
          flexDirection={{ base: 'column', lg: 'row' }}
        >
          <Box
            p={ 2 }
            bg={{ _light: 'rgba(0, 0, 0, 0.02)', _dark: 'rgba(255, 255, 255, 0.02)' }}
            flexShrink={ 0 }
          >
            <IconSvg
              name="nft_shield"
              boxSize={ 5 }
              color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
            />
          </Box>
          <Box flex={ 1 }>
            <Text
              fontSize={{ base: '12px', md: '13px' }}
              lineHeight="1.6"
              color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              Hardware-rooted chain of trust from AWS Nitro enclaves to on-chain verification.
              Each TEE node is cryptographically attested, with its signing key and TLS certificate
              bound to verified enclave code. Heartbeat liveness proofs ensure nodes are actively running
              approved software. Click on a node to inspect its attestation details.
            </Text>
            <Link
              href={ route({ pathname: '/address/[hash]', query: { hash: TEE_REGISTRY_ADDRESS } }) }
              fontSize={{ base: '11px', md: '12px' }}
              fontWeight={ 500 }
              fontFamily="system-ui, -apple-system, sans-serif"
              color="blue.500"
              mt={ 2 }
              display="inline-flex"
              alignItems="center"
              gap={ 1 }
            >
              View Registry Contract
              <IconSvg name="arrows/east-mini" boxSize={ 3.5 }/>
            </Link>
          </Box>
        </Flex>
      </Box>

      { /* Hero Stats Section */ }
      <Box
        position="relative"
        mb={ 8 }
        w="100%"
        overflow="hidden"
      >
        <VStack
          align="stretch"
          gap={ 0 }
        >
          { /* Metrics Grid */ }
          <Grid
            templateColumns={{ base: '1fr 1fr', lg: 'repeat(5, 1fr)' }}
            gap={ 0 }
            overflow="hidden"
          >
            { /* TEE Types */ }
            <LinkBox
              p={ 5 }
              position="relative"
              bgGradient={{
                _light: 'linear-gradient(135deg, rgba(30, 58, 138, 0.04) 0%, rgba(51, 65, 85, 0.05) 100%)',
                _dark: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(51, 65, 85, 0.1) 100%)',
              }}
              transition="all 0.2s ease"
              _hover={{
                bgGradient: {
                  _light: 'linear-gradient(135deg, rgba(30, 58, 138, 0.06) 0%, rgba(51, 65, 85, 0.08) 100%)',
                  _dark: 'linear-gradient(135deg, rgba(30, 58, 138, 0.12) 0%, rgba(51, 65, 85, 0.15) 100%)',
                },
              }}
            >
              <Flex alignItems="center" gap={ 1.5 } mb={ 2 }>
                <Text
                  fontSize="10px"
                  fontWeight={ 600 }
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={{ _light: 'rgba(30, 58, 138, 0.7)', _dark: 'rgba(255, 255, 255, 0.5)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  TEE Types
                </Text>
                <IconSvg
                  name="apps"
                  boxSize={ 3 }
                  color={{ _light: 'rgba(30, 58, 138, 0.75)', _dark: 'rgba(255, 255, 255, 0.5)' }}
                />
              </Flex>
              <Skeleton loading={ query.isPlaceholderData } w="fit-content">
                <Text
                  fontSize="26px"
                  fontWeight={ 200 }
                  letterSpacing="-0.02em"
                  color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  lineHeight="1"
                >
                  { stats.totalTypes.toLocaleString() }
                </Text>
              </Skeleton>
            </LinkBox>

            { /* Total Nodes */ }
            <LinkBox
              p={ 5 }
              position="relative"
              bgGradient={{
                _light: 'linear-gradient(135deg, rgba(30, 58, 138, 0.04) 0%, rgba(51, 65, 85, 0.05) 100%)',
                _dark: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(51, 65, 85, 0.1) 100%)',
              }}
              transition="all 0.2s ease"
              _hover={{
                bgGradient: {
                  _light: 'linear-gradient(135deg, rgba(30, 58, 138, 0.06) 0%, rgba(51, 65, 85, 0.08) 100%)',
                  _dark: 'linear-gradient(135deg, rgba(30, 58, 138, 0.12) 0%, rgba(51, 65, 85, 0.15) 100%)',
                },
              }}
            >
              <Flex alignItems="center" gap={ 1.5 } mb={ 2 }>
                <Text
                  fontSize="10px"
                  fontWeight={ 600 }
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={{ _light: 'rgba(30, 58, 138, 0.7)', _dark: 'rgba(255, 255, 255, 0.5)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  Total Nodes
                </Text>
                <IconSvg
                  name="validator"
                  boxSize={ 3 }
                  color={{ _light: 'rgba(30, 58, 138, 0.75)', _dark: 'rgba(255, 255, 255, 0.5)' }}
                />
              </Flex>
              <Skeleton loading={ query.isPlaceholderData } w="fit-content">
                <Text
                  fontSize="26px"
                  fontWeight={ 200 }
                  letterSpacing="-0.02em"
                  color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  lineHeight="1"
                >
                  { stats.totalNodes.toLocaleString() }
                </Text>
              </Skeleton>
            </LinkBox>

            { /* Enabled Nodes */ }
            <LinkBox
              p={ 5 }
              position="relative"
              bgGradient={{
                _light: 'linear-gradient(135deg, rgba(30, 58, 138, 0.04) 0%, rgba(51, 65, 85, 0.05) 100%)',
                _dark: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(51, 65, 85, 0.1) 100%)',
              }}
              transition="all 0.2s ease"
              _hover={{
                bgGradient: {
                  _light: 'linear-gradient(135deg, rgba(30, 58, 138, 0.06) 0%, rgba(51, 65, 85, 0.08) 100%)',
                  _dark: 'linear-gradient(135deg, rgba(30, 58, 138, 0.12) 0%, rgba(51, 65, 85, 0.15) 100%)',
                },
              }}
            >
              <Flex alignItems="center" gap={ 1.5 } mb={ 2 }>
                <Text
                  fontSize="10px"
                  fontWeight={ 600 }
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={{ _light: 'rgba(30, 58, 138, 0.7)', _dark: 'rgba(255, 255, 255, 0.5)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  Enabled Nodes
                </Text>
                <IconSvg
                  name="certified"
                  boxSize={ 3 }
                  color={{ _light: 'rgba(30, 58, 138, 0.75)', _dark: 'rgba(255, 255, 255, 0.5)' }}
                />
              </Flex>
              <Skeleton loading={ query.isPlaceholderData } w="fit-content">
                <Text
                  fontSize="26px"
                  fontWeight={ 200 }
                  letterSpacing="-0.02em"
                  color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  lineHeight="1"
                >
                  { stats.enabledNodes.toLocaleString() }
                </Text>
              </Skeleton>
            </LinkBox>

            { /* Active Nodes */ }
            <LinkBox
              p={ 5 }
              position="relative"
              bgGradient={{
                _light: 'linear-gradient(135deg, rgba(30, 58, 138, 0.04) 0%, rgba(51, 65, 85, 0.05) 100%)',
                _dark: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(51, 65, 85, 0.1) 100%)',
              }}
              transition="all 0.2s ease"
              _hover={{
                bgGradient: {
                  _light: 'linear-gradient(135deg, rgba(30, 58, 138, 0.06) 0%, rgba(51, 65, 85, 0.08) 100%)',
                  _dark: 'linear-gradient(135deg, rgba(30, 58, 138, 0.12) 0%, rgba(51, 65, 85, 0.15) 100%)',
                },
              }}
            >
              <Flex alignItems="center" gap={ 1.5 } mb={ 2 }>
                <Text
                  fontSize="10px"
                  fontWeight={ 600 }
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={{ _light: 'rgba(30, 58, 138, 0.7)', _dark: 'rgba(255, 255, 255, 0.5)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  Active Nodes
                </Text>
                <IconSvg
                  name="check"
                  boxSize={ 3 }
                  color={{ _light: 'rgba(30, 58, 138, 0.75)', _dark: 'rgba(255, 255, 255, 0.5)' }}
                />
              </Flex>
              <Skeleton loading={ query.isPlaceholderData } w="fit-content">
                <Text
                  fontSize="26px"
                  fontWeight={ 200 }
                  letterSpacing="-0.02em"
                  color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  lineHeight="1"
                >
                  { stats.activeNodes.toLocaleString() }
                </Text>
              </Skeleton>
            </LinkBox>

            { /* Approved PCRs */ }
            <LinkBox
              p={ 5 }
              position="relative"
              bgGradient={{
                _light: 'linear-gradient(135deg, rgba(30, 58, 138, 0.04) 0%, rgba(51, 65, 85, 0.05) 100%)',
                _dark: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(51, 65, 85, 0.1) 100%)',
              }}
              transition="all 0.2s ease"
              _hover={{
                bgGradient: {
                  _light: 'linear-gradient(135deg, rgba(30, 58, 138, 0.06) 0%, rgba(51, 65, 85, 0.08) 100%)',
                  _dark: 'linear-gradient(135deg, rgba(30, 58, 138, 0.12) 0%, rgba(51, 65, 85, 0.15) 100%)',
                },
              }}
            >
              <Flex alignItems="center" gap={ 1.5 } mb={ 2 }>
                <Text
                  fontSize="10px"
                  fontWeight={ 600 }
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={{ _light: 'rgba(30, 58, 138, 0.7)', _dark: 'rgba(255, 255, 255, 0.5)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  Approved PCRs
                </Text>
                <IconSvg
                  name="nft_shield"
                  boxSize={ 3 }
                  color={{ _light: 'rgba(30, 58, 138, 0.75)', _dark: 'rgba(255, 255, 255, 0.5)' }}
                />
              </Flex>
              <Skeleton loading={ query.isPlaceholderData } w="fit-content">
                <Text
                  fontSize="26px"
                  fontWeight={ 200 }
                  letterSpacing="-0.02em"
                  color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  lineHeight="1"
                >
                  { stats.approvedPCRs.toLocaleString() }
                </Text>
              </Skeleton>
            </LinkBox>
          </Grid>
        </VStack>
      </Box>

      { /* TEE Types Grid */ }
      <Box mb={ 8 }>
        <Flex alignItems="center" gap={ 2 } mb={ 4 }>
          <Text
            fontSize="11px"
            fontWeight={ 500 }
            letterSpacing="0.1em"
            textTransform="uppercase"
            color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            TEE Types
          </Text>
          { selectedType !== null && (
            <Text
              fontSize="11px"
              fontWeight={ 500 }
              cursor="pointer"
              color="blue.500"
              onClick={ handleClearFilter }
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              Clear filter
            </Text>
          ) }
        </Flex>
        <Grid
          templateColumns="1fr"
          gap={ 2 }
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

      { /* Nodes Table */ }
      <Box>
        <Flex alignItems="center" justifyContent="space-between" mb={ 4 }>
          <Flex alignItems="center" gap={ 2 }>
            <Text
              fontSize="11px"
              fontWeight={ 500 }
              letterSpacing="0.1em"
              textTransform="uppercase"
              color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              { selectedType !== null ?
                `${ types.find((t) => t.typeId === selectedType)?.name ?? '' } Nodes` :
                'All Nodes' }
            </Text>
            <Text
              fontSize="11px"
              fontWeight={ 400 }
              color={{ _light: 'rgba(0, 0, 0, 0.3)', _dark: 'rgba(255, 255, 255, 0.3)' }}
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              { filteredNodes.length > 0 ? `(${ filteredNodes.length })` : '' }
            </Text>
          </Flex>
          <Checkbox
            size="sm"
            checked={ resolvedShowDisabled }
            onCheckedChange={ handleToggleShowDisabled }
          >
            <Text
              fontSize="11px"
              fontWeight={ 400 }
              color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
              fontFamily="system-ui, -apple-system, sans-serif"
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
            color={{ _light: 'rgba(0, 0, 0, 0.3)', _dark: 'rgba(255, 255, 255, 0.3)' }}
          >
            <Text fontSize="sm" fontFamily="system-ui, -apple-system, sans-serif">
              No TEE nodes registered yet.
            </Text>
          </Flex>
        ) }
      </Box>

      { /* Node Detail Drawer */ }
      { selectedNode && (
        <TEENodeDetailDrawer
          node={ selectedNode }
          typeName={ types.find((t) => t.typeId === selectedNode.teeType)?.name ?? `Type ${ selectedNode.teeType }` }
          onClose={ handleCloseDrawer }
        />
      ) }
    </>
  );
};

export default TEERegistry;
