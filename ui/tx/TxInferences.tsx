import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import type { Log } from 'types/api/log';

import { LOG } from 'stubs/log';
import { generateListStub } from 'stubs/utils';
import InferenceItem from 'ui/inferences/InferenceItem';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';

import type { TxQuery } from './useTxQuery';

interface Props {
  txQuery: TxQuery;
  logsFilter?: (log: Log) => boolean;
}

const TxInferences = ({ txQuery, logsFilter }: Props) => {
  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'tx_logs',
    pathParams: { hash: txQuery.data?.hash },
    options: {
      enabled: !txQuery.isPlaceholderData && Boolean(txQuery.data?.hash) && Boolean(txQuery.data?.status),
      placeholderData: generateListStub<'tx_logs'>(LOG, 3, { next_page_params: null }),
    },
  });

  if (!txQuery.isPending && !txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  if (isError || txQuery.isError) {
    return <DataFetchAlert/>;
  }

  let items: Array<Log> = [];

  if (data?.items) {
    if (isPlaceholderData) {
      items = data?.items;
    } else {
      items = logsFilter ? data.items.filter(logsFilter) : data.items;
    }
  }

  if (!items.length) {
    return <Text as="span">There are no inferences for this transaction.</Text>;
  }

  return (
    <Box>
      { pagination.isVisible && (
        <ActionBar mt={ -6 }>
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
      { items.map((item, index) => (
        <InferenceItem
          key={ index }
          { ...item }
          type="transaction"
          isLoading={ isPlaceholderData }
        />
      )) }
    </Box>
  );
};

export default TxInferences;
