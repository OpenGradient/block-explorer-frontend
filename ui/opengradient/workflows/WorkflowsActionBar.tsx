import { HStack } from '@chakra-ui/react';
import React from 'react';

import ActionBar from 'ui/shared/ActionBar';
import FilterInput from 'ui/shared/filters/FilterInput';
// import Sort from 'ui/shared/sort/Sort';
// import { SORT_OPTIONS } from 'ui/tokens/utils';

interface Props {
  // pagination: PaginationParams;
  searchTerm: string | undefined;
  onSearchChange: (value: string) => void;
  // sort: TokensSortingValue | undefined;
  // onSortChange: () => void;
  // filter: React.ReactNode;
  inTabsSlot?: boolean;
}

const WorkflowsActionBar = ({
  // sort,
  // onSortChange,
  searchTerm,
  onSearchChange,
  // filter,
  inTabsSlot,
}: Props) => {

  const searchInput = (
    <FilterInput
      w={{ base: '100%', lg: '360px' }}
      size="sm"
      onChange={ onSearchChange }
      placeholder="User or contract address"
      initialValue={ searchTerm }
    />
  );

  return (
    <>
      <HStack gap={ 3 } mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { /* { filter }
        <Sort
          name="tokens_sorting"
          defaultValue={ sort }
          options={ SORT_OPTIONS }
          onChange={ onSortChange }
        /> */ }
        { searchInput }
      </HStack>
      <ActionBar
        mt={ inTabsSlot ? 0 : -6 }
        py={{ lg: inTabsSlot ? 0 : undefined }}
        justifyContent={ inTabsSlot ? 'space-between' : undefined }
        display={{ base: 'none', lg: 'flex' }}
        mb={ 4 }
      >
        <HStack gap={ 3 } display={{ base: 'none', lg: 'flex' }}>
          { searchInput }
        </HStack>
        { /* <Pagination { ...pagination } ml={ inTabsSlot ? 8 : 'auto' }/> */ }
      </ActionBar>
    </>
  );
};

export default React.memo(WorkflowsActionBar);
