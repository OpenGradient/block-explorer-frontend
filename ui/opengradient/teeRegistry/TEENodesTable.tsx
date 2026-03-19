import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import dayjs from 'lib/date/dayjs';
import type { TEENodeWithStatus, TEETypeSummary } from 'lib/opengradient/contracts/teeRegistry';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableBody, TableCell, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  nodes: Array<TEENodeWithStatus>;
  types: Array<TEETypeSummary>;
  isLoading?: boolean;
  onNodeClick: (node: TEENodeWithStatus) => void;
};

const StatusIndicator = ({ isActive, enabled }: { isActive: boolean; enabled: boolean }) => {
  if (isActive) {
    return (
      <Flex alignItems="center" gap={ 1.5 }>
        <Box
          w="6px"
          h="6px"
          borderRadius="50%"
          bg="green.500"
          boxShadow="0 0 4px rgba(34, 197, 94, 0.5)"
          animation="pulseOpacity 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
        />
        <Text
          fontSize="xs"
          fontWeight={ 500 }
          color={{ _light: 'rgba(22, 163, 74, 0.9)', _dark: 'rgba(34, 197, 94, 0.95)' }}
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          Active
        </Text>
      </Flex>
    );
  }

  if (enabled) {
    return (
      <Flex alignItems="center" gap={ 1.5 }>
        <Box
          w="6px"
          h="6px"
          borderRadius="50%"
          bg={{ _light: 'rgba(217, 119, 6, 0.7)', _dark: 'rgba(245, 158, 11, 0.8)' }}
        />
        <Text
          fontSize="xs"
          fontWeight={ 500 }
          color={{ _light: 'rgba(217, 119, 6, 0.8)', _dark: 'rgba(245, 158, 11, 0.9)' }}
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          Enabled
        </Text>
      </Flex>
    );
  }

  return (
    <Flex alignItems="center" gap={ 1.5 }>
      <Box
        w="6px"
        h="6px"
        borderRadius="50%"
        bg={{ _light: 'rgba(0, 0, 0, 0.15)', _dark: 'rgba(255, 255, 255, 0.15)' }}
      />
      <Text
        fontSize="xs"
        fontWeight={ 500 }
        color={{ _light: 'rgba(0, 0, 0, 0.35)', _dark: 'rgba(255, 255, 255, 0.35)' }}
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        Disabled
      </Text>
    </Flex>
  );
};

function formatTimeAgo(timestamp: bigint) {
  if (timestamp === BigInt(0)) return 'Never';
  return dayjs.unix(Number(timestamp)).fromNow();
}

const NodeRow = ({ node, typeNameMap, isLoading, onNodeClick }: {
  node: TEENodeWithStatus;
  typeNameMap: Record<number, string>;
  isLoading?: boolean;
  onNodeClick: (node: TEENodeWithStatus) => void;
}) => {
  const handleClick = React.useCallback(() => {
    onNodeClick(node);
  }, [ onNodeClick, node ]);

  return (
    <TableRow
      role="group"
      cursor="pointer"
      transition="all 0.15s ease"
      _hover={{
        bg: { _light: 'rgba(124, 58, 237, 0.02)', _dark: 'rgba(139, 92, 246, 0.04)' },
      }}
      onClick={ handleClick }
    >
      <TableCell>
        <Skeleton loading={ isLoading }>
          <StatusIndicator isActive={ node.isActive } enabled={ node.enabled }/>
        </Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading }>
          <AddressEntity
            address={{ hash: node.owner, is_contract: false }}
            truncation="constant"
          />
        </Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading }>
          <Text
            fontSize="xs"
            fontWeight={ 500 }
            px={ 2 }
            py={ 0.5 }
            borderRadius="sm"
            bg={{ _light: 'rgba(124, 58, 237, 0.06)', _dark: 'rgba(139, 92, 246, 0.1)' }}
            color={{ _light: 'rgba(124, 58, 237, 0.8)', _dark: 'rgba(139, 92, 246, 0.9)' }}
            w="fit-content"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            { typeNameMap[node.teeType] ?? `Type ${ node.teeType }` }
          </Text>
        </Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading }>
          <Text
            fontSize="xs"
            fontFamily="mono"
            color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
            title={ node.pcrHash }
          >
            { node.pcrHash ? `${ node.pcrHash.slice(0, 6) }...${ node.pcrHash.slice(-4) }` : 'N/A' }
          </Text>
        </Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading }>
          <Text
            fontSize="xs"
            fontFamily="mono"
            color={{ _light: 'rgba(0, 0, 0, 0.6)', _dark: 'rgba(255, 255, 255, 0.6)' }}
            maxW="200px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            { node.endpoint || 'N/A' }
          </Text>
        </Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading }>
          <Text
            fontSize="xs"
            color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            { formatTimeAgo(node.lastHeartbeatAt) }
          </Text>
        </Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading }>
          <Text
            fontSize="xs"
            color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            { formatTimeAgo(node.registeredAt) }
          </Text>
        </Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading }>
          <IconButton
            aria-label="Open node details"
            variant="ghost"
            size="2xs"
            borderRadius="full"
            color={{ _light: 'rgba(0, 0, 0, 0.3)', _dark: 'rgba(255, 255, 255, 0.3)' }}
            _groupHover={{ color: { _light: 'rgba(124, 58, 237, 0.7)', _dark: 'rgba(139, 92, 246, 0.8)' } }}
          >
            <IconSvg name="arrows/east-mini" boxSize={ 5 }/>
          </IconButton>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

function statusOrder(node: TEENodeWithStatus): number {
  if (node.isActive) return 0;
  if (node.enabled) return 1;
  return 2;
}

const TEENodesTable = ({ nodes, types, isLoading, onNodeClick }: Props) => {
  const typeNameMap = React.useMemo(() => {
    const map: Record<number, string> = {};
    types.forEach((t) => {
      map[t.typeId] = t.name;
    });
    return map;
  }, [ types ]);

  const sortedNodes = React.useMemo(() =>
    [ ...nodes ].sort((a, b) => statusOrder(a) - statusOrder(b)),
  [ nodes ]);

  return (
    <TableRoot>
      <TableHeaderSticky top={ 0 }>
        <TableRow>
          <TableColumnHeader w="60px">Status</TableColumnHeader>
          <TableColumnHeader w="160px">Owner</TableColumnHeader>
          <TableColumnHeader w="120px">Type</TableColumnHeader>
          <TableColumnHeader w="120px">PCR Hash</TableColumnHeader>
          <TableColumnHeader w="200px">Endpoint</TableColumnHeader>
          <TableColumnHeader w="120px">Last Heartbeat</TableColumnHeader>
          <TableColumnHeader w="120px">Registered</TableColumnHeader>
          <TableColumnHeader w="50px"/>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { sortedNodes.map((node) => (
          <NodeRow
            key={ node.teeId }
            node={ node }
            typeNameMap={ typeNameMap }
            isLoading={ isLoading }
            onNodeClick={ onNodeClick }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default TEENodesTable;
