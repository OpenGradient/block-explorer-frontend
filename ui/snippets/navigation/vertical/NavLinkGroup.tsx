import { Text, HStack, Box, VStack } from '@chakra-ui/react';
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
      width="240px"
      borderRadius="none"
      border="1px solid"
      borderColor={{ _light: 'gray.200', _dark: 'whiteAlpha.200' }}
      bgColor={{ _light: 'white', _dark: 'gray.900' }}
      p={ 1 }
    >
      <VStack gap={ 0 } alignItems="stretch" as="ul">
        { item.subItems.map((subItem, index) => Array.isArray(subItem) ? (
          <Box
            key={ index }
            w="100%"
            as="ul"
            _notLast={{
              mb: 1,
              pb: 1,
              borderBottomWidth: '1px',
              borderColor: { _light: 'gray.200', _dark: 'whiteAlpha.200' },
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
          borderRadius: 'none',
          p: 0,
          boxShadow: { _light: '0 4px 12px rgba(0, 0, 0, 0.08)', _dark: '0 4px 12px rgba(0, 0, 0, 0.4)' },
        }}
      >
        <Box
          { ...styleProps.itemProps }
          w="100%"
          aria-label={ `${ item.text } link group` }
          position="relative"
          cursor="pointer"
          bgColor={ item.isActive ?
            { _light: 'gray.100', _dark: 'whiteAlpha.100' } :
            'transparent'
          }
          color={ item.isActive ?
            { _light: 'gray.900', _dark: 'white' } :
            { _light: 'gray.700', _dark: 'gray.300' }
          }
          _hover={{
            bgColor: { _light: 'gray.50', _dark: 'whiteAlpha.50' },
            color: item.isActive ?
              { _light: 'gray.900', _dark: 'white' } :
              { _light: 'gray.900', _dark: 'gray.100' },
          }}
        >
          <HStack gap={ 0 } overflow="hidden" w="100%" alignItems="center">
            <NavLinkIcon item={ item }/>
            <Text
              { ...styleProps.textProps }
              ml={ 3 }
            >
              { item.text }
            </Text>
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
              opacity={ 0.6 }
            />
          </HStack>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default NavLinkGroup;
