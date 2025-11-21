import {
  Box,
  Flex,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { SUPPORTED_INFERENCE_ADDRESSES } from 'lib/inferences/address';
import { Badge } from 'toolkit/chakra/badge';
import { Link } from 'toolkit/chakra/link';
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
  const hasInference = tx.to?.hash === SUPPORTED_INFERENCE_ADDRESSES.InferenceHub;
  const inferenceInfo = useInferenceType(tx, isLoading || false);

  return (
    <Box
      width="100%"
      py={{ base: 3, lg: 4 }}
      px={{ base: 3, lg: 4 }}
      transition="opacity 0.2s ease"
      _hover={{
        opacity: 0.7,
      }}
      display={{ base: 'block', lg: 'none' }}
    >
      <Flex
        alignItems="center"
        width="100%"
        justifyContent="space-between"
        mb={ 3 }
        gap={ 2 }
      >
        <Flex alignItems="center" gap={ 2 } flexWrap="wrap">
          <Text color="text.secondary" fontSize="xs" fontWeight="500">Txn</Text>
          <TxEntity
            isLoading={ isLoading }
            hash={ tx.hash }
            fontWeight="600"
            textStyle="xs"
            truncation="dynamic"
            tailLength={ 8 }
            noIcon
          />
        </Flex>
        <TimeAgoWithTooltip
          timestamp={ tx.timestamp }
          enableIncrement
          isLoading={ isLoading }
          color="text.secondary"
          textStyle="xs"
          flexShrink={ 0 }
        />
      </Flex>
      <HStack flexWrap="wrap" gap={ 1.5 } mb={ 2.5 }>
        <TxType types={ tx.transaction_types } isLoading={ isLoading }/>
        <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
        { hasInference && (
          <>
            <Badge colorPalette="purple" loading={ isLoading } textStyle="xs" px={ 1.5 } py={ 0.5 } minH="5">
              { inferenceInfo?.type || 'AI Inference' }
            </Badge>
            { inferenceInfo?.mode && inferenceInfo.mode !== 'UNKNOWN' && (
              <Badge colorPalette="blue" loading={ isLoading } textStyle="xs" px={ 1.5 } py={ 0.5 } minH="5">
                { inferenceInfo.mode }
              </Badge>
            ) }
          </>
        ) }
        <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
      </HStack>
      <Box textStyle="xs" mb={ 2.5 }>
        <AddressFromTo
          from={ tx.from }
          to={ dataTo }
          isLoading={ isLoading }
          noCopy
          noIcon
        />
      </Box>
      { hasInference && inferenceInfo && (
        <VStack align="flex-start" gap={ 1 }>
          { inferenceInfo.modelCID && (
            <Skeleton loading={ isLoading }>
              <Text fontSize="xs" color="text.secondary" lineClamp={ 1 }>
                Model:{ ' ' }
                <Link
                  href={ `https://walruscan.com/mainnet/blob/${ inferenceInfo.modelCID }` }
                  external
                  fontSize="xs"
                  fontWeight={ 500 }
                  fontFamily="mono"
                  color="link.default"
                  _hover={{ textDecoration: 'underline' }}
                >
                  { inferenceInfo.modelCID.slice(0, 8) }...
                </Link>
              </Text>
            </Skeleton>
          ) }
        </VStack>
      ) }
    </Box>
  );
};

export default React.memo(LatestTxsItemMobile);
