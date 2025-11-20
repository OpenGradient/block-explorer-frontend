import { HStack, Box, chakra } from '@chakra-ui/react';
import React from 'react';

import type { NavItem } from 'types/client/navigation';

import { route } from 'nextjs-routes';

import { isInternalItem } from 'lib/hooks/useNavItems';
import { Link } from 'toolkit/chakra/link';

import LightningLabel, { LIGHTNING_LABEL_CLASS_NAME } from '../LightningLabel';
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

  let hoverColor: string | { _light: string; _dark: string };
  if (isDisabled) {
    hoverColor = 'inherit';
  } else if (isInternalLink && item.isActive) {
    hoverColor = { _light: 'gray.900', _dark: 'white' };
  } else {
    hoverColor = { _light: 'gray.900', _dark: 'gray.100' };
  }

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
          { _light: 'gray.100', _dark: 'whiteAlpha.100' } :
          'transparent'
        }
        color={ isInternalLink && item.isActive ?
          { _light: 'gray.900', _dark: 'white' } :
          { _light: 'gray.700', _dark: 'gray.300' }
        }
        _hover={{
          bgColor: isDisabled ? 'transparent' : { _light: 'gray.50', _dark: 'whiteAlpha.50' },
          [`& *:not(.${ LIGHTNING_LABEL_CLASS_NAME }, .${ LIGHTNING_LABEL_CLASS_NAME } *)`]: {
            color: hoverColor,
          },
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
