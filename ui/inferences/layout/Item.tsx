import type { FlexProps, SkeletonProps } from '@chakra-ui/react';
import { Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import Skeleton from 'ui/shared/chakra/Skeleton';

interface ItemProps extends FlexProps {
  label?: React.ReactNode;
  labelProps?: SkeletonProps;
  children: React.ReactNode;
  isLoading?: boolean;
  isCode?: boolean;
}

const Item = ({ label, labelProps = {}, children, isLoading, isCode = false, ...rest }: ItemProps) => {
  const dataBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Flex
      w="100%"
      columnGap={ 5 }
      rowGap={ 2 }
      flexDir={{ base: 'column', lg: 'row' }}
      alignItems={{ base: 'flex-start', lg: 'center' }}
      { ...rest }
    >
      { label && (
        <Skeleton fontWeight={ 600 } w={{ base: 'auto', lg: '120px' }} flexShrink={ 0 } isLoaded={ !isLoading } { ...labelProps }>
          { label }
        </Skeleton >
      ) }
      { isCode ? (
        <Skeleton
          flex={ 1 }
          wordBreak="break-word"
          whiteSpace="pre-wrap"
          isLoaded={ !isLoading }
          p={ 4 }
          fontSize="sm"
          borderRadius="md"
          bgColor={ isLoading ? undefined : dataBgColor }
        >
          { children }
        </Skeleton>
      ) : <Skeleton flex={ 1 } isLoaded={ !isLoading }>{ children }</Skeleton> }
    </Flex>
  );
};

export default Item;
