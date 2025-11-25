import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react';
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
import { LinkBox } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import WorkflowsActionBar from 'ui/opengradient/workflows/WorkflowsActionBar';
import WorkflowsList from 'ui/opengradient/workflows/WorkflowsList';
import IconSvg from 'ui/shared/IconSvg';
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
      p={{ base: 4, lg: 5 }}
      bg={{ _light: 'rgba(0, 0, 0, 0.01)', _dark: 'rgba(255, 255, 255, 0.01)' }}
      borderTop="1px solid"
      borderBottom="1px solid"
      borderColor={{ _light: 'rgba(0, 0, 0, 0.04)', _dark: 'rgba(255, 255, 255, 0.04)' }}
    >
      <Flex
        gap={ 3 }
        alignItems="flex-start"
        flexDirection={{ base: 'column', lg: 'row' }}
      >
        <Box
          p={ 2 }
          bg={{ _light: 'rgba(0, 0, 0, 0.02)', _dark: 'rgba(255, 255, 255, 0.02)' }}
          flexShrink={ 0 }
        >
          <IconSvg
            name="opengradient/workflow"
            boxSize={ 5 }
            color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
          />
        </Box>
        <Box flex={ 1 }>
          <Text
            fontSize={{ base: 'sm', lg: 'md' }}
            fontWeight={ 500 }
            mb={ 1.5 }
            color={{ _light: 'rgba(0, 0, 0, 0.7)', _dark: 'rgba(255, 255, 255, 0.7)' }}
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            Automated AI Workflows
          </Text>
          <Text
            fontSize={{ base: '12px', md: '13px' }}
            lineHeight="1.6"
            color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
            fontFamily="system-ui, -apple-system, sans-serif"
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
          tableTop={ hasMultipleTabs ? TABS_HEIGHT : undefined }
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
        w="100%"
        overflow="hidden"
      >
        <VStack
          align="stretch"
          gap={ 0 }
        >
          { /* Section Header */ }
          <Flex
            alignItems="center"
            gap={ 2 }
            mb={ 6 }
          >
            <Box
              position="relative"
              w="6px"
              h="6px"
              borderRadius="50%"
              bg="green.500"
              boxShadow="0 0 6px rgba(34, 197, 94, 0.6)"
              _dark={{
                boxShadow: '0 0 8px rgba(34, 197, 94, 0.8)',
              }}
              animation="pulseOpacity 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            />
            <Text
              fontSize="11px"
              fontWeight={ 500 }
              letterSpacing="0.1em"
              textTransform="uppercase"
              color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              Platform Overview
            </Text>
          </Flex>

          { /* Metrics Grid */ }
          <Grid
            templateColumns={{ base: '1fr 1fr', lg: 'repeat(4, 1fr)' }}
            gap={ 0 }
            overflow="hidden"
          >
            { /* Total Workflows */ }
            <LinkBox
              p={ 5 }
              position="relative"
              bgGradient={{
                _light: 'linear-gradient(135deg, rgba(30, 58, 138, 0.04) 0%, rgba(51, 65, 85, 0.05) 100%)',
                _dark: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(51, 65, 85, 0.1) 100%)',
              }}
              transition="all 0.2s ease"
              _hover={{
                bgGradient: {
                  _light: 'linear-gradient(135deg, rgba(30, 58, 138, 0.06) 0%, rgba(51, 65, 85, 0.08) 100%)',
                  _dark: 'linear-gradient(135deg, rgba(30, 58, 138, 0.12) 0%, rgba(51, 65, 85, 0.15) 100%)',
                },
              }}
            >
              <Flex
                alignItems="center"
                gap={ 1.5 }
                mb={ 2 }
              >
                <Text
                  fontSize="10px"
                  fontWeight={ 600 }
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={{ _light: 'rgba(30, 58, 138, 0.7)', _dark: 'rgba(51, 65, 85, 0.8)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  Total Workflows
                </Text>
                <IconSvg
                  name="apps"
                  boxSize={ 3 }
                  color={{ _light: 'rgba(30, 58, 138, 0.75)', _dark: 'rgba(51, 65, 85, 0.85)' }}
                />
              </Flex>
              <Skeleton loading={ query.isPlaceholderData } w="fit-content">
                <Text
                  fontSize="32px"
                  fontWeight={ 200 }
                  letterSpacing="-0.02em"
                  color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  lineHeight="1"
                >
                  { stats.total.toLocaleString() }
                </Text>
              </Skeleton>
            </LinkBox>

            { /* Active Workflows */ }
            <LinkBox
              p={ 5 }
              position="relative"
              bgGradient={{
                _light: 'linear-gradient(135deg, rgba(6, 182, 212, 0.04) 0%, rgba(14, 165, 233, 0.05) 100%)',
                _dark: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(14, 165, 233, 0.1) 100%)',
              }}
              transition="all 0.2s ease"
              _hover={{
                bgGradient: {
                  _light: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06) 0%, rgba(14, 165, 233, 0.08) 100%)',
                  _dark: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(14, 165, 233, 0.15) 100%)',
                },
              }}
            >
              <Flex
                alignItems="center"
                gap={ 1.5 }
                mb={ 2 }
              >
                <Text
                  fontSize="10px"
                  fontWeight={ 600 }
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={{ _light: 'rgba(6, 182, 212, 0.7)', _dark: 'rgba(14, 165, 233, 0.8)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  Active Workflows
                </Text>
                <IconSvg
                  name="check"
                  boxSize={ 3 }
                  color={{ _light: 'rgba(6, 182, 212, 0.75)', _dark: 'rgba(14, 165, 233, 0.85)' }}
                />
              </Flex>
              <Skeleton loading={ query.isPlaceholderData } w="fit-content">
                <Text
                  fontSize="32px"
                  fontWeight={ 200 }
                  letterSpacing="-0.02em"
                  color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  lineHeight="1"
                >
                  { stats.active.toLocaleString() }
                </Text>
              </Skeleton>
            </LinkBox>

            { /* Expired Workflows */ }
            <LinkBox
              p={ 5 }
              position="relative"
              bgGradient={{
                _light: 'linear-gradient(135deg, rgba(30, 58, 138, 0.04) 0%, rgba(51, 65, 85, 0.05) 100%)',
                _dark: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(51, 65, 85, 0.1) 100%)',
              }}
              transition="all 0.2s ease"
              _hover={{
                bgGradient: {
                  _light: 'linear-gradient(135deg, rgba(30, 58, 138, 0.06) 0%, rgba(51, 65, 85, 0.08) 100%)',
                  _dark: 'linear-gradient(135deg, rgba(30, 58, 138, 0.12) 0%, rgba(51, 65, 85, 0.15) 100%)',
                },
              }}
            >
              <Flex
                alignItems="center"
                gap={ 1.5 }
                mb={ 2 }
              >
                <Text
                  fontSize="10px"
                  fontWeight={ 600 }
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={{ _light: 'rgba(30, 58, 138, 0.7)', _dark: 'rgba(51, 65, 85, 0.8)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  Expired Workflows
                </Text>
                <IconSvg
                  name="clock"
                  boxSize={ 3 }
                  color={{ _light: 'rgba(30, 58, 138, 0.75)', _dark: 'rgba(51, 65, 85, 0.85)' }}
                />
              </Flex>
              <Skeleton loading={ query.isPlaceholderData } w="fit-content">
                <Text
                  fontSize="32px"
                  fontWeight={ 200 }
                  letterSpacing="-0.02em"
                  color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  lineHeight="1"
                >
                  { stats.expired.toLocaleString() }
                </Text>
              </Skeleton>
            </LinkBox>

            { /* Scheduled Runs */ }
            <LinkBox
              p={ 5 }
              position="relative"
              bgGradient={{
                _light: 'linear-gradient(135deg, rgba(6, 182, 212, 0.04) 0%, rgba(14, 165, 233, 0.05) 100%)',
                _dark: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(14, 165, 233, 0.1) 100%)',
              }}
              transition="all 0.2s ease"
              _hover={{
                bgGradient: {
                  _light: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06) 0%, rgba(14, 165, 233, 0.08) 100%)',
                  _dark: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(14, 165, 233, 0.15) 100%)',
                },
              }}
            >
              <Flex
                alignItems="center"
                gap={ 1.5 }
                mb={ 2 }
              >
                <Text
                  fontSize="10px"
                  fontWeight={ 600 }
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color={{ _light: 'rgba(6, 182, 212, 0.7)', _dark: 'rgba(14, 165, 233, 0.8)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  Scheduled Runs
                </Text>
                <IconSvg
                  name="repeat"
                  boxSize={ 3 }
                  color={{ _light: 'rgba(6, 182, 212, 0.75)', _dark: 'rgba(14, 165, 233, 0.85)' }}
                />
              </Flex>
              <Skeleton loading={ query.isPlaceholderData } w="fit-content">
                <Text
                  fontSize="32px"
                  fontWeight={ 200 }
                  letterSpacing="-0.02em"
                  color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  lineHeight="1"
                >
                  { (() => {
                    if (stats.totalRuns >= 1000000) {
                      return `${ (stats.totalRuns / 1000000).toFixed(1) }M`;
                    }
                    if (stats.totalRuns >= 1000) {
                      return `${ (stats.totalRuns / 1000).toFixed(1) }K`;
                    }
                    return stats.totalRuns.toLocaleString();
                  })() }
                </Text>
              </Skeleton>
            </LinkBox>
          </Grid>
        </VStack>
      </Box>

      { description }
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
