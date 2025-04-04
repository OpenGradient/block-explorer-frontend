import type { StackProps } from '@chakra-ui/react';
import { Separator, VStack } from '@chakra-ui/react';
import React from 'react';

const VStackContainer = ({ children, ...rest }: { children: React.ReactNode } & StackProps) => (
  <VStack
    align="flex-start"
    separator={ <Separator/> }
    fontSize="sm"
    lineHeight={ 5 }
    flexGrow={ 1 }
    w="100%"
    marginBottom={ 2 }
    gap={ 1 }
    { ...rest }
  >
    { children }
  </VStack>
);

export default VStackContainer;
