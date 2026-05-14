import { Box, Flex, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import type { Route } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { OPENGRADIENT_BRAND } from 'ui/opengradient/brand';
import Hint from 'ui/shared/Hint';
import IconSvg, { type IconName } from 'ui/shared/IconSvg';
import TruncatedValue from 'ui/shared/TruncatedValue';

export type Props = {
  className?: string;
  label: string;
  value: string | React.ReactNode;
  valuePrefix?: string;
  valuePostfix?: string;
  hint?: string | React.ReactNode;
  isLoading?: boolean;
  diff?: string | number;
  diffFormatted?: string;
  diffPeriod?: '24h';
  period?: '1h' | '24h' | '30min';
  href?: Route;
  icon?: IconName;
};

const Container = ({ href, children }: { href?: Route; children: React.JSX.Element }) => {
  if (href) {
    return (
      <Link href={ route(href) } variant="plain">
        { children }
      </Link>
    );
  }

  return children;
};

const StatsWidget = ({
  className,
  icon,
  label,
  value,
  valuePrefix,
  valuePostfix,
  isLoading,
  hint,
  diff,
  diffPeriod = '24h',
  diffFormatted,
  period,
  href,
}: Props) => {
  return (
    <Container href={ !isLoading ? href : undefined }>
      <Flex
        className={ className }
        alignItems="center"
        bgColor={ isLoading ? { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' } : OPENGRADIENT_BRAND.panel.bg }
        backdropFilter={ isLoading ? 'none' : 'blur(10px)' }
        p={ 4 }
        border="1px solid"
        borderColor={ OPENGRADIENT_BRAND.panel.border }
        borderRadius="8px"
        boxShadow={ isLoading ? 'none' : OPENGRADIENT_BRAND.panel.shadow }
        justifyContent="space-between"
        columnGap={ 3 }
        w="100%"
        transition="border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease"
        _hover={{
          borderColor: { _light: 'rgba(36, 188, 227, 0.34)', _dark: 'rgba(80, 201, 233, 0.28)' },
        }}
        cursor={ href ? 'pointer' : 'default' }
      >
        { icon && (
          <Box
            p={ 2.5 }
            bg={{ _light: 'rgba(36, 188, 227, 0.10)', _dark: 'rgba(80, 201, 233, 0.12)' }}
            display={{ base: 'none', lg: 'flex' }}
            flexShrink={ 0 }
            alignItems="center"
            justifyContent="center"
            borderRadius="8px"
          >
            <IconSvg
              name={ icon }
              boxSize="24px"
              isLoading={ isLoading }
              color={ OPENGRADIENT_BRAND.text.accent }
            />
          </Box>
        ) }
        <Box w={{ base: '100%', lg: icon ? 'calc(100% - 48px)' : '100%' }}>
          <Skeleton
            loading={ isLoading }
            color="text.secondary"
            textStyle="xs"
            w="fit-content"
          >
            <h2>{ label }</h2>
          </Skeleton>
          <Skeleton
            loading={ isLoading }
            display="flex"
            alignItems="baseline"
            fontWeight={ 500 }
            textStyle="heading.md"
          >
            { valuePrefix && <chakra.span whiteSpace="pre">{ valuePrefix }</chakra.span> }
            { typeof value === 'string' ? (
              <TruncatedValue isLoading={ isLoading } value={ value }/>
            ) : (
              value
            ) }
            { valuePostfix && <chakra.span whiteSpace="pre">{ valuePostfix }</chakra.span> }
            { diff && Number(diff) > 0 && (
              <>
                <Text ml={ 2 } mr={ 1 } color="green.500">
                  +{ diffFormatted || Number(diff).toLocaleString() }
                </Text>
                <Text color="text.secondary" textStyle="sm">({ diffPeriod })</Text>
              </>
            ) }
            { period && <Text color="text.secondary" textStyle="xs" fontWeight={ 400 } ml={ 1 }>({ period })</Text> }
          </Skeleton>
        </Box>
        { typeof hint === 'string' ? (
          <Skeleton loading={ isLoading } alignSelf="center" borderRadius="none">
            <Hint label={ hint } boxSize={ 6 } color={ OPENGRADIENT_BRAND.text.secondary }/>
          </Skeleton>
        ) : hint }
      </Flex>
    </Container>
  );
};

export default chakra(StatsWidget);
