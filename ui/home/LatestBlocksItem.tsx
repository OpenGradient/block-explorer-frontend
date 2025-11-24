import { Box, Flex, Text, HStack, VStack } from '@chakra-ui/react';
import React from 'react';

import type { Block } from 'types/api/block';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import { LinkBox, LinkOverlay } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import IconSvg from 'ui/shared/IconSvg';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

type Props = {
  block: Block;
  isLoading?: boolean;
  animation?: string;
  isFirst?: boolean;
};

const LatestBlocksItem = ({ block, isLoading, animation, isFirst = false }: Props) => {
  const blockUrl = route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: block.height.toString() } });

  return (
    <Box
      position="relative"
      width="100%"
      css={{
        '& a': {
          outline: 'none !important',
          '&:hover': {
            outline: 'none !important',
          },
          '&:focus': {
            outline: 'none !important',
          },
          '&:focus-visible': {
            outline: 'none !important',
          },
        },
      }}
    >
      <LinkBox
        animation={ animation }
        position="relative"
        width="100%"
        transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
        outline="none"
        _hover={{
          transform: 'translateX(2px)',
          outline: 'none',
        }}
        _focus={{
          outline: 'none',
        }}
        _focusVisible={{
          outline: 'none',
        }}
      >
        <LinkOverlay
          href={ blockUrl }
          noIcon
        />
        <Flex
          gap={ 3 }
          alignItems="flex-start"
          position="relative"
          p={ 3.5 }
          bg={{ _light: '#ffffff', _dark: '#0a0a0a' }}
          _hover={{
            bg: { _light: 'rgba(0, 0, 0, 0.02)', _dark: 'rgba(64, 209, 219, 0.08)' },
          }}
        >
          { /* Visual Block Indicator */ }
          <Box
            position="relative"
            flexShrink={ 0 }
            mt={ 0.5 }
          >
            <IconSvg
              name="block_slim"
              boxSize={ 5 }
              color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.5)' }}
              isLoading={ isLoading }
            />
            { /* New block indicator for first block */ }
            { isFirst && (
              <Box
                position="absolute"
                top="-2px"
                right="-2px"
                width="8px"
                height="8px"
                bg="green.500"
                borderRadius="50%"
                boxShadow="0 0 4px rgba(34, 197, 94, 0.6)"
                _dark={{
                  boxShadow: '0 0 6px rgba(34, 197, 94, 0.8)',
                }}
              />
            ) }
            { /* Epoch indicator */ }
            { block.celo?.is_epoch_block && (
              <Tooltip content={ `Finalized epoch #${ block.celo.epoch_number }` }>
                <Box
                  position="absolute"
                  top="-4px"
                  right="-4px"
                  bg="orange.500"
                  borderRadius="50%"
                  width="12px"
                  height="12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconSvg
                    name="checkered_flag"
                    boxSize={ 2.5 }
                    color="white"
                    isLoading={ isLoading }
                  />
                </Box>
              </Tooltip>
            ) }
          </Box>

          { /* Content Section */ }
          <VStack
            align="stretch"
            gap={ 2.5 }
            flex={ 1 }
            minW={ 0 }
          >
            { /* Header: Block Number & Time */ }
            <Flex
              alignItems="center"
              justifyContent="space-between"
              gap={ 3 }
              flexWrap="wrap"
            >
              <BlockEntity
                isLoading={ isLoading }
                number={ block.height }
                tailLength={ 2 }
                fontSize="sm"
                fontWeight={ 500 }
                fontFamily="system-ui, -apple-system, sans-serif"
                color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                noIcon
              />
              <TimeAgoWithTooltip
                timestamp={ block.timestamp }
                enableIncrement={ !isLoading }
                isLoading={ isLoading }
                color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
                fontSize="11px"
                fontWeight={ 400 }
                fontFamily="system-ui, -apple-system, sans-serif"
                flexShrink={ 0 }
              />
            </Flex>

            { /* Stats Row */ }
            <HStack
              gap={ 4 }
              flexWrap="wrap"
              alignItems="center"
            >
              { /* Transaction Count - Prominent Display */ }
              <Skeleton loading={ isLoading }>
                <HStack gap={ 1.5 }>
                  <Text
                    fontSize="11px"
                    fontWeight={ 500 }
                    letterSpacing="0.02em"
                    color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    Txn
                  </Text>
                  <Text
                    fontSize="12px"
                    fontWeight={ 500 }
                    color={{ _light: 'rgba(0, 0, 0, 0.9)', _dark: 'rgba(255, 255, 255, 0.95)' }}
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    { block.transaction_count.toLocaleString() }
                  </Text>
                </HStack>
              </Skeleton>

              { /* Miner/Validator */ }
              { !config.features.rollup.isEnabled && !config.UI.views.block.hiddenFields?.miner && (
                <Skeleton loading={ isLoading }>
                  <HStack gap={ 1.5 }>
                    <Text
                      fontSize="11px"
                      fontWeight={ 500 }
                      letterSpacing="0.02em"
                      color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
                      fontFamily="system-ui, -apple-system, sans-serif"
                      textTransform="capitalize"
                    >
                      { getNetworkValidatorTitle() }
                    </Text>
                    <Box display="inline-block" maxW="120px">
                      <AddressEntity
                        address={ block.miner }
                        isLoading={ isLoading }
                        noIcon
                        noCopy
                        truncation="constant"
                        fontSize="11px"
                        fontWeight={ 500 }
                        fontFamily="system-ui, -apple-system, sans-serif"
                        color={{ _light: 'rgba(0, 0, 0, 0.8)', _dark: 'rgba(255, 255, 255, 0.8)' }}
                      />
                    </Box>
                  </HStack>
                </Skeleton>
              ) }
            </HStack>
          </VStack>
        </Flex>
      </LinkBox>
    </Box>
  );
};

export default LatestBlocksItem;
