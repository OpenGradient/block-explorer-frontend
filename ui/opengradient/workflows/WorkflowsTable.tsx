import React from 'react';

import type { SchedulerTask } from 'lib/opengradient/contracts/scheduler';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';

import WorkflowsTableItem from './WorkflowsTableItem';

// const SORT_SEQUENCE: Record<TokensSortingField, Array<TokensSortingValue | undefined>> = {
//   fiat_value: [ 'fiat_value-desc', 'fiat_value-asc', undefined ],
//   holder_count: [ 'holder_count-desc', 'holder_count-asc', undefined ],
//   circulating_market_cap: [ 'circulating_market_cap-desc', 'circulating_market_cap-asc', undefined ],
// };

// const getNextSortValue = (getNextSortValueShared<TokensSortingField, TokensSortingValue>).bind(undefined, SORT_SEQUENCE);

type Props = {
  items: Array<SchedulerTask>;
  // sorting?: TokensSortingValue;
  // setSorting: (val?: TokensSortingValue) => void;
  isLoading?: boolean;
  top?: number;
};

/** Taken from TokensTable. */
const WorkflowsTable = ({ items, isLoading, top }: Props) => {
  return (
    <TableRoot>
      <TableHeaderSticky top={ top ?? ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
          <TableColumnHeader>Workflow Address</TableColumnHeader>
          <TableColumnHeader>Latest Result</TableColumnHeader>
          <TableColumnHeader>Creator Address</TableColumnHeader>
          <TableColumnHeader>Model CID</TableColumnHeader>
          <TableColumnHeader w="10%">Frequency</TableColumnHeader>
          <TableColumnHeader>End Time</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <WorkflowsTableItem key={ index } task={ item } isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default WorkflowsTable;
