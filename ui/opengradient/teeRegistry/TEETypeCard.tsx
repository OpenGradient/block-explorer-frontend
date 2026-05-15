import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import React from 'react';

import type { TEETypeSummary } from 'lib/opengradient/contracts/teeRegistry';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { OPENGRADIENT_BRAND } from 'ui/opengradient/brand';

type Props = {
  type: TEETypeSummary;
  isSelected: boolean;
  isLoading?: boolean;
  onClick: (typeId: number) => void;
};

const { colors, fonts, panel, text } = OPENGRADIENT_BRAND;

const Metric = ({ label, value, isLoading }: { label: string; value: string; isLoading?: boolean }) => (
  <Box minW={ 0 }>
    <Text
      fontFamily={ fonts.mono }
      fontSize="9px"
      fontWeight={ 500 }
      letterSpacing="0.08em"
      textTransform="uppercase"
      color={ text.muted }
      mb={ 1 }
    >
      { label }
    </Text>
    <Skeleton loading={ isLoading } w="fit-content">
      <Text
        fontFamily={ fonts.mono }
        fontSize="14px"
        fontWeight={ 500 }
        lineHeight="1"
        color={ text.primary }
      >
        { value }
      </Text>
    </Skeleton>
  </Box>
);

const TEETypeCard = ({ type, isSelected, isLoading, onClick }: Props) => {
  const handleClick = React.useCallback(() => {
    onClick(type.typeId);
  }, [ onClick, type.typeId ]);

  const activePct = type.totalNodes > 0 ? Math.round((type.activeNodes / type.totalNodes) * 100) : 0;

  return (
    <Flex
      as="button"
      flexDirection="column"
      alignItems="stretch"
      textAlign="left"
      w="100%"
      minH="118px"
      px={ 4 }
      py={ 3.5 }
      border="1px solid"
      borderColor={ isSelected ?
        { _light: 'rgba(36, 188, 227, 0.52)', _dark: 'rgba(80, 201, 233, 0.46)' } :
        panel.border
      }
      borderRadius="8px"
      bg={ isSelected ?
        { _light: 'rgba(36, 188, 227, 0.08)', _dark: 'rgba(36, 188, 227, 0.12)' } :
        panel.bg
      }
      cursor="pointer"
      transition="background-color 0.18s ease, border-color 0.18s ease"
      _hover={{
        bg: { _light: 'rgba(36, 188, 227, 0.07)', _dark: 'rgba(36, 188, 227, 0.10)' },
        borderColor: { _light: 'rgba(36, 188, 227, 0.42)', _dark: 'rgba(80, 201, 233, 0.36)' },
      }}
      onClick={ handleClick }
    >
      <Flex alignItems="center" justifyContent="space-between" gap={ 3 } mb={ 4 }>
        <Skeleton loading={ isLoading } w="fit-content">
          <Text
            fontFamily={ fonts.sans }
            fontSize="15px"
            fontWeight={ 600 }
            lineHeight="1.2"
            color={ text.primary }
            truncate
          >
            { type.name }
          </Text>
        </Skeleton>
        <Box
          w="8px"
          h="8px"
          borderRadius="50%"
          bg={ isSelected ? colors.cyan : text.muted }
          boxShadow={ isSelected ? '0 0 10px rgba(36, 188, 227, 0.72)' : 'none' }
          opacity={ isSelected ? 1 : 0.42 }
          flexShrink={ 0 }
        />
      </Flex>

      <Grid templateColumns="repeat(3, minmax(0, 1fr))" gap={ 3 } mb={ 3 }>
        <Metric label="Active" value={ `${ type.activeNodes }/${ type.totalNodes }` } isLoading={ isLoading }/>
        <Metric label="Enabled" value={ type.enabledNodes.toLocaleString() } isLoading={ isLoading }/>
        <Metric label="PCRs" value={ type.approvedPCRs.toLocaleString() } isLoading={ isLoading }/>
      </Grid>

      <Box
        h="3px"
        borderRadius="2px"
        bg={{ _light: 'rgba(36, 188, 227, 0.12)', _dark: 'rgba(36, 188, 227, 0.12)' }}
        overflow="hidden"
      >
        <Box
          h="100%"
          w={ `${ activePct }%` }
          minW={ activePct > 0 ? '18px' : '0' }
          bg={ colors.cyan }
          borderRadius="2px"
          transition="width 0.2s ease"
        />
      </Box>
    </Flex>
  );
};

export default TEETypeCard;
