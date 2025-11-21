import { chakra, Box, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Block } from 'types/api/block';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useInitialList from 'lib/hooks/useInitialList';
import useIsMobile from 'lib/hooks/useIsMobile';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { BLOCK } from 'stubs/block';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { Link } from 'toolkit/chakra/link';

import LatestBlocksItem from './LatestBlocksItem';

const LatestBlocks = () => {
  const isMobile = useIsMobile();
  // const blocksMaxCount = isMobile ? 2 : 3;
  let blocksMaxCount: number;
  if (config.features.rollup.isEnabled || config.UI.views.block.hiddenFields?.total_reward) {
    blocksMaxCount = isMobile ? 6 : 10;
  } else {
    blocksMaxCount = isMobile ? 4 : 8;
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
        <Box width="100%">
          { dataToShow.map(((block, index) => (
            <Box
              key={ block.height + (isPlaceholderData ? String(index) : '') }
              borderBottom={ index < dataToShow.length - 1 ? '1px solid' : 'none' }
              borderColor={{ _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(255, 255, 255, 0.08)' }}
            >
              <LatestBlocksItem
                block={ block }
                isLoading={ isPlaceholderData }
                animation={ initialList.getAnimationProp(block) }
              />
            </Box>
          ))) }
        </Box>
        <Box mt={ 2 } px={{ base: 3, lg: 4 }} pb={{ base: 3, lg: 4 }}>
          <Link
            href={ route({ pathname: '/blocks' }) }
            fontSize={{ base: '14px', lg: '15px' }}
            fontWeight={ 500 }
            letterSpacing="0.05em"
            textTransform="uppercase"
            color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
            fontFamily="system-ui, -apple-system, sans-serif"
            width="100%"
            display="block"
            textAlign="center"
            py={ 2 }
            transition="opacity 0.2s ease"
            _hover={{
              textDecoration: 'none',
              opacity: 0.7,
            }}
          >
            View all blocks
          </Link>
        </Box>
      </>
    );
  }

  return (
    <Box width={{ base: '100%', lg: '280px' }} flexShrink={ 0 }>
      <Box px={{ base: 3, lg: 4 }} pt={{ base: 3, lg: 5 }} pb={ 5 }>
        <Text
          fontSize={{ base: '14px', lg: '22px' }}
          fontWeight={ 500 }
          letterSpacing="0.05em"
          textTransform="uppercase"
          color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
          fontFamily="system-ui, -apple-system, sans-serif"
          mb={ statsQueryResult.data?.celo ? 2 : 0 }
        >
          Latest blocks
        </Text>
        { statsQueryResult.data?.celo && (
          <Box whiteSpace="pre-wrap" mt={ 2 }>
            <Text
              as="span"
              fontSize={{ base: '14px', lg: '15px' }}
              fontWeight={ 500 }
              letterSpacing="0.05em"
              color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              Current epoch:{ ' ' }
            </Text>
            <chakra.span
              fontSize={{ base: '14px', lg: '15px' }}
              fontWeight={ 500 }
              letterSpacing="0.05em"
              color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              #{ statsQueryResult.data.celo.epoch_number }
            </chakra.span>
          </Box>
        ) }
      </Box>
      <Box>
        { content }
      </Box>
    </Box>
  );
};

export default LatestBlocks;
