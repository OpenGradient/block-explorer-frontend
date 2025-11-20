import { Flex, Box, VStack } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import useIsAuth from 'ui/snippets/auth/useIsAuth';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import NetworkMenu from 'ui/snippets/networkMenu/NetworkMenu';

import TestnetBadge from '../TestnetBadge';
import NavLink from './NavLink';
import NavLinkGroup from './NavLinkGroup';
import NavLinkRewards from './NavLinkRewards';

const NavigationDesktop = () => {
  const { mainNavItems, accountNavItems } = useNavItems();
  const isAuth = useIsAuth();

  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      position="relative"
      flexDirection="column"
      alignItems="stretch"
      borderRight="1px solid"
      borderColor={{ _light: 'gray.200', _dark: 'whiteAlpha.200' }}
      bgColor={{ _light: 'white', _dark: 'gray.900' }}
      px={ 6 }
      py={ 8 }
      width="240px"
      minH="100vh"
    >
      <Box
        as="header"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="row"
        w="100%"
        mb={ 8 }
        pb={ 6 }
        borderBottom="1px solid"
        borderColor={{ _light: 'gray.200', _dark: 'whiteAlpha.200' }}
      >
        <NetworkLogo isCollapsed={ false }/>
        { Boolean(config.UI.navigation.featuredNetworks) && <NetworkMenu isCollapsed={ false }/> }
        <TestnetBadge ml={ 3 }/>
      </Box>
      <Box as="nav" w="100%">
        <VStack as="ul" gap={ 0.5 } alignItems="stretch">
          { mainNavItems.map((item) => {
            if (isGroupItem(item)) {
              return <NavLinkGroup key={ item.text } item={ item } isCollapsed={ false }/>;
            } else {
              return <NavLink key={ item.text } item={ item } isCollapsed={ false }/>;
            }
          }) }
        </VStack>
      </Box>
      { isAuth && (
        <Box
          as="nav"
          borderTop="1px solid"
          borderColor={{ _light: 'gray.200', _dark: 'whiteAlpha.200' }}
          w="100%"
          mt={ 6 }
          pt={ 6 }
        >
          <VStack as="ul" gap={ 0.5 } alignItems="stretch">
            <NavLinkRewards isCollapsed={ false }/>
            { accountNavItems.map((item) => <NavLink key={ item.text } item={ item } isCollapsed={ false }/>) }
          </VStack>
        </Box>
      ) }
    </Flex>
  );
};

export default NavigationDesktop;
