import { Box } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { INTERNAL_TX } from 'stubs/internalTx';
import { generateListStub } from 'stubs/utils';
import InternalTxsList from 'ui/internalTxs/InternalTxsList';
import InternalTxsTable from 'ui/internalTxs/InternalTxsTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import ExplorerPageSurface from 'ui/shared/Page/ExplorerPageSurface';
import ExplorerPageTitle from 'ui/shared/Page/ExplorerPageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const InternalTxs = () => {
  const isMobile = useIsMobile();

  const { isError, isPlaceholderData, data, pagination } = useQueryWithPages({
    resourceName: 'internal_txs',
    options: {
      placeholderData: generateListStub<'internal_txs'>(
        INTERNAL_TX,
        50,
        {
          next_page_params: {
            items_count: 50,
            block_number: 1,
            index: 1,
            transaction_hash: '0x123',
            transaction_index: 1,
          },
        },
      ),
    },
  });

  const actionBar = (!isMobile || pagination.isVisible) ? (
    <ActionBar>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        <InternalTxsList data={ data.items } isLoading={ isPlaceholderData }/>
      </Box>
      <Box hideBelow="lg">
        <InternalTxsTable data={ data.items } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  return (
    <>
      <ExplorerPageTitle
        eyebrow="Execution traces"
        title="Internal transactions"
        description="Contract-level calls and value movement generated inside indexed transactions."
        withTextAd
      />
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no internal transactions."
        actionBar={ actionBar }
      >
        { content && (
          <ExplorerPageSurface overflowX="auto">
            { content }
          </ExplorerPageSurface>
        ) }
      </DataListDisplay>
    </>
  );
};

export default InternalTxs;
