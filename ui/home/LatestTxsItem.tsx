import {
  Box,
  Flex,
  Grid,
  GridItem,
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

const LatestTxsItem = ({ tx, isLoading }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;
  const hasInference = tx.to?.hash === SUPPORTED_INFERENCE_ADDRESSES.InferenceHub;
  const inferenceInfo = useInferenceType(tx, isLoading || false);
  const txUrl = route({ pathname: '/tx/[hash]', query: { hash: tx.hash } });

  return (
    <LinkBox
      py={{ base: 4, lg: 5 }}
      px={{ base: 4, lg: 6 }}
      width="100%"
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      position="relative"
      _hover={{
        bg: { _light: 'rgba(0, 0, 0, 0.02)', _dark: 'rgba(64, 209, 219, 0.05)' },
      }}
      display={{ base: 'none', lg: 'block' }}
    >
      <LinkOverlay href={ txUrl } noIcon/>
      <Grid
        templateColumns={{ base: '1fr', lg: '2.5fr 1.8fr 1.5fr' }}
        gap={ 6 }
        alignItems="flex-start"
      >
        { /* Transaction Hash & Metadata Column */ }
        <GridItem>
          <VStack align="flex-start" gap={ 3 }>
            { /* Hash Row */ }
            <Flex
              alignItems="center"
              gap={ 3 }
              flexWrap="wrap"
              width="100%"
            >
              <TxEntity
                isLoading={ isLoading }
                hash={ tx.hash }
                fontWeight={ 500 }
                fontSize="sm"
                fontFamily="system-ui, -apple-system, sans-serif"
                color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                noIcon
                truncation="constant_long"
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
              <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
            </HStack>
          </VStack>
        </GridItem>

        { /* Address Column - Premium Styling */ }
        <GridItem>
          <VStack align="flex-start" gap={ 1 }>
            <Text
              fontSize="10px"
              fontWeight={ 500 }
              letterSpacing="0.08em"
              textTransform="uppercase"
              color={{ _light: 'rgba(0, 0, 0, 0.35)', _dark: 'rgba(255, 255, 255, 0.35)' }}
              fontFamily="system-ui, -apple-system, sans-serif"
              mb={ 0.5 }
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
                mode="compact"
                noCopy
                noIcon
              />
            </Box>
          </VStack>
        </GridItem>

        { /* Inference Column - Premium Styling */ }
        <GridItem>
          { hasInference ? (
            <VStack align="flex-start" gap={ 2 }>
              <Text
                fontSize="10px"
                fontWeight={ 500 }
                letterSpacing="0.08em"
                textTransform="uppercase"
                color={{ _light: 'rgba(0, 0, 0, 0.35)', _dark: 'rgba(255, 255, 255, 0.35)' }}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                Inference
              </Text>
              { inferenceInfo ? (
                <>
                  <HStack flexWrap="wrap" gap={ 1.5 }>
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
                      { inferenceInfo.type || 'AI Inference' }
                    </Badge>
                  </HStack>
                  { inferenceInfo.modelCID && (
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
                </>
              ) : (
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
                  Inference
                </Badge>
              ) }
            </VStack>
          ) : (
            <VStack align="flex-start" gap={ 1 }>
              <Text
                fontSize="10px"
                fontWeight={ 500 }
                letterSpacing="0.08em"
                textTransform="uppercase"
                color={{ _light: 'rgba(0, 0, 0, 0.35)', _dark: 'rgba(255, 255, 255, 0.35)' }}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                Inference
              </Text>
              <Text
                fontSize="12px"
                color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                No inference
              </Text>
            </VStack>
          ) }
        </GridItem>
      </Grid>
    </LinkBox>
  );
};

export default React.memo(LatestTxsItem);
