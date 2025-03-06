import { Box, Hide, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/token';
import type { TokensSortingValue, TokensSortingField, TokensSorting } from 'types/api/tokens';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import useDebounce from 'lib/hooks/useDebounce';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TOKEN_INFO_ERC_20 } from 'stubs/token';
import { generateListStub } from 'stubs/utils';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TokenTypeFilter from 'ui/shared/filters/TokenTypeFilter';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';
import TokensBridgedChainsFilter from 'ui/tokens/TokensBridgedChainsFilter';
import { SORT_OPTIONS, getTokenFilterValue, getBridgedChainsFilterValue } from 'ui/tokens/utils';
import { getAllTasks } from 'lib/opengradient/contracts/scheduler';
import { useQuery } from '@tanstack/react-query';
import WorkflowsList from 'ui/opengradient/workflows/WorkflowsList';
import WorkflowsActionBar from 'ui/opengradient/workflows/WorkflowsActionBar';

const TABS_HEIGHT = 88;

const bridgedTokensFeature = config.features.bridgedTokens;

const Workflows = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const tab = getQueryParamString(router.query.tab);
  const q = getQueryParamString(router.query.q);

  const query = useQuery({
    queryKey: [ 'opengradient', 'contract', 'getAllTasks' ],
    queryFn: getAllTasks,
  });

  const [ searchTerm, setSearchTerm ] = React.useState<string>(q ?? '');
  const [ sort, setSort ] = React.useState<TokensSortingValue | undefined>(getSortValueFromQuery<TokensSortingValue>(router.query, SORT_OPTIONS));
  const [ tokenTypes, setTokenTypes ] = React.useState<Array<TokenType> | undefined>(getTokenFilterValue(router.query.type));
  const [ bridgeChains, setBridgeChains ] = React.useState<Array<string> | undefined>(getBridgedChainsFilterValue(router.query.chain_ids));

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const tokensQuery = useQueryWithPages({
    resourceName: tab === 'bridged' ? 'tokens_bridged' : 'tokens',
    filters: tab === 'bridged' ? { q: debouncedSearchTerm, chain_ids: bridgeChains } : { q: debouncedSearchTerm, type: tokenTypes },
    sorting: getSortParamsFromValue<TokensSortingValue, TokensSortingField, TokensSorting['order']>(sort),
    options: {
      placeholderData: generateListStub<'tokens'>(
        TOKEN_INFO_ERC_20,
        50,
        {
          next_page_params: {
            holder_count: 81528,
            items_count: 50,
            name: '',
            market_cap: null,
          },
        },
      ),
    },
  });

  const handleSearchTermChange = React.useCallback((value: string) => {
    tab === 'bridged' ?
      tokensQuery.onFilterChange({ q: value, chain_ids: bridgeChains }) :
      tokensQuery.onFilterChange({ q: value, type: tokenTypes });
    setSearchTerm(value);
  }, [ bridgeChains, tab, tokenTypes, tokensQuery ]);

  const handleTokenTypesChange = React.useCallback((value: Array<TokenType>) => {
    tokensQuery.onFilterChange({ q: debouncedSearchTerm, type: value });
    setTokenTypes(value);
  }, [ debouncedSearchTerm, tokensQuery ]);

  const handleBridgeChainsChange = React.useCallback((value: Array<string>) => {
    tokensQuery.onFilterChange({ q: debouncedSearchTerm, chain_ids: value });
    setBridgeChains(value);
  }, [ debouncedSearchTerm, tokensQuery ]);

  const handleSortChange = React.useCallback((value?: TokensSortingValue) => {
    setSort(value);
    tokensQuery.onSortingChange(getSortParamsFromValue(value));
  }, [ tokensQuery ]);

  const hasMultipleTabs = bridgedTokensFeature.isEnabled;

  const filter = tab === 'bridged' ? (
    <PopoverFilter contentProps={{ maxW: '350px' }} appliedFiltersNum={ bridgeChains?.length }>
      <TokensBridgedChainsFilter onChange={ handleBridgeChainsChange } defaultValue={ bridgeChains }/>
    </PopoverFilter>
  ) : (
    <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ tokenTypes?.length }>
      <TokenTypeFilter<TokenType> onChange={ handleTokenTypesChange } defaultValue={ tokenTypes } nftOnly={ false }/>
    </PopoverFilter>
  );

  const actionBar = (
    <WorkflowsActionBar
      key={ tab }
      pagination={ tokensQuery.pagination }
      filter={ filter }
      searchTerm={ searchTerm }
      onSearchChange={ handleSearchTermChange }
      sort={ sort }
      onSortChange={ handleSortChange }
      inTabsSlot={ !isMobile && hasMultipleTabs }
    />
  );

  return (
    <>
      <PageTitle
        title="Workflows"
        withTextAd
      />
      { !hasMultipleTabs && !isMobile && actionBar }
      <WorkflowsList
        query={ tokensQuery }
        sort={ sort }
        onSortChange={ handleSortChange }
        actionBar={ isMobile ? actionBar : null }
        hasActiveFilters={ Boolean(searchTerm || tokenTypes) }
        tableTop={ hasMultipleTabs ? TABS_HEIGHT : undefined }
        { ...query }
      />
    </>
  );
};

export default Workflows;
