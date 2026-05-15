import { HStack, Box, chakra } from '@chakra-ui/react';
import React from 'react';

import type { NavItem } from 'types/client/navigation';

import { route } from 'nextjs-routes';

import { isInternalItem } from 'lib/hooks/useNavItems';
import { Link } from 'toolkit/chakra/link';

import LightningLabel from '../LightningLabel';
import NavLinkIcon from '../NavLinkIcon';
import useNavLinkStyleProps from '../useNavLinkStyleProps';
import { checkRouteHighlight } from '../utils';

type Props = {
  item: NavItem;
  onClick?: (e: React.MouseEvent) => void;
  isCollapsed?: boolean;
  isDisabled?: boolean;
};

const NavLink = ({ item, onClick, isDisabled }: Props) => {
  const isInternalLink = isInternalItem(item);
  const styleProps = useNavLinkStyleProps({ isExpanded: true, isCollapsed: false, isActive: isInternalLink && item.isActive });
  const isHighlighted = checkRouteHighlight(item);

  return (
    <Box as="li" listStyleType="none" w="100%">
      <Link
        href={ isInternalLink ? route(item.nextRoute) : item.url }
        external={ !isInternalLink }
        { ...styleProps.itemProps }
        w="100%"
        display="flex"
        position="relative"
        aria-label={ `${ item.text } link` }
        whiteSpace="nowrap"
        onClick={ onClick }
        bgColor={ isInternalLink && item.isActive ?
          { _light: 'rgba(36, 188, 227, 0.09)', _dark: 'rgba(36, 188, 227, 0.12)' } :
          'transparent'
        }
        borderRadius="8px"
        color={ isInternalLink && item.isActive ?
          { _light: '#0e4b5b', _dark: '#bdebf7' } :
          { _light: 'rgba(14, 75, 91, 0.65)', _dark: 'rgba(189, 235, 247, 0.55)' }
        }
        transition="all 0.15s ease-out"
        _hover={{
          color: isDisabled ? undefined : {
            _light: '#1d96b6',
            _dark: '#50c9e9',
          },
          bgColor: isDisabled ? undefined : {
            _light: 'rgba(36, 188, 227, 0.07)',
            _dark: 'rgba(36, 188, 227, 0.10)',
          },
        }}
      >
        <HStack gap={ 0 } overflow="hidden" w="100%" alignItems="center">
          <Box
            opacity={ isInternalLink && item.isActive ? 1 : 0.7 }
            transition="opacity 0.2s ease"
          >
            <NavLinkIcon item={ item }/>
          </Box>
          <chakra.span
            { ...styleProps.textProps }
            ml={ 3 }
            display="inline"
            position="relative"
            textDecoration="none"
            overflow="hidden"
            textOverflow="ellipsis"
            flexShrink={ 1 }
            minW={ 0 }
          >
            <span>{ item.text }</span>
          </chakra.span>
          { isInternalLink && item.isActive && (
            <Box
              w="6px"
              h="6px"
              borderRadius="50%"
              bg="#24bce3"
              boxShadow="0 0 8px rgba(36, 188, 227, 0.7)"
              ml={ 2 }
              flexShrink={ 0 }
            />
          ) }
          { isHighlighted && (
            <LightningLabel
              iconColor={ isInternalLink && item.isActive ? 'link.navigation.bg.selected' : 'link.navigation.bg' }
              isCollapsed={ false }
            />
          ) }
        </HStack>
      </Link>
    </Box>
  );
};

export default React.memo(NavLink);
