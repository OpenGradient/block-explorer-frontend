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
        bgColor={ isLoading ? { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' } : { _light: 'white', _dark: 'whiteAlpha.50' } }
        p={ 4 }
        borderRadius="xl"
        justifyContent="space-between"
        columnGap={ 3 }
        w="100%"
        border="1px solid"
        borderColor={{ _light: 'gray.100', _dark: 'whiteAlpha.200' }}
        boxShadow={{ _light: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)', _dark: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)' }}
        transition="all 0.2s ease-in-out"
        _hover={ !isLoading && href ? {
          transform: 'translateY(-2px)',
          boxShadow: { _light: '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)', _dark: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)' },
          borderColor: { _light: 'blue.200', _dark: 'blue.400' },
        } : {}}
        position="relative"
        overflow="hidden"
        _before={ !isLoading ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 50%, rgba(59, 130, 246, 0.8) 100%)',
        } : {}}
      >
        { icon && (
          <Box
            p={ 2.5 }
            borderRadius="lg"
            bg={{ _light: 'blue.50', _dark: 'blue.900' }}
            display={{ base: 'none', lg: 'flex' }}
            flexShrink={ 0 }
            alignItems="center"
            justifyContent="center"
          >
            <IconSvg
              name={ icon }
              boxSize="32px"
              isLoading={ isLoading }
              color={{ _light: 'blue.600', _dark: 'blue.300' }}
            />
          </Box>
        ) }
        <Box w={{ base: '100%', lg: icon ? 'calc(100% - 64px)' : '100%' }}>
          <Skeleton
            loading={ isLoading }
            color="text.secondary"
            textStyle="xs"
            w="fit-content"
            mb={ 1 }
            fontWeight={ 500 }
            letterSpacing="0.01em"
          >
            <Text as="h2" fontSize="xs" textTransform="uppercase" letterSpacing="0.05em">{ label }</Text>
          </Skeleton>
          <Skeleton
            loading={ isLoading }
            display="flex"
            alignItems="baseline"
            fontWeight={ 600 }
            textStyle="heading.md"
            flexWrap="wrap"
            gap={ 1 }
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
                <Text ml={ 2 } mr={ 1 } color="green.500" fontWeight={ 600 }>
                  +{ diffFormatted || Number(diff).toLocaleString() }
                </Text>
                <Text color="text.secondary" textStyle="sm">({ diffPeriod })</Text>
              </>
            ) }
            { period && <Text color="text.secondary" textStyle="xs" fontWeight={ 400 } ml={ 1 }>({ period })</Text> }
          </Skeleton>
        </Box>
        { typeof hint === 'string' ? (
          <Skeleton loading={ isLoading } alignSelf="center" borderRadius="base">
            <Hint label={ hint } boxSize={ 6 } color={{ _light: 'gray.600', _dark: 'gray.400' }}/>
          </Skeleton>
        ) : hint }
      </Flex>
    </Container>
  );
};

export default chakra(StatsWidget);
