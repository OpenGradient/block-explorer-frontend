import { Box, Flex, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import type { Route } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
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
        bgColor={ isLoading ? { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' } : { _light: 'rgba(255, 255, 255, 0.6)', _dark: 'rgba(255, 255, 255, 0.05)' } }
        backdropFilter={ isLoading ? 'none' : 'blur(10px)' }
        p={ 4 }
        border="1px solid"
        borderColor={{ _light: 'rgba(102, 126, 234, 0.15)', _dark: 'rgba(255, 255, 255, 0.1)' }}
        justifyContent="space-between"
        columnGap={ 3 }
        w="100%"
        transition="all 0.2s ease"
        _hover={{
          borderColor: { _light: 'rgba(102, 126, 234, 0.3)', _dark: 'rgba(255, 255, 255, 0.2)' },
          transform: 'translateY(-2px)',
          boxShadow: { _light: '0 4px 12px rgba(102, 126, 234, 0.1)', _dark: '0 4px 12px rgba(0, 0, 0, 0.3)' },
        }}
        cursor={ href ? 'pointer' : 'default' }
      >
        { icon && (
          <Box
            p={ 2.5 }
            bg={{ _light: 'rgba(102, 126, 234, 0.1)', _dark: 'rgba(66, 153, 225, 0.15)' }}
            display={{ base: 'none', lg: 'flex' }}
            flexShrink={ 0 }
            alignItems="center"
            justifyContent="center"
          >
            <IconSvg
              name={ icon }
              boxSize="24px"
              isLoading={ isLoading }
              color={{ _light: 'blue.600', _dark: 'blue.400' }}
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
            <Hint label={ hint } boxSize={ 6 } color={{ _light: 'gray.600', _dark: 'gray.400' }}/>
          </Skeleton>
        ) : hint }
      </Flex>
    </Container>
  );
};

export default chakra(StatsWidget);
