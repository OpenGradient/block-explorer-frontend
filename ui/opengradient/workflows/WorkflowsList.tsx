import { Hide, Show } from '@chakra-ui/react';
import { isNotNil } from 'es-toolkit';
import React from 'react';

import type { TokensSortingValue } from 'types/api/tokens';

import { apos } from 'lib/html-entities';
import type { SchedulerTask } from 'lib/opengradient/contracts/scheduler';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import WorkflowsListItem from './WorkflowsListItem';
import WorkflowsTable from './WorkflowsTable';

interface Props {
  query: QueryWithPagesResult<'tokens'> | QueryWithPagesResult<'tokens_bridged'>;
  onSortChange: () => void;
  sort: TokensSortingValue | undefined;
  actionBar?: React.ReactNode;
  hasActiveFilters: boolean;
  description?: React.ReactNode;
  tableTop?: number;

  data: Array<SchedulerTask> | undefined;
  isLoading: boolean;
  error: Error | null;
}

const WorkflowsList = ({ query, onSortChange, sort, actionBar, description, hasActiveFilters, data, isLoading, error }: Props) => {
  const isError = isNotNil(error);

  if (isError) {
    return <DataFetchAlert/>;
  }

  const content = data ? (
    <>
      <Show below="lg" ssr={ false }>
        { description }
        { data.map((item, index) => (
          <WorkflowsListItem
            key={ index }
            task={ item }
            isLoading={ isLoading }
          />
        )) }
      </Show>
      <Hide below="lg" ssr={ false }>
        { description }
        <WorkflowsTable
          items={ data }
          isLoading={ isLoading }
          setSorting={ onSortChange }
          sorting={ sort }
        />
      </Hide>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      items={ data }
      emptyText="There are no workflows."
      filterProps={{
        emptyFilteredText: `Couldn${ apos }t find token that matches your filter query.`,
        hasActiveFilters,
      }}
      content={ content }
      actionBar={ query.pagination.isVisible || hasActiveFilters ? actionBar : null }
    />
  );
};

export default WorkflowsList;
