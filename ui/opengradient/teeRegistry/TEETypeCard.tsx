import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { TEETypeSummary } from 'lib/opengradient/contracts/teeRegistry';
import { Skeleton } from 'toolkit/chakra/skeleton';

type Props = {
  type: TEETypeSummary;
  isSelected: boolean;
  isLoading?: boolean;
  onClick: (typeId: number) => void;
};

const TEETypeCard = ({ type, isSelected, isLoading, onClick }: Props) => {

  const handleClick = React.useCallback(() => {
    onClick(type.typeId);
  }, [ onClick, type.typeId ]);

  return (
    <Flex
      px={ 4 }
      py={ 3 }
      cursor="pointer"
      position="relative"
      overflow="hidden"
      transition="all 0.2s ease"
      border="1px solid"
      borderColor={ isSelected ?
        { _light: 'rgba(124, 58, 237, 0.3)', _dark: 'rgba(139, 92, 246, 0.4)' } :
        { _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(255, 255, 255, 0.06)' }
      }
      bg={ isSelected ?
        { _light: 'rgba(124, 58, 237, 0.03)', _dark: 'rgba(139, 92, 246, 0.06)' } :
        { _light: 'rgba(0, 0, 0, 0.01)', _dark: 'rgba(255, 255, 255, 0.01)' }
      }
      _hover={{
        borderColor: { _light: 'rgba(124, 58, 237, 0.2)', _dark: 'rgba(139, 92, 246, 0.3)' },
        bg: { _light: 'rgba(124, 58, 237, 0.02)', _dark: 'rgba(139, 92, 246, 0.04)' },
      }}
      onClick={ handleClick }
      role="group"
      alignItems="center"
      gap={ 4 }
    >
      { /* Active indicator bar at top */ }
      <Box
        position="absolute"
        top={ 0 }
        left={ 0 }
        right={ 0 }
        h="2px"
        bg={ isSelected ?
          { _light: 'rgba(124, 58, 237, 0.5)', _dark: 'rgba(139, 92, 246, 0.6)' } :
          'transparent'
        }
        transition="all 0.2s ease"
      />

      { /* Name + Stats */ }
      <Flex alignItems="baseline" gap={ 3 }>
        <Skeleton loading={ isLoading } w="fit-content">
          <Text
            fontSize="13px"
            fontWeight={ 600 }
            color={{ _light: 'rgba(0, 0, 0, 0.85)', _dark: 'rgba(255, 255, 255, 0.9)' }}
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-0.01em"
            whiteSpace="nowrap"
          >
            { type.name }
          </Text>
        </Skeleton>
        <Skeleton loading={ isLoading } w="fit-content">
          <Text
            fontSize="11px"
            fontFamily="system-ui, -apple-system, sans-serif"
            whiteSpace="nowrap"
            color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
          >
            { type.activeNodes }/{ type.totalNodes } active
          </Text>
        </Skeleton>
      </Flex>
    </Flex>
  );
};

export default TEETypeCard;
