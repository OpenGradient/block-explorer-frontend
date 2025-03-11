import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { SchedulerTask } from 'lib/opengradient/contracts/scheduler';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import { default as Thead } from 'ui/shared/TheadSticky';

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
    <Table>
      <Thead top={ top ?? ACTION_BAR_HEIGHT_DESKTOP }>
        <Tr>
          <Th>Workflow Address</Th>
          <Th>Latest Result</Th>
          <Th>Creator Address</Th>
          <Th w="10%">Frequency</Th>
          <Th>End Time</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <WorkflowsTableItem key={ index } task={ item } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default WorkflowsTable;
