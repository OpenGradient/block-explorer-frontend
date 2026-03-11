import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { getTEERegistryOverview, TEE_REGISTRY_QUERY_KEY } from 'lib/opengradient/contracts/teeRegistry';
import type { TEERegistryStats, TEETypeSummary, TEENodeWithStatus } from 'lib/opengradient/contracts/teeRegistry';
import { LinkBox } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import TEENodeDetailDrawer from 'ui/opengradient/teeRegistry/TEENodeDetailDrawer';
import TEENodesTable from 'ui/opengradient/teeRegistry/TEENodesTable';
import TEETypeCard from 'ui/opengradient/teeRegistry/TEETypeCard';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';

const PLACEHOLDER_STATS: TEERegistryStats = {
  totalTypes: 3,
  totalNodes: 12,
  activeNodes: 8,
  enabledNodes: 10,
  approvedPCRs: 5,
};

const PLACEHOLDER_TYPES: Array<TEETypeSummary> = [
  { typeId: 0, name: 'LLM Inference', totalNodes: 5, enabledNodes: 4, activeNodes: 3, addedAt: BigInt(0) },
  { typeId: 1, name: 'Agent Execution', totalNodes: 4, enabledNodes: 3, activeNodes: 3, addedAt: BigInt(0) },
  { typeId: 2, name: 'Model Training', totalNodes: 3, enabledNodes: 3, activeNodes: 2, addedAt: BigInt(0) },
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
      <PageTitle
        title="TEE Registry"
        withTextAd
        mb={ 4 }
      />

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
              fontSize={{ base: 'sm', lg: 'md' }}
              fontWeight={ 500 }
              mb={ 1.5 }
              color={{ _light: 'rgba(0, 0, 0, 0.7)', _dark: 'rgba(255, 255, 255, 0.7)' }}
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              Trusted Execution Environment Registry
            </Text>
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
              Network Security Overview
            </Text>
          </Flex>

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
                _light: 'linear-gradient(135deg, rgba(124, 58, 237, 0.04) 0%, rgba(139, 92, 246, 0.05) 100%)',
                _dark: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(139, 92, 246, 0.1) 100%)',
              }}
              transition="all 0.2s ease"
              _hover={{
                bgGradient: {
                  _light: 'linear-gradient(135deg, rgba(124, 58, 237, 0.06) 0%, rgba(139, 92, 246, 0.08) 100%)',
                  _dark: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(139, 92, 246, 0.15) 100%)',
                },
              }}
            >
              <Flex alignItems="center" gap={ 1.5 } mb={ 2 }>
                <Text
                  fontSize="10px"
                  fontWeight={ 600 }
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={{ _light: 'rgba(124, 58, 237, 0.7)', _dark: 'rgba(139, 92, 246, 0.8)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  TEE Types
                </Text>
                <IconSvg
                  name="apps"
                  boxSize={ 3 }
                  color={{ _light: 'rgba(124, 58, 237, 0.75)', _dark: 'rgba(139, 92, 246, 0.85)' }}
                />
              </Flex>
              <Skeleton loading={ query.isPlaceholderData } w="fit-content">
                <Text
                  fontSize="32px"
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
                  color={{ _light: 'rgba(30, 58, 138, 0.7)', _dark: 'rgba(51, 65, 85, 0.8)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  Total Nodes
                </Text>
                <IconSvg
                  name="validator"
                  boxSize={ 3 }
                  color={{ _light: 'rgba(30, 58, 138, 0.75)', _dark: 'rgba(51, 65, 85, 0.85)' }}
                />
              </Flex>
              <Skeleton loading={ query.isPlaceholderData } w="fit-content">
                <Text
                  fontSize="32px"
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
                _light: 'linear-gradient(135deg, rgba(6, 182, 212, 0.04) 0%, rgba(14, 165, 233, 0.05) 100%)',
                _dark: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(14, 165, 233, 0.1) 100%)',
              }}
              transition="all 0.2s ease"
              _hover={{
                bgGradient: {
                  _light: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06) 0%, rgba(14, 165, 233, 0.08) 100%)',
                  _dark: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(14, 165, 233, 0.15) 100%)',
                },
              }}
            >
              <Flex alignItems="center" gap={ 1.5 } mb={ 2 }>
                <Text
                  fontSize="10px"
                  fontWeight={ 600 }
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={{ _light: 'rgba(6, 182, 212, 0.7)', _dark: 'rgba(14, 165, 233, 0.8)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  Enabled Nodes
                </Text>
                <IconSvg
                  name="certified"
                  boxSize={ 3 }
                  color={{ _light: 'rgba(6, 182, 212, 0.75)', _dark: 'rgba(14, 165, 233, 0.85)' }}
                />
              </Flex>
              <Skeleton loading={ query.isPlaceholderData } w="fit-content">
                <Text
                  fontSize="32px"
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
                _light: 'linear-gradient(135deg, rgba(22, 163, 74, 0.04) 0%, rgba(34, 197, 94, 0.05) 100%)',
                _dark: 'linear-gradient(135deg, rgba(22, 163, 74, 0.08) 0%, rgba(34, 197, 94, 0.1) 100%)',
              }}
              transition="all 0.2s ease"
              _hover={{
                bgGradient: {
                  _light: 'linear-gradient(135deg, rgba(22, 163, 74, 0.06) 0%, rgba(34, 197, 94, 0.08) 100%)',
                  _dark: 'linear-gradient(135deg, rgba(22, 163, 74, 0.12) 0%, rgba(34, 197, 94, 0.15) 100%)',
                },
              }}
            >
              <Flex alignItems="center" gap={ 1.5 } mb={ 2 }>
                <Text
                  fontSize="10px"
                  fontWeight={ 600 }
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={{ _light: 'rgba(22, 163, 74, 0.7)', _dark: 'rgba(34, 197, 94, 0.8)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  Active Nodes
                </Text>
                <IconSvg
                  name="check"
                  boxSize={ 3 }
                  color={{ _light: 'rgba(22, 163, 74, 0.75)', _dark: 'rgba(34, 197, 94, 0.85)' }}
                />
              </Flex>
              <Skeleton loading={ query.isPlaceholderData } w="fit-content">
                <Text
                  fontSize="32px"
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
                _light: 'linear-gradient(135deg, rgba(217, 119, 6, 0.04) 0%, rgba(245, 158, 11, 0.05) 100%)',
                _dark: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, rgba(245, 158, 11, 0.1) 100%)',
              }}
              transition="all 0.2s ease"
              _hover={{
                bgGradient: {
                  _light: 'linear-gradient(135deg, rgba(217, 119, 6, 0.06) 0%, rgba(245, 158, 11, 0.08) 100%)',
                  _dark: 'linear-gradient(135deg, rgba(217, 119, 6, 0.12) 0%, rgba(245, 158, 11, 0.15) 100%)',
                },
              }}
            >
              <Flex alignItems="center" gap={ 1.5 } mb={ 2 }>
                <Text
                  fontSize="10px"
                  fontWeight={ 600 }
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={{ _light: 'rgba(217, 119, 6, 0.7)', _dark: 'rgba(245, 158, 11, 0.8)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  Approved PCRs
                </Text>
                <IconSvg
                  name="nft_shield"
                  boxSize={ 3 }
                  color={{ _light: 'rgba(217, 119, 6, 0.75)', _dark: 'rgba(245, 158, 11, 0.85)' }}
                />
              </Flex>
              <Skeleton loading={ query.isPlaceholderData } w="fit-content">
                <Text
                  fontSize="32px"
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
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: `repeat(${ Math.min(types.length, 4) }, 1fr)` }}
          gap={ 4 }
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
        <Flex alignItems="center" gap={ 2 } mb={ 4 }>
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
            { allNodes.length > 0 ? `(${ allNodes.length })` : '' }
          </Text>
        </Flex>
        <TEENodesTable
          nodes={ allNodes }
          types={ types }
          isLoading={ query.isPlaceholderData }
          onNodeClick={ handleNodeClick }
        />
        { !query.isPlaceholderData && allNodes.length === 0 && (
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
