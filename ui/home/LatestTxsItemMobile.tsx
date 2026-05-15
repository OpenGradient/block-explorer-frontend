import {
  Box,
  Flex,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { route } from 'nextjs-routes';

import { SUPPORTED_INFERENCE_ADDRESSES } from 'lib/inferences/address';
import { Badge } from 'toolkit/chakra/badge';
import { LinkBox, LinkOverlay, Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';
import TxWatchListTags from 'ui/shared/tx/TxWatchListTags';
import TxType from 'ui/txs/TxType';

import { HOME_BRAND } from './brand';
import useInferenceType from './useInferenceType';

const { fonts, text } = HOME_BRAND;

type Props = {
  tx: Transaction;
  isLoading?: boolean;
};

const LatestTxsItemMobile = ({ tx, isLoading }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;
  const hasInference = tx.to?.hash === SUPPORTED_INFERENCE_ADDRESSES.InferenceHub ||
                       tx.to?.hash === SUPPORTED_INFERENCE_ADDRESSES.LLMInference;
  const inferenceInfo = useInferenceType(tx, isLoading || false);
  const txUrl = route({ pathname: '/tx/[hash]', query: { hash: tx.hash } });

  return (
    <LinkBox
      width="100%"
      py={ 4 }
      px={ 4 }
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      position="relative"
      borderRadius="6px"
      _hover={{
        bg: { _light: 'rgba(36, 188, 227, 0.05)', _dark: 'rgba(36, 188, 227, 0.06)' },
        boxShadow: { _light: 'inset 0 0 0 1px rgba(36, 188, 227, 0.18)', _dark: 'inset 0 0 0 1px rgba(36, 188, 227, 0.22)' },
      }}
      display={{ base: 'block', lg: 'none' }}
    >
      <LinkOverlay href={ txUrl } noIcon/>
      <VStack align="stretch" gap={ 3 }>
        <Flex
          alignItems="center"
          width="100%"
          justifyContent="space-between"
          gap={ 2 }
        >
          <TxEntity
            isLoading={ isLoading }
            hash={ tx.hash }
            fontWeight={ 500 }
            fontSize="sm"
            fontFamily={ fonts.mono }
            color={ text.primary }
            truncation="dynamic"
            tailLength={ 8 }
            noIcon
          />
          <TimeAgoWithTooltip
            timestamp={ tx.timestamp }
            enableIncrement
            isLoading={ isLoading }
            color={ text.muted }
            fontSize="11px"
            fontWeight={ 400 }
            fontFamily={ fonts.mono }
            flexShrink={ 0 }
          />
        </Flex>

        <HStack flexWrap="wrap" gap={ 1.5 }>
          <TxType types={ tx.transaction_types } isLoading={ isLoading }/>
          { tx.status !== 'error' && (
            <TxStatus status={ tx.status } isLoading={ isLoading }/>
          ) }
          { hasInference && (
            <>
              <Badge
                colorPalette="purple"
                loading={ isLoading }
                fontSize="10px"
                fontWeight={ 500 }
                px={ 2 }
                py={ 0.5 }
                minH="6"
                fontFamily={ fonts.mono }
                letterSpacing="0.08em"
              >
                { inferenceInfo?.type || 'AI Inference' }
              </Badge>
              { inferenceInfo?.mode && inferenceInfo.mode !== 'UNKNOWN' && (
                <Badge
                  colorPalette="blue"
                  loading={ isLoading }
                  fontSize="10px"
                  fontWeight={ 500 }
                  px={ 2 }
                  py={ 0.5 }
                  minH="6"
                  fontFamily={ fonts.mono }
                  letterSpacing="0.08em"
                >
                  { inferenceInfo.mode }
                </Badge>
              ) }
            </>
          ) }
          <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
        </HStack>

        <Box>
          <Text
            fontSize="10px"
            fontWeight={ 500 }
            letterSpacing="0.08em"
            textTransform="uppercase"
            color={ text.muted }
            fontFamily={ fonts.mono }
            mb={ 1.5 }
          >
            Addresses
          </Text>
          <Box
            fontSize="12px"
            fontFamily={ fonts.sans }
          >
            <AddressFromTo
              from={ tx.from }
              to={ dataTo }
              isLoading={ isLoading }
              noCopy
              noIcon
            />
          </Box>
        </Box>

        { hasInference && (
          <Box>
            <Text
              fontSize="10px"
              fontWeight={ 500 }
              letterSpacing="0.08em"
              textTransform="uppercase"
              color={ text.muted }
              fontFamily={ fonts.mono }
              mb={ 1.5 }
            >
              AI Inference
            </Text>
            { !inferenceInfo && (
              <Text
                fontSize="11px"
                color={ text.muted }
                fontFamily={ fonts.sans }
              >
                -
              </Text>
            ) }
            { inferenceInfo && inferenceInfo.isLoading && (
              <Text
                fontSize="11px"
                color={ text.muted }
                fontFamily={ fonts.sans }
              >
                Loading...
              </Text>
            ) }
            { inferenceInfo && !inferenceInfo.isLoading && inferenceInfo.modelCID && (
              <Skeleton loading={ isLoading }>
                <Flex
                  fontSize="11px"
                  color={ text.secondary }
                  fontFamily={ fonts.sans }
                  alignItems="baseline"
                  gap={ 1 }
                >
                  <Text>Model:</Text>
                  <Link
                    href={ `https://walruscan.com/mainnet/blob/${ inferenceInfo.modelCID }` }
                    external
                    fontSize="11px"
                    fontWeight={ 500 }
                    fontFamily="mono"
                    color={ text.secondary }
                    _hover={{
                      textDecoration: 'underline',
                      color: text.accent,
                    }}
                    lineClamp={ 1 }
                  >
                    { inferenceInfo.modelCID.slice(0, 8) }...
                  </Link>
                </Flex>
              </Skeleton>
            ) }
          </Box>
        ) }
      </VStack>
    </LinkBox>
  );
};

export default React.memo(LatestTxsItemMobile);
