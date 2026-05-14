import { Box, Text, Flex, VStack } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Block } from 'types/api/block';

import { route } from 'nextjs-routes';

import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useInitialList from 'lib/hooks/useInitialList';
import useIsMobile from 'lib/hooks/useIsMobile';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { BLOCK } from 'stubs/block';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { Link } from 'toolkit/chakra/link';

import { HOME_BRAND } from './brand';
import LatestBlocksItem from './LatestBlocksItem';

const { colors, fonts, panel, text } = HOME_BRAND;

const LatestBlocks = () => {
  const isMobile = useIsMobile();
  const blocksMaxCount = isMobile ? 4 : 6;
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
    content = (
      <Box px={ 4 } py={ 8 }>
        <Text
          fontSize="sm"
          color={ text.secondary }
          fontFamily={ fonts.sans }
        >
          No data. Please reload the page.
        </Text>
      </Box>
    );
  }

  if (data) {
    const dataToShow = data.slice(0, blocksMaxCount);

    content = (
      <>
        <VStack
          align="stretch"
          gap={ 2.5 }
          px={{ base: 3, lg: 4 }}
          pt={ 3 }
          pb={ 4 }
        >
          { dataToShow.map(((block, index) => (
            <LatestBlocksItem
              key={ block.height + (isPlaceholderData ? String(index) : '') }
              block={ block }
              isLoading={ isPlaceholderData }
              animation={ initialList.getAnimationProp(block) }
              isFirst={ index === 0 }
            />
          ))) }
        </VStack>
        <Box
          px={{ base: 3, lg: 4 }}
          pb={{ base: 4, lg: 5 }}
          pt={ 2 }
        >
          <Link
            href={ route({ pathname: '/blocks' }) }
            fontSize="10px"
            fontWeight={ 500 }
            letterSpacing="0.08em"
            textTransform="uppercase"
            color={ text.muted }
            fontFamily={ fonts.mono }
            width="100%"
            display="block"
            textAlign="center"
            py={ 2.5 }
            transition="all 0.2s ease"
            _hover={{
              textDecoration: 'none',
              opacity: 0.7,
              color: text.accent,
            }}
          >
            View all blocks
          </Link>
        </Box>
      </>
    );
  }

  return (
    <Box
      width="100%"
      flexShrink={ 0 }
      position="relative"
      border="1px solid"
      borderColor={ panel.border }
      borderRadius="8px"
      bg={ panel.bg }
      boxShadow={ panel.shadow }
      backdropFilter="blur(18px)"
      overflow="hidden"
    >
      <Flex
        alignItems="center"
        gap={ 2 }
        px={{ base: 3, lg: 4 }}
        pt={{ base: 4, lg: 4 }}
        pb={ 3 }
        borderBottom="1px solid"
        borderColor={ panel.border }
      >
        <Box
          w="6px"
          h="6px"
          borderRadius="50%"
          bg={ colors.cyan }
          boxShadow="0 0 10px rgba(36, 188, 227, 0.65)"
          flexShrink={ 0 }
        />
        <Text
          fontSize="11px"
          fontWeight={ 500 }
          letterSpacing="0.12em"
          textTransform="uppercase"
          color={ text.accent }
          fontFamily={ fonts.mono }
        >
          / Latest blocks
        </Text>
      </Flex>
      { statsQueryResult.data?.celo && (
        <Box px={{ base: 3, lg: 4 }} pb={ 3 }>
          <Box
            px={ 3 }
            py={ 2 }
            bg={{ _light: 'rgba(36, 188, 227, 0.06)', _dark: 'rgba(36, 188, 227, 0.08)' }}
            borderRadius="8px"
          >
            <Text
              fontSize="10px"
              fontWeight={ 500 }
              letterSpacing="0.08em"
              color={ text.muted }
              fontFamily={ fonts.mono }
              mb={ 0.5 }
            >
              Current epoch
            </Text>
            <Text
              fontSize="14px"
              fontWeight={ 400 }
              color={ text.primary }
              fontFamily={ fonts.mono }
            >
              #{ statsQueryResult.data.celo.epoch_number }
            </Text>
          </Box>
        </Box>
      ) }
      <Box>
        { content }
      </Box>
    </Box>
  );
};

export default LatestBlocks;
