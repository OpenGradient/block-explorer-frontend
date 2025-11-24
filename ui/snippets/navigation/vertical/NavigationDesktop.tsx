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
      borderColor={{ _light: 'rgba(0, 0, 0, 0.08)', _dark: 'rgba(255, 255, 255, 0.12)' }}
      bgColor={{
        _light: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
        _dark: '#0a0a0a',
      }}
      backgroundImage={{
        _light: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
        _dark: '#0a0a0a',
      }}
      px={ 6 }
      py={ 10 }
      width="260px"
      minWidth="260px"
      maxWidth="260px"
      minH="100vh"
      boxShadow={{ _light: 'inset -1px 0 0 rgba(0, 0, 0, 0.04)', _dark: 'inset -1px 0 0 rgba(255, 255, 255, 0.06)' }}
    >
      <Box
        as="header"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        w="100%"
        mb={ 10 }
        pb={ 8 }
        borderBottom="1px solid"
        borderColor={{ _light: 'rgba(0, 0, 0, 0.08)', _dark: 'rgba(255, 255, 255, 0.12)' }}
        position="relative"
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '-1px',
          left: 0,
          right: 0,
          height: '1px',
          background: {
            _light: 'linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%)',
            _dark: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)',
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="100%"
          mb={ 4 }
          position="relative"
        >
          <NetworkLogo isCollapsed={ false }/>
          { Boolean(config.UI.navigation.featuredNetworks) && (
            <Box position="absolute" right={ 0 }>
              <NetworkMenu isCollapsed={ false }/>
            </Box>
          ) }
        </Box>
        <Box display="flex" justifyContent="center" w="100%">
          <TestnetBadge/>
        </Box>
      </Box>
      <Box as="nav" w="100%">
        <VStack as="ul" gap={ 1 } alignItems="stretch">
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
          borderColor={{ _light: 'rgba(0, 0, 0, 0.08)', _dark: 'rgba(255, 255, 255, 0.12)' }}
          w="100%"
          mt={ 8 }
          pt={ 8 }
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: '-1px',
            left: 0,
            right: 0,
            height: '1px',
            background: {
              _light: 'linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%)',
              _dark: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)',
            },
          }}
        >
          <VStack as="ul" gap={ 1 } alignItems="stretch">
            <NavLinkRewards isCollapsed={ false }/>
            { accountNavItems.map((item) => <NavLink key={ item.text } item={ item } isCollapsed={ false }/>) }
          </VStack>
        </Box>
      ) }
    </Flex>
  );
};

export default NavigationDesktop;
