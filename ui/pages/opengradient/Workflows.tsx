import { Box, Flex, Grid, Text } from '@chakra-ui/react';
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
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';
import StatsWidget from 'ui/shared/stats/StatsWidget';

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
  const [ showExpired, setShowExpired ] = React.useState<boolean>(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredTasks = React.useMemo(() => {
    const now = BigInt(Math.floor(Date.now() / 1000));
    let tasks = query.data ?? [];

    // Filter by search term
    tasks = tasks.filter((t) => t.user.includes(debouncedSearchTerm) || t.contractAddress.includes(debouncedSearchTerm));

    // Filter expired schedules unless toggle is on
    if (!showExpired) {
      tasks = tasks.filter((t) => t.endTime > now);
    }

    // Sort by endTime in descending order
    tasks = [ ...tasks ].sort((a, b) => {
      if (a.endTime > b.endTime) return -1;
      if (a.endTime < b.endTime) return 1;
      return 0;
    });

    return tasks;
  }, [ query.data, debouncedSearchTerm, showExpired ]);

  // Calculate stats for hero section
  const stats = React.useMemo(() => {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const allTasks = query.data ?? [];
    const activeTasks = allTasks.filter((t) => t.endTime > now);
    const expiredTasks = allTasks.filter((t) => t.endTime <= now);

    // Calculate total runs (estimate based on frequency and time remaining)
    const totalRuns = allTasks.reduce((sum, task) => {
      if (task.endTime <= now) return sum;
      const timeRemaining = Number(task.endTime - now);
      const frequency = Number(task.frequency);
      if (frequency > 0) {
        return sum + Math.floor(timeRemaining / frequency);
      }
      return sum;
    }, 0);

    return {
      total: allTasks.length,
      active: activeTasks.length,
      expired: expiredTasks.length,
      totalRuns,
    };
  }, [ query.data ]);

  const handleSearchTermChange = React.useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const hasMultipleTabs = false;

  const handleShowExpiredChange = React.useCallback((value: boolean) => {
    setShowExpired(value);
  }, []);

  const actionBar = (
    <WorkflowsActionBar
      key={ tab }
      // filter={ filter }
      searchTerm={ searchTerm }
      onSearchChange={ handleSearchTermChange }
      showExpired={ showExpired }
      onShowExpiredChange={ handleShowExpiredChange }
      // sort={ sort }
      // onSortChange={ handleSortChange }
      inTabsSlot={ !isMobile && hasMultipleTabs }
    />
  );

  const description = (
    <Box
      mb={ 6 }
      p={{ base: 4, lg: 6 }}
      borderRadius="lg"
      bg={{ _light: 'rgba(255, 255, 255, 0.5)', _dark: 'rgba(255, 255, 255, 0.03)' }}
      border="1px solid"
      borderColor={{ _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(255, 255, 255, 0.08)' }}
    >
      <Flex
        gap={ 3 }
        alignItems="flex-start"
        flexDirection={{ base: 'column', lg: 'row' }}
      >
        <Box
          p={ 2.5 }
          bg={{ _light: 'rgba(81, 120, 199, 0.1)', _dark: 'rgba(66, 153, 225, 0.15)' }}
          borderRadius="md"
          flexShrink={ 0 }
        >
          <IconSvg
            name="apps"
            boxSize={ 6 }
            color={{ _light: 'blue.600', _dark: 'blue.400' }}
          />
        </Box>
        <Box flex={ 1 }>
          <Text
            fontSize={{ base: 'md', lg: 'lg' }}
            fontWeight={ 600 }
            mb={ 2 }
            color={{ _light: 'rgba(0, 0, 0, 0.9)', _dark: 'rgba(255, 255, 255, 0.95)' }}
          >
            Automated AI Workflows
          </Text>
          <Text
            fontSize={{ base: 'sm', lg: 'md' }}
            lineHeight="1.6"
            color={{ _light: 'rgba(0, 0, 0, 0.6)', _dark: 'rgba(255, 255, 255, 0.7)' }}
          >
            Manage and monitor your scheduled AI model executions. Each workflow runs automatically at specified intervals,
            executing your models and storing results on-chain. Track execution history, model performance, and workflow status
            in real-time.
          </Text>
        </Box>
      </Flex>
    </Box>
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
          description={ description }
        />
      ),
    },
  ].filter(Boolean);

  return (
    <>
      <PageTitle
        title="AI Workflows"
        withTextAd
      />

      { /* Hero Stats Section */ }
      <Box
        position="relative"
        mb={ 8 }
        p={{ base: 4, lg: 6 }}
        borderRadius="xl"
        bgGradient={{
          _light: 'linear-gradient(135deg, rgba(81, 120, 199, 0.08) 0%, rgba(107, 143, 212, 0.12) 50%, rgba(81, 120, 199, 0.08) 100%)',
          _dark: 'linear-gradient(135deg, rgba(81, 120, 199, 0.15) 0%, rgba(107, 143, 212, 0.2) 50%, rgba(81, 120, 199, 0.15) 100%)',
        }}
        border="1px solid"
        borderColor={{ _light: 'rgba(102, 126, 234, 0.2)', _dark: 'rgba(255, 255, 255, 0.1)' }}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(81, 120, 199, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(81, 120, 199, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
          borderRadius: 'xl',
        }}
      >
        <Flex
          position="relative"
          flexDirection="column"
          gap={ 4 }
        >
          <Box mb={ 2 }>
            <Text
              fontSize={{ base: 'sm', lg: 'md' }}
              fontWeight={ 600 }
              color={{ _light: 'rgba(0, 0, 0, 0.7)', _dark: 'rgba(255, 255, 255, 0.8)' }}
              letterSpacing="0.02em"
              mb={ 1 }
            >
              Platform Overview
            </Text>
            <Text
              fontSize={{ base: 'xs', lg: 'sm' }}
              color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
            >
              Real-time insights into AI workflow execution
            </Text>
          </Box>

          <Grid
            gridTemplateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
            gridGap={ 4 }
          >
            <StatsWidget
              label="Total Workflows"
              value={ stats.total.toLocaleString() }
              icon="apps"
              isLoading={ query.isPlaceholderData }
              hint="All registered AI workflows on the platform"
            />
            <StatsWidget
              label="Active Workflows"
              value={ stats.active.toLocaleString() }
              icon="check"
              isLoading={ query.isPlaceholderData }
              hint="Currently running workflows"
            />
            <StatsWidget
              label="Expired Workflows"
              value={ stats.expired.toLocaleString() }
              icon="clock"
              isLoading={ query.isPlaceholderData }
              hint="Workflows that have completed"
            />
            <StatsWidget
              label="Scheduled Runs"
              value={ (() => {
                if (stats.totalRuns >= 1000000) {
                  return `${ (stats.totalRuns / 1000000).toFixed(1) }M`;
                }
                if (stats.totalRuns >= 1000) {
                  return `${ (stats.totalRuns / 1000).toFixed(1) }K`;
                }
                return stats.totalRuns.toLocaleString();
              })() }
              icon="repeat"
              isLoading={ query.isPlaceholderData }
              hint="Total scheduled executions across all workflows"
            />
          </Grid>
        </Flex>
      </Box>

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
