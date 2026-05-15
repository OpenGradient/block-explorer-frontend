import { Text, HStack, Box, VStack, chakra } from '@chakra-ui/react';
import React from 'react';

import type { NavGroupItem } from 'types/client/navigation';

import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import LightningLabel from '../LightningLabel';
import NavLinkIcon from '../NavLinkIcon';
import useNavLinkStyleProps from '../useNavLinkStyleProps';
import { checkRouteHighlight } from '../utils';
import NavLink from './NavLink';

type Props = {
  item: NavGroupItem;
  isCollapsed?: boolean;
};

const NavLinkGroup = ({ item }: Props) => {
  const styleProps = useNavLinkStyleProps({ isActive: item.isActive });

  const isHighlighted = checkRouteHighlight(item.subItems);

  const content = (
    <Box
      width="260px"
      border="1px solid"
      borderColor={{ _light: 'rgba(36, 188, 227, 0.18)', _dark: 'rgba(189, 235, 247, 0.14)' }}
      bgColor={{
        _light: '#ffffff',
        _dark: '#0f1626',
      }}
      backgroundImage={{
        _light: 'linear-gradient(180deg, #ffffff 0%, #f4fcfe 100%)',
        _dark: 'linear-gradient(180deg, #0f1626 0%, #0a0f19 100%)',
      }}
      p={ 2 }
      borderRadius="8px"
      boxShadow={{
        _light: '0 16px 44px rgba(14, 75, 91, 0.12)',
        _dark: '0 18px 50px rgba(0, 0, 0, 0.42)',
      }}
    >
      <VStack gap={ 0 } alignItems="stretch" as="ul">
        { item.subItems.map((subItem, index) => Array.isArray(subItem) ? (
          <Box
            key={ index }
            w="100%"
            as="ul"
            _notLast={{
              mb: 2,
              pb: 2,
              borderBottomWidth: '1px',
              borderColor: { _light: 'rgba(36, 188, 227, 0.14)', _dark: 'rgba(189, 235, 247, 0.10)' },
            }}
          >
            { subItem.map(subSubItem => <NavLink key={ subSubItem.text } item={ subSubItem } isCollapsed={ false }/>) }
          </Box>
        ) :
          <NavLink key={ subItem.text } item={ subItem } isCollapsed={ false }/>,
        ) }
      </VStack>
    </Box>
  );

  return (
    <Box as="li" listStyleType="none" w="100%">
      <Tooltip
        content={ content }
        positioning={{
          placement: 'right-start',
          offset: { crossAxis: 4, mainAxis: 0 },
          strategy: 'fixed',
        }}
        // should not be lazy to help google indexing pages
        lazyMount={ false }
        variant="popover"
        interactive
        contentProps={{
          p: 0,
          boxShadow: {
            _light: '0 18px 50px rgba(14, 75, 91, 0.14)',
            _dark: '0 18px 52px rgba(0, 0, 0, 0.46)',
          },
        }}
      >
        <chakra.div
          w="100%"
          aria-label={ `${ item.text } link group` }
          position="relative"
          cursor="pointer"
          bgColor={ item.isActive ?
            { _light: 'rgba(36, 188, 227, 0.09)', _dark: 'rgba(36, 188, 227, 0.12)' } :
            'transparent'
          }
          borderRadius="8px"
          color={ item.isActive ?
            { _light: '#0e4b5b', _dark: '#bdebf7' } :
            { _light: 'rgba(14, 75, 91, 0.65)', _dark: 'rgba(189, 235, 247, 0.55)' }
          }
          transition="all 0.15s ease-out"
          py={ 3 }
          px={ 4 }
          display="flex"
          { ...(item.isActive ? { 'data-selected': true } : {}) }
          _hover={{
            color: {
              _light: '#1d96b6',
              _dark: '#50c9e9',
            },
            bgColor: {
              _light: 'rgba(36, 188, 227, 0.07)',
              _dark: 'rgba(36, 188, 227, 0.10)',
            },
          }}
        >
          <HStack gap={ 0 } overflow="hidden" w="100%" alignItems="center">
            <Box
              opacity={ item.isActive ? 1 : 0.7 }
              transition="opacity 0.2s ease"
            >
              <NavLinkIcon item={ item }/>
            </Box>
            <Text
              { ...styleProps.textProps }
              ml={ 3 }
              overflow="hidden"
              textOverflow="ellipsis"
              flexShrink={ 1 }
              minW={ 0 }
            >
              { item.text }
            </Text>
            { item.isActive && (
              <Box
                w="6px"
                h="6px"
                borderRadius="50%"
                bg={{ _light: 'cyan.600', _dark: 'cyan.300' }}
                ml={ 2 }
                flexShrink={ 0 }
              />
            ) }
            { isHighlighted && (
              <LightningLabel
                iconColor={ item.isActive ? 'link.navigation.bg.selected' : 'link.navigation.bg' }
                isCollapsed={ false }
              />
            ) }
            <IconSvg
              name="arrows/east-mini"
              position="absolute"
              right={ 3 }
              transform="rotate(180deg)"
              boxSize={ 5 }
              opacity={ item.isActive ? 0.8 : 0.5 }
              transition="opacity 0.2s ease"
            />
          </HStack>
        </chakra.div>
      </Tooltip>
    </Box>
  );
};

export default NavLinkGroup;
