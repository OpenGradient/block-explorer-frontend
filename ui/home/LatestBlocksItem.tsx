import { Box, Flex, Text, HStack } from '@chakra-ui/react';
import React from 'react';

import type { Block } from 'types/api/block';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import { LinkBox, LinkOverlay } from 'toolkit/chakra/link';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

import { HOME_BRAND } from './brand';

const { colors, fonts, text } = HOME_BRAND;

type Props = {
  block: Block;
  isLoading?: boolean;
  animation?: string;
  isFirst?: boolean;
};

const LatestBlocksItem = ({ block, isLoading, animation, isFirst = false }: Props) => {
  const blockUrl = route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: block.height.toString() } });
  const txCount = block.transaction_count;
  const barPct = Math.min(100, Math.round((Math.log(Math.max(txCount, 1) + 1) / Math.log(400)) * 100));

  return (
    <LinkBox
      animation={ animation }
      position="relative"
      width="100%"
      py={ 3 }
      px={ 3.5 }
      borderRadius="6px"
      borderBottom="1px solid"
      borderColor={{ _light: 'rgba(36, 188, 227, 0.10)', _dark: 'rgba(189, 235, 247, 0.06)' }}
      transition="all 0.18s ease"
      _hover={{
        bg: { _light: 'rgba(36, 188, 227, 0.04)', _dark: 'rgba(36, 188, 227, 0.05)' },
        borderColor: { _light: 'rgba(36, 188, 227, 0.35)', _dark: 'rgba(36, 188, 227, 0.30)' },
      }}
    >
      <LinkOverlay href={ blockUrl } noIcon/>

      <Flex alignItems="baseline" justifyContent="space-between" gap={ 3 } mb={ 1.5 }>
        <HStack gap={ 2 } alignItems="baseline">
          { isFirst && (
            <Box
              w="6px"
              h="6px"
              borderRadius="50%"
              bg={ colors.cyan }
              boxShadow="0 0 10px rgba(36, 188, 227, 0.8)"
              flexShrink={ 0 }
              alignSelf="center"
            />
          ) }
          <Text
            fontFamily={ fonts.mono }
            fontSize="15px"
            fontWeight={ 500 }
            color={ text.primary }
            letterSpacing="0"
            lineHeight="1"
          >
            #{ block.height.toLocaleString() }
          </Text>
        </HStack>
        <TimeAgoWithTooltip
          timestamp={ block.timestamp }
          enableIncrement={ !isLoading }
          isLoading={ isLoading }
          color={ text.muted }
          fontSize="11px"
          fontWeight={ 400 }
          fontFamily={ fonts.mono }
          flexShrink={ 0 }
        />
      </Flex>

      <Flex alignItems="center" gap={ 2.5 } mb={ 1.5 }>
        <Box
          flex={ 1 }
          h="3px"
          borderRadius="2px"
          bg={{ _light: 'rgba(36, 188, 227, 0.10)', _dark: 'rgba(36, 188, 227, 0.10)' }}
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top={ 0 }
            left={ 0 }
            h="100%"
            w={ `${ barPct }%` }
            bgGradient={ `linear-gradient(90deg, ${ colors.tealMid } 0%, ${ colors.cyan } 100%)` }
            borderRadius="2px"
            transition="width 0.4s ease"
          />
        </Box>
        <Text
          fontFamily={ fonts.mono }
          fontSize="11px"
          fontWeight={ 500 }
          color={ text.secondary }
          flexShrink={ 0 }
        >
          { txCount.toLocaleString() } { txCount === 1 ? 'tx' : 'txs' }
        </Text>
      </Flex>

      { !config.features.rollup.isEnabled && !config.UI.views.block.hiddenFields?.miner && (
        <HStack gap={ 1.5 } alignItems="center" minH="16px">
          <Text
            fontFamily={ fonts.mono }
            fontSize="10px"
            color={ text.muted }
            letterSpacing="0.08em"
            textTransform="uppercase"
          >
            { getNetworkValidatorTitle() }
          </Text>
          <Box maxW="160px" minW={ 0 } flex={ 1 }>
            <AddressEntity
              address={ block.miner }
              isLoading={ isLoading }
              noIcon
              noCopy
              truncation="constant"
              fontSize="11px"
              fontFamily={ fonts.mono }
              color={ text.secondary }
            />
          </Box>
        </HStack>
      ) }
    </LinkBox>
  );
};

export default LatestBlocksItem;
