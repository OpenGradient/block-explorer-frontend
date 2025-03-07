import type { FlexProps, SkeletonProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import React from 'react';

import Skeleton from 'ui/shared/chakra/Skeleton';

import Code from './Code';

interface ItemProps extends FlexProps {
  label?: React.ReactNode;
  labelProps?: SkeletonProps;
  children: React.ReactNode;
  isLoading?: boolean;
  isCode?: boolean;
}

const Item = ({ label, labelProps = {}, children, isLoading, isCode = false, ...rest }: ItemProps) => {
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
        <Code isLoaded={ !isLoading }>{ children }</Code>
      ) : <Skeleton flex={ 1 } width="100%" isLoaded={ !isLoading }>{ children }</Skeleton> }
    </Flex>
  );
};

export default Item;
