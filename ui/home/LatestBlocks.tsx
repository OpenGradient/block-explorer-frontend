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
import { Heading } from 'toolkit/chakra/heading';
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
            <Box key={ block.height + (isPlaceholderData ? String(index) : '') } mb={ 2 }>
              <LatestBlocksItem
                block={ block }
                isLoading={ isPlaceholderData }
                animation={ initialList.getAnimationProp(block) }
              />
            </Box>
          ))) }
        </Box>
        <Box mt={ 4 }>
          <Link
            textStyle="sm"
            href={ route({ pathname: '/blocks' }) }
            color={{ _light: 'blue.600', _dark: 'blue.300' }}
            fontWeight={ 500 }
            px={ 4 }
            py={ 2 }
            width="100%"
            display="block"
            textAlign="center"
            transition="all 0.2s"
            _hover={{
              textDecoration: 'none',
              bg: { _light: 'blue.50', _dark: 'blue.900' },
              color: { _light: 'blue.700', _dark: 'blue.200' },
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
      <Box px={{ base: 4, lg: 6 }} pt={{ base: 4, lg: 6 }} pb={ 4 }>
        <Heading
          level="3"
          fontSize={{ base: 'xl', lg: '2xl' }}
          fontWeight={ 700 }
          letterSpacing="-0.02em"
          mb={ statsQueryResult.data?.celo ? 2 : 0 }
        >
          Latest blocks
        </Heading>
        { statsQueryResult.data?.celo && (
          <Box whiteSpace="pre-wrap" textStyle="sm" mt={ 2 }>
            <span>Current epoch: </span>
            <chakra.span fontWeight={ 700 }>#{ statsQueryResult.data.celo.epoch_number }</chakra.span>
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
