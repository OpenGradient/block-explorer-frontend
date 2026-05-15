import { Box, Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import type { GasPriceInfo, GasPrices } from 'types/api/stats';

import { SECOND } from 'lib/consts';
import { asymp } from 'lib/html-entities';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { OPENGRADIENT_BRAND } from 'ui/opengradient/brand';
import GasPrice from 'ui/shared/gas/GasPrice';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  type: keyof GasPrices;
  data: GasPriceInfo;
  isLoading: boolean;
}

const TITLES: Record<keyof GasPrices, string> = {
  fast: 'Fast',
  average: 'Normal',
  slow: 'Slow',
};
const ICONS: Record<keyof GasPrices, IconName> = {
  fast: 'rocket_xl',
  average: 'gas_xl',
  slow: 'gas_xl',
};

const GasTrackerPriceSnippet = ({ data, type, isLoading }: Props) => {
  const accentColors = {
    fast: OPENGRADIENT_BRAND.text.accent,
    average: { _light: '#24bce3', _dark: '#24bce3' },
    slow: { _light: 'rgba(29, 150, 182, 0.52)', _dark: 'rgba(189, 235, 247, 0.34)' },
  };
  const iconBgColors = {
    fast: { _light: 'rgba(36, 188, 227, 0.12)', _dark: 'rgba(36, 188, 227, 0.14)' },
    average: { _light: 'rgba(36, 188, 227, 0.09)', _dark: 'rgba(36, 188, 227, 0.10)' },
    slow: { _light: 'rgba(14, 75, 91, 0.06)', _dark: 'rgba(189, 235, 247, 0.07)' },
  };

  return (
    <Box
      as="li"
      listStyleType="none"
      position="relative"
      overflow="hidden"
      px={{ base: 5, lg: 6 }}
      py={ 5 }
      bg={ OPENGRADIENT_BRAND.panel.bg }
      borderColor={ OPENGRADIENT_BRAND.panel.border }
      borderWidth="1px"
      borderRadius="8px"
      boxShadow={ OPENGRADIENT_BRAND.panel.shadow }
      _before={{
        content: '""',
        position: 'absolute',
        insetInline: 0,
        top: 0,
        h: '2px',
        bg: accentColors[type],
      }}
    >
      <Flex alignItems="center" justifyContent="space-between" columnGap={ 4 }>
        <Skeleton loading={ isLoading } w="fit-content">
          <chakra.span
            color={ OPENGRADIENT_BRAND.text.primary }
            fontFamily="heading"
            fontSize="lg"
            fontWeight={ 600 }
          >
            { TITLES[type] }
          </chakra.span>
        </Skeleton>
        <Flex
          boxSize={ 10 }
          alignItems="center"
          justifyContent="center"
          flexShrink={ 0 }
          borderRadius="8px"
          bg={ iconBgColors[type] }
          color={ OPENGRADIENT_BRAND.text.accent }
        >
          <IconSvg name={ ICONS[type] } boxSize={ 6 } isLoading={ isLoading }/>
        </Flex>
      </Flex>

      <Flex columnGap={ 3 } alignItems="baseline" mt={ 5 }>
        <Skeleton loading={ isLoading }>
          <GasPrice
            data={ data }
            fontSize={{ base: '34px', xl: '42px' }}
            lineHeight="1.05"
            fontWeight={ 600 }
            letterSpacing="0"
            fontFamily="heading"
            color={ OPENGRADIENT_BRAND.text.primary }
          />
        </Skeleton>
      </Flex>

      <Skeleton loading={ isLoading } fontSize="sm" color={ OPENGRADIENT_BRAND.text.secondary } mt={ 3 } w="fit-content">
        { data.price !== null && data.fiat_price !== null && <GasPrice data={ data } prefix={ `${ asymp } ` } unitMode="secondary"/> }
        <span> per transaction</span>
        { typeof data.time === 'number' && data.time > 0 && <span> / { (data.time / SECOND).toLocaleString(undefined, { maximumFractionDigits: 1 }) }s</span> }
      </Skeleton>

      <Skeleton loading={ isLoading } mt={ 5 }>
        <Flex columnGap={ 2 } rowGap={ 2 } flexWrap="wrap">
          { typeof data.base_fee === 'number' && (
            <Box
              as="span"
              px={ 3 }
              py={ 1 }
              borderRadius="6px"
              borderWidth="1px"
              borderColor={ OPENGRADIENT_BRAND.panel.border }
              color={ OPENGRADIENT_BRAND.text.secondary }
              fontSize="xs"
            >
              Base { data.base_fee.toLocaleString(undefined, { maximumFractionDigits: 0 }) }
            </Box>
          ) }
          { typeof data.priority_fee === 'number' && (
            <Box
              as="span"
              px={ 3 }
              py={ 1 }
              borderRadius="6px"
              borderWidth="1px"
              borderColor={ OPENGRADIENT_BRAND.panel.border }
              color={ OPENGRADIENT_BRAND.text.secondary }
              fontSize="xs"
            >
              Priority { data.priority_fee.toLocaleString(undefined, { maximumFractionDigits: 0 }) }
            </Box>
          ) }
        </Flex>
      </Skeleton>
    </Box>
  );
};

export default React.memo(GasTrackerPriceSnippet);
