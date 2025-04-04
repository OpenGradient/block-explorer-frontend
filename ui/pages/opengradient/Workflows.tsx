import { useQuery } from '@tanstack/react-query';
import { range } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import useDebounce from 'lib/hooks/useDebounce';
import useIsMobile from 'lib/hooks/useIsMobile';
import type { SchedulerTask } from 'lib/opengradient/contracts/scheduler';
import { getAllTasks } from 'lib/opengradient/contracts/scheduler';
import getQueryParamString from 'lib/router/getQueryParamString';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import WorkflowsActionBar from 'ui/opengradient/workflows/WorkflowsActionBar';
import WorkflowsList from 'ui/opengradient/workflows/WorkflowsList';
import PageTitle from 'ui/shared/Page/PageTitle';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 6,
  marginTop: -5,
  alignItems: 'center',
};
const TABS_HEIGHT = 88;

const TABS_RIGHT_SLOT_PROPS = {
  ml: 8,
  flexGrow: 1,
};

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

  const hasMultipleTabs = false;

  const actionBar = (
    <WorkflowsActionBar
      key={ tab }
      // filter={ filter }
      searchTerm={ searchTerm }
      onSearchChange={ handleSearchTermChange }
      // sort={ sort }
      // onSortChange={ handleSortChange }
      inTabsSlot={ !isMobile && hasMultipleTabs }
    />
  );

  const tabs: Array<TabItemRegular> = [
    {
      id: 'all',
      title: 'All',
      component: (
        <WorkflowsList
          hasActiveFilters={ Boolean(searchTerm) }
          data={ filteredTasks }
          isLoading={ query.isPlaceholderData }
          error={ query.error }
          actionBar={ isMobile ? actionBar : null }
          tableTop={ hasMultipleTabs ? TABS_HEIGHT : undefined }
        />
      ),
    },
  ].filter(Boolean);

  return (
    <>
      <PageTitle
        title="Workflows"
        withTextAd
      />
      { actionBar }
      <RoutedTabs
        tabs={ tabs }
        listProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={ hasMultipleTabs && !isMobile ? actionBar : null }
        rightSlotProps={ !isMobile ? TABS_RIGHT_SLOT_PROPS : undefined }
        stickyEnabled={ !isMobile }
        // onTabChange={ handleTabChange }
      />
    </>
  );
};

export default Workflows;
