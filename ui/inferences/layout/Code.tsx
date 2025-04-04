import React from 'react';

import { useColorModeValue } from 'toolkit/chakra/color-mode';
import type { SkeletonProps } from 'toolkit/chakra/skeleton';
import { Skeleton } from 'toolkit/chakra/skeleton';

interface Props extends SkeletonProps {
  children: React.ReactNode;
}

const Code = ({ children, loading, ...rest }: Props) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Skeleton
      flex={ 1 }
      wordBreak="break-word"
      whiteSpace="pre-wrap"
      loading={ loading }
      fontSize="sm"
      borderRadius="md"
      bgColor={ !loading ? bgColor : undefined }
      { ...rest }
    >
      { children }
    </Skeleton>
  );
};

export default Code;
