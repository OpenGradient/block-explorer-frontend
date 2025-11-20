import { chakra, Box, Flex, Text, VStack } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Block } from 'types/api/block';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useInitialList from 'lib/hooks/useInitialList';
import useIsMobile from 'lib/hooks/useIsMobile';
import { nbsp } from 'lib/html-entities';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { BLOCK } from 'stubs/block';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';

import LatestBlocksItem from './LatestBlocksItem';

const LatestBlocks = () => {
  const isMobile = useIsMobile();
  // const blocksMaxCount = isMobile ? 2 : 3;
  let blocksMaxCount: number;
  if (config.features.rollup.isEnabled || config.UI.views.block.hiddenFields?.total_reward) {
    blocksMaxCount = isMobile ? 4 : 5;
  } else {
    blocksMaxCount = isMobile ? 2 : 3;
  }
  const { data, isPlaceholderData, isError } = useApiQuery('homepage_blocks', {
    queryOptions: {
      placeholderData: Array(blocksMaxCount).fill(BLOCK),
    },
  });
  const initialList = useInitialList({
    data: data ?? [],
    idFn: (block) => block.height,
    enabled: !isPlaceholderData,
  });

  const queryClient = useQueryClient();
  const statsQueryResult = useApiQuery('stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(getResourceKey('homepage_blocks'), (prevData: Array<Block> | undefined) => {

      const newData = prevData ? [ ...prevData ] : [];

      if (newData.some((block => block.height === payload.block.height))) {
        return newData;
      }

      return [ payload.block, ...newData ].sort((b1, b2) => b2.height - b1.height).slice(0, blocksMaxCount);
    });
  }, [ queryClient, blocksMaxCount ]);

  const channel = useSocketChannel({
    topic: 'blocks:new_block',
    isDisabled: isPlaceholderData || isError,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewBlockMessage,
  });

  let content;

  if (isError) {
    content = <Text>No data. Please reload the page.</Text>;
  }

  if (data) {
    const dataToShow = data.slice(0, blocksMaxCount);

    content = (
      <>
        <VStack gap={ 2 } mb={ 3 } overflow="hidden" alignItems="stretch">
          { dataToShow.map(((block, index) => (
            <LatestBlocksItem
              key={ block.height + (isPlaceholderData ? String(index) : '') }
              block={ block }
              isLoading={ isPlaceholderData }
              animation={ initialList.getAnimationProp(block) }
            />
          ))) }
        </VStack>
        <Flex justifyContent="center">
          <Link textStyle="sm" href={ route({ pathname: '/blocks' }) }>View all blocks</Link>
        </Flex>
      </>
    );
  }

  return (
    <Box 
      width={{ base: '100%', lg: '320px' }} 
      flexShrink={ 0 }
      bgColor={{ _light: 'white', _dark: 'whiteAlpha.50' }}
      border="1px solid"
      borderColor={{ _light: 'gray.100', _dark: 'whiteAlpha.200' }}
      borderRadius="xl"
      p={ 5 }
      boxShadow={{ _light: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)', _dark: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)' }}
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 50%, rgba(59, 130, 246, 0.8) 100%)',
      }}
    >
      <Heading level="3" mb={ 4 } fontSize="lg" fontWeight={ 700 }>Latest blocks</Heading>
      { statsQueryResult.data?.network_utilization_percentage !== undefined && (
        <Skeleton loading={ statsQueryResult.isPlaceholderData } mt={ 2 } mb={ 3 } display="inline-block" textStyle="sm">
          <Text as="span" color="text.secondary">
            Network utilization:{ nbsp }
          </Text>
          <Text as="span" color="blue.500" fontWeight={ 700 }>
            { statsQueryResult.data?.network_utilization_percentage.toFixed(2) }%
          </Text>
        </Skeleton>
      ) }
      { statsQueryResult.data?.celo && (
        <Box whiteSpace="pre-wrap" textStyle="sm" mt={ 2 } mb={ 3 }>
          <span>Current epoch: </span>
          <chakra.span fontWeight={ 700 }>#{ statsQueryResult.data.celo.epoch_number }</chakra.span>
        </Box>
      ) }
      <Box mt={ 2 }>
        { content }
      </Box>
    </Box>
  );
};

export default LatestBlocks;
