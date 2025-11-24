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
      borderColor={{ _light: 'rgba(0, 0, 0, 0.12)', _dark: 'rgba(255, 255, 255, 0.18)' }}
      bgColor={{
        _light: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
        _dark: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
      }}
      backgroundImage={{
        _light: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
        _dark: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
      }}
      p={ 2 }
      boxShadow={{
        _light: '0 4px 16px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08)',
        _dark: '0 4px 16px rgba(0, 0, 0, 0.5), 0 1px 4px rgba(0, 0, 0, 0.3)',
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
              borderColor: { _light: 'rgba(0, 0, 0, 0.08)', _dark: 'rgba(255, 255, 255, 0.12)' },
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
            _light: '0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
            _dark: '0 8px 24px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4)',
          },
        }}
      >
        <chakra.div
          w="100%"
          aria-label={ `${ item.text } link group` }
          position="relative"
          cursor="pointer"
          bgColor="transparent"
          color={ item.isActive ?
            { _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' } :
            { _light: 'rgba(0, 0, 0, 0.65)', _dark: 'rgba(255, 255, 255, 0.75)' }
          }
          transition="all 0.15s ease-out"
          py={ 3 }
          px={ 4 }
          display="flex"
          { ...(item.isActive ? { 'data-selected': true } : {}) }
          _hover={{
            color: {
              _light: 'rgba(0, 0, 0, 0.9)',
              _dark: 'rgba(255, 255, 255, 0.95)',
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
                bg={{ _light: 'blue.500', _dark: 'blue.400' }}
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
