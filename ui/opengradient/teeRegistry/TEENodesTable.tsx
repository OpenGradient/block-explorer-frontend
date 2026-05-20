import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import dayjs from 'lib/date/dayjs';
import type { TEENodeWithStatus, TEETypeSummary } from 'lib/opengradient/contracts/teeRegistry';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableBody, TableCell, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import { OPENGRADIENT_BRAND } from 'ui/opengradient/brand';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  nodes: Array<TEENodeWithStatus>;
  types: Array<TEETypeSummary>;
  isLoading?: boolean;
  onNodeClick: (node: TEENodeWithStatus) => void;
};

const { colors, fonts, panel, text } = OPENGRADIENT_BRAND;

const STATUS_STYLE = {
  active: {
    label: 'Active',
    dot: '#61d199',
    fg: { _light: '#23824f', _dark: '#61d199' },
    bg: { _light: 'rgba(46, 158, 102, 0.10)', _dark: 'rgba(97, 209, 153, 0.10)' },
    border: { _light: 'rgba(46, 158, 102, 0.18)', _dark: 'rgba(97, 209, 153, 0.22)' },
  },
  enabled: {
    label: 'Enabled',
    dot: '#d6a33d',
    fg: { _light: '#9d6d10', _dark: '#d6a33d' },
    bg: { _light: 'rgba(214, 163, 61, 0.10)', _dark: 'rgba(214, 163, 61, 0.10)' },
    border: { _light: 'rgba(214, 163, 61, 0.20)', _dark: 'rgba(214, 163, 61, 0.24)' },
  },
  disabled: {
    label: 'Disabled',
    dot: '#708195',
    fg: text.muted,
    bg: { _light: 'rgba(49, 74, 125, 0.06)', _dark: 'rgba(189, 235, 247, 0.05)' },
    border: panel.border,
  },
};

const getStatus = (node: TEENodeWithStatus) => {
  if (node.isActive) return STATUS_STYLE.active;
  if (node.enabled) return STATUS_STYLE.enabled;
  return STATUS_STYLE.disabled;
};

const StatusPill = ({ node }: { node: TEENodeWithStatus }) => {
  const status = getStatus(node);

  return (
    <Flex
      alignItems="center"
      gap={ 1.5 }
      w="fit-content"
      px={ 2 }
      py={ 1 }
      border="1px solid"
      borderColor={ status.border }
      borderRadius="999px"
      bg={ status.bg }
    >
      <Box
        w="6px"
        h="6px"
        borderRadius="50%"
        bg={ status.dot }
        boxShadow={ node.isActive ? '0 0 8px rgba(97, 209, 153, 0.62)' : 'none' }
        animation={ node.isActive ? 'pulseOpacity 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none' }
      />
      <Text
        fontFamily={ fonts.mono }
        fontSize="10px"
        fontWeight={ 500 }
        letterSpacing="0.06em"
        textTransform="uppercase"
        color={ status.fg }
      >
        { status.label }
      </Text>
    </Flex>
  );
};

function formatTimeAgo(timestamp: bigint) {
  if (timestamp === BigInt(0)) return 'Never';
  return dayjs.unix(Number(timestamp)).fromNow();
}

const formatHash = (hash: string, head = 8, tail = 4) => {
  if (!hash) return 'N/A';
  if (hash.length <= head + tail + 3) return hash;
  return `${ hash.slice(0, head) }...${ hash.slice(-tail) }`;
};

const HeaderCell = ({ children, w }: { children?: React.ReactNode; w?: string }) => (
  <TableColumnHeader
    w={ w }
    py={ 3 }
    px={ 4 }
    bg={{ _light: 'rgba(233, 248, 252, 0.72)', _dark: 'rgba(15, 22, 38, 0.86)' }}
    color={ text.secondary }
    fontFamily={ fonts.mono }
    fontSize="10px"
    fontWeight={ 500 }
    letterSpacing="0.08em"
    textTransform="uppercase"
    borderColor={ panel.border }
  >
    { children }
  </TableColumnHeader>
);

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
      transition="background-color 0.15s ease"
      borderBottom="1px solid"
      borderColor={ panel.border }
      _hover={{
        bg: { _light: 'rgba(36, 188, 227, 0.04)', _dark: 'rgba(36, 188, 227, 0.06)' },
      }}
      onClick={ handleClick }
    >
      <TableCell py={ 3 } px={ 4 }>
        <Skeleton loading={ isLoading } w="fit-content">
          <StatusPill node={ node }/>
        </Skeleton>
      </TableCell>
      <TableCell py={ 3 } px={ 4 }>
        <Skeleton loading={ isLoading }>
          <Flex direction="column" gap={ 1 } minW={ 0 }>
            <AddressEntity
              address={{ hash: node.owner, is_contract: false }}
              truncation="constant"
              noIcon
              noCopy
              fontSize="13px"
              fontWeight={ 500 }
              color={ text.primary }
            />
            <Text
              fontFamily={ fonts.mono }
              fontSize="10px"
              color={ text.muted }
              truncate
            >
              ID { formatHash(node.teeId, 6, 4) }
            </Text>
          </Flex>
        </Skeleton>
      </TableCell>
      <TableCell py={ 3 } px={ 4 }>
        <Skeleton loading={ isLoading } w="fit-content">
          <Text
            fontFamily={ fonts.mono }
            fontSize="11px"
            fontWeight={ 500 }
            px={ 2 }
            py={ 1 }
            borderRadius="6px"
            bg={{ _light: 'rgba(36, 188, 227, 0.10)', _dark: 'rgba(36, 188, 227, 0.13)' }}
            color={ text.accent }
            w="fit-content"
          >
            { typeNameMap[node.teeType] ?? `Type ${ node.teeType }` }
          </Text>
        </Skeleton>
      </TableCell>
      <TableCell py={ 3 } px={ 4 }>
        <Skeleton loading={ isLoading } w="fit-content">
          <Text
            fontFamily={ fonts.mono }
            fontSize="12px"
            color={ text.secondary }
            title={ node.pcrHash }
          >
            { formatHash(node.pcrHash, 8, 5) }
          </Text>
        </Skeleton>
      </TableCell>
      <TableCell py={ 3 } px={ 4 }>
        <Skeleton loading={ isLoading }>
          <Text
            fontFamily={ fonts.mono }
            fontSize="12px"
            color={ text.secondary }
            maxW="250px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            title={ node.endpoint }
          >
            { node.endpoint || 'N/A' }
          </Text>
        </Skeleton>
      </TableCell>
      <TableCell py={ 3 } px={ 4 }>
        <Skeleton loading={ isLoading } w="fit-content">
          <Text
            fontFamily={ fonts.mono }
            fontSize="12px"
            color={ node.isActive ? text.primary : text.muted }
          >
            { formatTimeAgo(node.lastHeartbeatAt) }
          </Text>
        </Skeleton>
      </TableCell>
      <TableCell py={ 3 } px={ 4 }>
        <Skeleton loading={ isLoading } w="fit-content">
          <Text fontFamily={ fonts.mono } fontSize="12px" color={ text.muted }>
            { formatTimeAgo(node.registeredAt) }
          </Text>
        </Skeleton>
      </TableCell>
      <TableCell py={ 3 } px={ 4 } textAlign="right">
        <Skeleton loading={ isLoading } w="fit-content" ml="auto">
          <IconSvg
            name="arrows/east"
            boxSize={ 5 }
            color={ text.muted }
            transition="color 0.15s ease, transform 0.15s ease"
            _groupHover={{
              color: colors.cyan,
              transform: 'translateX(2px)',
            }}
          />
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
    <Box overflowX="auto">
      <TableRoot minW="1120px" tableLayout="fixed">
        <TableHeaderSticky top={ 0 }>
          <TableRow borderBottom="1px solid" borderColor={ panel.border }>
            <HeaderCell w="132px">Status</HeaderCell>
            <HeaderCell w="210px">Node / Owner</HeaderCell>
            <HeaderCell w="150px">Type</HeaderCell>
            <HeaderCell w="160px">PCR Hash</HeaderCell>
            <HeaderCell>Endpoint</HeaderCell>
            <HeaderCell w="140px">Heartbeat</HeaderCell>
            <HeaderCell w="140px">Registered</HeaderCell>
            <HeaderCell w="56px"/>
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
    </Box>
  );
};

export default TEENodesTable;
