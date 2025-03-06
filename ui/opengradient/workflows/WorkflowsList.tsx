import { Hide, Show } from '@chakra-ui/react';
import React from 'react';

import type { TokensSortingValue } from 'types/api/tokens';

import { apos } from 'lib/html-entities';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import { SchedulerTask } from 'lib/opengradient/contracts/scheduler';
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

const WorkflowsList = ({ query, onSortChange, sort, actionBar, description, hasActiveFilters, tableTop }: Props) => {

  const { isError, isPlaceholderData, data, pagination } = query;

  if (isError) {
    return <DataFetchAlert/>;
  }

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        { description }
        this is a mobile view
        { data.items.map((item, index) => (
          <WorkflowsListItem
            key={ item.address + (isPlaceholderData ? index : '') }
            token={ item }
            index={ index }
            page={ pagination.page }
            isLoading={ isPlaceholderData }
          />
        )) }
      </Show>
      <Hide below="lg" ssr={ false }>
        this is a desktop view
        { description }
        <WorkflowsTable
          items={ data.items }
          page={ pagination.page }
          isLoading={ isPlaceholderData }
          setSorting={ onSortChange }
          sorting={ sort }
          top={ tableTop }
        />
      </Hide>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      items={ data?.items }
      emptyText="There are no tokens."
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
