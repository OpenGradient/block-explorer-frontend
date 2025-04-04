import { Box } from '@chakra-ui/react';
import { isNotNil } from 'es-toolkit';
import React from 'react';

import { apos } from 'lib/html-entities';
import type { SchedulerTask } from 'lib/opengradient/contracts/scheduler';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';

import WorkflowsListItem from './WorkflowsListItem';
import WorkflowsTable from './WorkflowsTable';

interface Props {
  // onSortChange: () => void;
  // sort: TokensSortingValue | undefined;
  actionBar?: React.ReactNode;
  hasActiveFilters: boolean;
  description?: React.ReactNode;

  data: Array<SchedulerTask> | undefined;
  isLoading: boolean;
  error: Error | null;

  tableTop?: number;
}

const WorkflowsList = ({ description, hasActiveFilters, actionBar, data, isLoading, error, tableTop }: Props) => {
  const isError = isNotNil(error);

  if (isError) {
    return <DataFetchAlert/>;
  }

  const content = data ? (
    <>
      <Box hideFrom="lg">
        { description }
        { data.map((item, index) => (
          <WorkflowsListItem
            key={ index }
            task={ item }
            isLoading={ isLoading }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        { description }
        <WorkflowsTable
          items={ data }
          isLoading={ isLoading }
          top={ tableTop }
          // setSorting={ onSortChange }
          // sorting={ sort }
        />
      </Box>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ data?.length }
      emptyText="There are no workflows."
      filterProps={{
        emptyFilteredText: `Couldn${ apos }t find a workflow that matches your filter query.`,
        hasActiveFilters,
      }}
      actionBar={ hasActiveFilters ? actionBar : null }
    >
      { content }
    </DataListDisplay>
  );
};

export default WorkflowsList;
