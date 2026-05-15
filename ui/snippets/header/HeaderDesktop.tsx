import { HStack, Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import RewardsButton from 'ui/rewards/RewardsButton';
import ColorModeToggle from 'ui/snippets/colorMode/ColorModeToggle';
import SearchBar from 'ui/snippets/searchBar/SearchBar';
import UserProfileDesktop from 'ui/snippets/user/profile/UserProfileDesktop';
import UserWalletDesktop from 'ui/snippets/user/wallet/UserWalletDesktop';

type Props = {
  hideSearchBar?: boolean;
  renderSearchBar?: () => React.ReactNode;
};

const HeaderDesktop = ({ hideSearchBar, renderSearchBar }: Props) => {

  const searchBar = renderSearchBar ? renderSearchBar() : <SearchBar/>;

  return (
    <HStack
      as="header"
      display={{ base: 'none', lg: 'flex' }}
      width="100%"
      minH="50px"
      alignItems="center"
      justifyContent={ hideSearchBar ? 'flex-end' : 'center' }
      gap={ 6 }
    >
      { !hideSearchBar && (
        <Box width="100%">
          { searchBar }
        </Box>
      ) }
      <Box display="flex" gap={ 2 } flexShrink={ 0 }>
        <ColorModeToggle/>
        { config.features.rewards.isEnabled && <RewardsButton/> }
        {
          (config.features.account.isEnabled && <UserProfileDesktop/>) ||
          (config.features.blockchainInteraction.isEnabled && <UserWalletDesktop/>)
        }
      </Box>
    </HStack>
  );
};

export default React.memo(HeaderDesktop);
