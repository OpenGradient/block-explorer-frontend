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

import useInferenceType from './useInferenceType';

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
      _hover={{
        bg: { _light: 'rgba(0, 0, 0, 0.02)', _dark: 'rgba(64, 209, 219, 0.05)' },
      }}
      display={{ base: 'block', lg: 'none' }}
    >
      <LinkOverlay href={ txUrl } noIcon/>
      <VStack align="stretch" gap={ 3 }>
        { /* Header: Hash & Time */ }
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
            fontFamily="system-ui, -apple-system, sans-serif"
            color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
            truncation="dynamic"
            tailLength={ 8 }
            noIcon
          />
          <TimeAgoWithTooltip
            timestamp={ tx.timestamp }
            enableIncrement
            isLoading={ isLoading }
            color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
            fontSize="11px"
            fontWeight={ 400 }
            fontFamily="system-ui, -apple-system, sans-serif"
            flexShrink={ 0 }
          />
        </Flex>

        { /* Badges Row */ }
        <HStack flexWrap="wrap" gap={ 1.5 }>
          <TxType types={ tx.transaction_types } isLoading={ isLoading }/>
          <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
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
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="0.02em"
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
                  fontFamily="system-ui, -apple-system, sans-serif"
                  letterSpacing="0.02em"
                >
                  { inferenceInfo.mode }
                </Badge>
              ) }
            </>
          ) }
          <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
        </HStack>

        { /* Addresses Section */ }
        <Box>
          <Text
            fontSize="10px"
            fontWeight={ 500 }
            letterSpacing="0.08em"
            textTransform="uppercase"
            color={{ _light: 'rgba(0, 0, 0, 0.35)', _dark: 'rgba(255, 255, 255, 0.35)' }}
            fontFamily="system-ui, -apple-system, sans-serif"
            mb={ 1.5 }
          >
            Addresses
          </Text>
          <Box
            fontSize="12px"
            fontFamily="system-ui, -apple-system, sans-serif"
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

        { /* Inference Details */ }
        { hasInference && (
          <Box>
            <Text
              fontSize="10px"
              fontWeight={ 500 }
              letterSpacing="0.08em"
              textTransform="uppercase"
              color={{ _light: 'rgba(0, 0, 0, 0.35)', _dark: 'rgba(255, 255, 255, 0.35)' }}
              fontFamily="system-ui, -apple-system, sans-serif"
              mb={ 1.5 }
            >
              AI Inference
            </Text>
            { !inferenceInfo && (
              <Text
                fontSize="11px"
                color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                —
              </Text>
            ) }
            { inferenceInfo && inferenceInfo.isLoading && (
              <Text
                fontSize="11px"
                color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                Loading...
              </Text>
            ) }
            { inferenceInfo && !inferenceInfo.isLoading && inferenceInfo.modelCID && (
              <Skeleton loading={ isLoading }>
                <Text
                  fontSize="11px"
                  color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  lineClamp={ 1 }
                >
                  Model:{ ' ' }
                  <Link
                    href={ `https://walruscan.com/mainnet/blob/${ inferenceInfo.modelCID }` }
                    external
                    fontSize="11px"
                    fontWeight={ 500 }
                    fontFamily="mono"
                    color={{ _light: 'rgba(0, 0, 0, 0.7)', _dark: 'rgba(255, 255, 255, 0.7)' }}
                    _hover={{
                      textDecoration: 'underline',
                      color: { _light: 'rgba(0, 0, 0, 0.9)', _dark: 'rgba(255, 255, 255, 0.9)' },
                    }}
                  >
                    { inferenceInfo.modelCID.slice(0, 8) }...
                  </Link>
                </Text>
              </Skeleton>
            ) }
          </Box>
        ) }
      </VStack>
    </LinkBox>
  );
};

export default React.memo(LatestTxsItemMobile);
