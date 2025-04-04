import type { FlexProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { SkeletonProps } from 'toolkit/chakra/skeleton';
import { Skeleton } from 'toolkit/chakra/skeleton';

import Code from './Code';

interface ItemProps extends FlexProps {
  label?: React.ReactNode;
  labelProps?: SkeletonProps;
  children: React.ReactNode;
  isLoading?: boolean;
  isCode?: boolean;
}

const Item = ({ label, isLoading, labelProps = { loading: isLoading }, children, isCode = false, ...rest }: ItemProps) => {
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
        <Skeleton fontWeight={ 600 } w={{ base: 'auto', lg: '120px' }} flexShrink={ 0 } { ...labelProps }>
          { label }
        </Skeleton >
      ) }
      { isCode ? (
        <Code loading={ isLoading } px={ 4 }>{ children }</Code>
      ) : <Skeleton flex={ 1 } width="100%" loading={ isLoading }>{ children }</Skeleton> }
    </Flex>
  );
};

export default Item;
