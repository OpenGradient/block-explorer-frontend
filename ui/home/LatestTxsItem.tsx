import {
  Box,
  Flex,
  HStack,
  Text,
} from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { SUPPORTED_INFERENCE_ADDRESSES } from 'lib/inferences/address';
import { Badge } from 'toolkit/chakra/badge';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';
import TxWatchListTags from 'ui/shared/tx/TxWatchListTags';
import TxType from 'ui/txs/TxType';

type Props = {
  tx: Transaction;
  isLoading?: boolean;
};

const LatestTxsItem = ({ tx, isLoading }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;
  const hasInference = tx.to?.hash === SUPPORTED_INFERENCE_ADDRESSES.InferenceHub;

  return (
    <Box
      py={ 5 }
      px={{ base: 4, lg: 6 }}
      width="100%"
      transition="all 0.15s ease"
      _hover={{
        bg: { _light: 'rgba(0, 0, 0, 0.02)', _dark: 'rgba(255, 255, 255, 0.03)' },
      }}
      display={{ base: 'none', lg: 'block' }}
    >
      <Flex gap={ 4 } alignItems="flex-start" flexWrap="wrap">
        <Flex flex={ 1 } minW="0" overflow="hidden" gap={ 2.5 }>
          <Box flex={ 1 } minW="0">
            <Flex alignItems="center" gap={ 2 } flexWrap="wrap" mb={ 1.5 }>
              <Text color="text.secondary" fontSize="xs" fontWeight="500">Txn</Text>
              <TxEntity
                isLoading={ isLoading }
                hash={ tx.hash }
                fontWeight="600"
                textStyle="xs"
                noIcon
              />
              <TimeAgoWithTooltip
                timestamp={ tx.timestamp }
                enableIncrement
                isLoading={ isLoading }
                color="text.secondary"
                textStyle="xs"
                flexShrink={ 0 }
              />
            </Flex>
            <HStack flexWrap="wrap" gap={ 1.5 }>
              <TxType types={ tx.transaction_types } isLoading={ isLoading }/>
              <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
              { hasInference && (
                <Badge colorPalette="purple" loading={ isLoading } textStyle="xs" px={ 1.5 } py={ 0.5 } minH="5">
                  Inference
                </Badge>
              ) }
              <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
            </HStack>
          </Box>
        </Flex>
        <Box flexShrink={ 0 } minW="0" flex="0 0 auto" textStyle="xs">
          <AddressFromTo
            from={ tx.from }
            to={ dataTo }
            isLoading={ isLoading }
            mode="compact"
            noCopy
            noIcon
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default React.memo(LatestTxsItem);
