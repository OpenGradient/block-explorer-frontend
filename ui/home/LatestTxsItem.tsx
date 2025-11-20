import {
  Box,
  Flex,
  HStack,
} from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

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
            <HStack flexWrap="wrap" mb={ 1.5 } gap={ 1.5 }>
              <TxType types={ tx.transaction_types } isLoading={ isLoading }/>
              <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
              <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
            </HStack>
            <Flex alignItems="center" gap={ 2 } flexWrap="wrap">
              <TxEntity
                isLoading={ isLoading }
                hash={ tx.hash }
                fontWeight="600"
                textStyle="xs"
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
          </Box>
        </Flex>
        <Box flexShrink={ 0 } minW="0" flex="0 0 auto">
          <AddressFromTo
            from={ tx.from }
            to={ dataTo }
            isLoading={ isLoading }
            mode="compact"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default React.memo(LatestTxsItem);
