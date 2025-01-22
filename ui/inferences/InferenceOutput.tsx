import { Divider, Flex, useColorModeValue, VStack } from '@chakra-ui/react';
import React from 'react';

import type { DecodedInputParams } from 'types/api/decodedInput';

import { convertArrayToModelOutput } from 'lib/inferences/utils';
import Skeleton from 'ui/shared/chakra/Skeleton';

interface InferenceOutputProps {
  value: DecodedInputParams['value'];
  isLoading?: boolean;
}

const CodeItem = ({ label, children, isLoading }: { label?: string; children: React.ReactNode; isLoading?: boolean }) => {
  const dataBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Flex
      w="100%"
      columnGap={ 5 }
      rowGap={ 2 }
      px={{ base: 0, lg: 4 }}
      flexDir={{ base: 'column', lg: 'row' }}
      alignItems={{ base: 'flex-start', lg: 'center' }}
    >
      { label && (
        <Skeleton fontWeight={ 600 } w={{ base: 'auto', lg: '80px' }} flexShrink={ 0 } isLoaded={ !isLoading }>
          { label }
        </Skeleton >
      ) }
      <Skeleton
        w="100%"
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
    </Flex>
  );
};

const Container = ({ children }: { children: React.ReactNode }) => (
  <VStack
    align="flex-start"
    divider={ <Divider/> }
    fontSize="sm"
    lineHeight={ 5 }
    flexGrow={ 1 }
    w="100%"
    marginBottom={ 2 }
  >
    { children }
  </VStack>
);

const InferenceOutput = ({ value, isLoading }: InferenceOutputProps) => {
  try {
    const modelOutput = convertArrayToModelOutput(value);
    if (modelOutput) {
      const { numbers, strings, jsons } = modelOutput;
      if (numbers.length > 0) {
        return (
          <Container>
            { numbers.map(({ name, values }) => {
              const decimalValues = values.map((v) => (Number(v.value) / (10 ** Number(v.decimals))));
              return (
                <CodeItem key={ name } label={ name } isLoading={ isLoading }>
                  { JSON.stringify(decimalValues) }
                </CodeItem>
              );
            }) }
          </Container>
        );
      }
      if (strings.length > 0) {
        return (
          <Container>
            { strings.map(({ name, values }) => {
              return (
                <CodeItem key={ name } label={ name } isLoading={ isLoading }>
                  { JSON.stringify(values) }
                </CodeItem>
              );
            }) }
          </Container>
        );
      }
      if (jsons.length > 0) {
        return (
          <Container>
            { jsons.map(({ name, value }) => {
              return (
                <CodeItem key={ name } label={ name } isLoading={ isLoading }>
                  { JSON.stringify(JSON.parse(value)) }
                </CodeItem>
              );
            }) }
          </Container>
        );
      }
    }
  } catch {}

  return (
    value &&
    (
      <Container>
        <CodeItem isLoading={ isLoading }>
          { JSON.stringify(value, null, 4) }
        </CodeItem>
      </Container>
    )
  );
};

export default InferenceOutput;
