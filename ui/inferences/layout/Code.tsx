import type { SkeletonProps } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import Skeleton from 'ui/shared/chakra/Skeleton';

interface Props extends SkeletonProps {
  children: React.ReactNode;
}

const Code = ({ children, isLoaded, ...rest }: Props) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Skeleton
      flex={ 1 }
      wordBreak="break-word"
      whiteSpace="pre-wrap"
      isLoaded={ isLoaded }
      p={ 4 }
      fontSize="sm"
      borderRadius="md"
      bgColor={ isLoaded ? bgColor : undefined }
      { ...rest }
    >
      { children }
    </Skeleton>
  );
};

export default Code;
