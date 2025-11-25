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
        bgColor="transparent"
        color={ isInternalLink && item.isActive ?
          { _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' } :
          { _light: 'rgba(0, 0, 0, 0.65)', _dark: 'rgba(255, 255, 255, 0.75)' }
        }
        transition="all 0.15s ease-out"
        _hover={{
          color: isDisabled ? undefined : {
            _light: 'rgba(0, 0, 0, 0.9)',
            _dark: 'rgba(255, 255, 255, 0.95)',
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
              bg={{ _light: 'cyan.600', _dark: 'cyan.300' }}
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
