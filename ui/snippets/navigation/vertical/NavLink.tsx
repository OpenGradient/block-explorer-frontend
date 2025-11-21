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
          { _light: 'rgba(0, 0, 0, 0.03)', _dark: 'rgba(255, 255, 255, 0.05)' } :
          'transparent'
        }
        color={ isInternalLink && item.isActive ?
          { _light: 'rgba(0, 0, 0, 0.9)', _dark: 'rgba(255, 255, 255, 0.95)' } :
          { _light: 'rgba(0, 0, 0, 0.6)', _dark: 'rgba(255, 255, 255, 0.7)' }
        }
        transition="opacity 0.2s ease"
        _hover={{
          opacity: isDisabled ? 1 : 0.7,
          bgColor: 'transparent',
        }}
      >
        <HStack gap={ 0 } overflow="hidden" w="100%" alignItems="center">
          <NavLinkIcon item={ item }/>
          <chakra.span
            { ...styleProps.textProps }
            ml={ 3 }
            display="inline"
          >
            <span>{ item.text }</span>
          </chakra.span>
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
