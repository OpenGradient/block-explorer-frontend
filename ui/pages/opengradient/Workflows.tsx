import { useQuery } from '@tanstack/react-query';
import { range } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';

import useDebounce from 'lib/hooks/useDebounce';
import useIsMobile from 'lib/hooks/useIsMobile';
import type { SchedulerTask } from 'lib/opengradient/contracts/scheduler';
import { getAllTasks } from 'lib/opengradient/contracts/scheduler';
import getQueryParamString from 'lib/router/getQueryParamString';
import WorkflowsActionBar from 'ui/opengradient/workflows/WorkflowsActionBar';
import WorkflowsList from 'ui/opengradient/workflows/WorkflowsList';
import PageTitle from 'ui/shared/Page/PageTitle';

const generateFakeTasks = () => (
  range(10).map(() => ({
    user: '0xaddress',
    contractAddress: '0xaddress',
    endTime: BigInt(0),
    frequency: BigInt(0),
  })) satisfies Array<SchedulerTask>
);

const Workflows = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const tab = getQueryParamString(router.query.tab);
  const q = getQueryParamString(router.query.q);

  const placeholderData = React.useMemo(() => generateFakeTasks(), []);
  const query = useQuery({
    queryKey: [ 'opengradient', 'getAllTasks' ],
    queryFn: getAllTasks,
    placeholderData,
  });

  const [ searchTerm, setSearchTerm ] = React.useState<string>(q ?? '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredTasks = React.useMemo(() => {
    return (query.data ?? []).filter((t) => t.user.includes(debouncedSearchTerm) || t.contractAddress.includes(debouncedSearchTerm));
  }, [ query.data, debouncedSearchTerm ]);

  const handleSearchTermChange = React.useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const actionBar = (
    <WorkflowsActionBar
      key={ tab }
      // filter={ filter }
      searchTerm={ searchTerm }
      onSearchChange={ handleSearchTermChange }
      // sort={ sort }
      // onSortChange={ handleSortChange }
      inTabsSlot={ !isMobile }
    />
  );

  return (
    <>
      <PageTitle
        title="Workflows"
        withTextAd
      />
      { actionBar }
      <WorkflowsList
        // sort={ sort }
        // onSortChange={ handleSortChange }
        // actionBar={ isMobile ? actionBar : null }
        hasActiveFilters={ Boolean(searchTerm) }
        data={ filteredTasks }
        isLoading={ query.isPlaceholderData }
        error={ query.error }
      />
    </>
  );
};

export default Workflows;
