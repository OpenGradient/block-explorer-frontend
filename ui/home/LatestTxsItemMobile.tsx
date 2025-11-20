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
      width="100%"
      py={ 5 }
      px={{ base: 4, lg: 6 }}
      transition="all 0.15s ease"
      _hover={{
        bg: { _light: 'rgba(0, 0, 0, 0.02)', _dark: 'rgba(255, 255, 255, 0.03)' },
      }}
      display={{ base: 'block', lg: 'none' }}
    >
      <Flex justifyContent="space-between" mb={ 2 }>
        <HStack flexWrap="wrap" gap={ 1.5 }>
          <TxType types={ tx.transaction_types } isLoading={ isLoading }/>
          <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
          <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
        </HStack>
      </Flex>
      <Flex
        alignItems="center"
        width="100%"
        justifyContent="space-between"
        mb={ 2.5 }
        gap={ 2 }
      >
        <TxEntity
          isLoading={ isLoading }
          hash={ tx.hash }
          fontWeight="600"
          textStyle="xs"
          truncation="constant_long"
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
      <AddressFromTo
        from={ tx.from }
        to={ dataTo }
        isLoading={ isLoading }
        textStyle="xs"
        fontWeight="500"
      />
    </Box>
  );
};

export default React.memo(LatestTxsItem);
