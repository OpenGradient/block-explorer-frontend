import type { SkeletonProps,
  FlexProps,
  StackProps } from '@chakra-ui/react';
import { Divider, Flex, useColorModeValue, VStack, Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from '@chakra-ui/react';
import { range } from 'es-toolkit';
import { isEmpty } from 'es-toolkit/compat';
import React from 'react';

import type { DecodedInputParams } from 'types/api/decodedInput';

import { convertArrayToLLMChatResponse } from 'lib/inferences/llmChat';
import { convertArrayToModelOutput } from 'lib/inferences/traditional';
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

const Container = ({ children, ...rest }: { children: React.ReactNode } & StackProps) => (
  <VStack
    align="flex-start"
    divider={ <Divider/> }
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

interface InferenceOutputProps {
  value: DecodedInputParams['value'];
  isLoading?: boolean;
}

const InferenceOutput = ({ value, isLoading }: InferenceOutputProps) => {
  try {
    const modelOutput = convertArrayToModelOutput(value);
    if (modelOutput) {
      const { numbers, strings, jsons } = modelOutput;
      const elements: Array<React.ReactNode> = [];
      if (numbers.length > 0) {
        elements.push(...numbers.map(({ name, values }) => {
          const decimalValues = values.map((v) => (Number(v.value) / (10 ** Number(v.decimals))));
          return (
            <Item key={ name } label={ name } isLoading={ isLoading } isCode>
              { JSON.stringify(decimalValues) }
            </Item>
          );
        }));
      }
      if (strings.length > 0) {
        elements.push(...strings.map(({ name, values }) => {
          return (
            <Item key={ name } label={ name } isLoading={ isLoading } isCode>
              { JSON.stringify(values) }
            </Item>
          );
        }));
      }
      if (jsons.length > 0) {
        elements.push(...jsons.map(({ name, value }) => {
          return (
            <Item key={ name } label={ name } isLoading={ isLoading } isCode>
              { JSON.stringify(JSON.parse(value)) }
            </Item>
          );
        }));
      }

      if (elements.length > 0) {
        return <Container>{ elements }</Container>;
      }
    }

    const llmChatResponse = convertArrayToLLMChatResponse(value);
    if (llmChatResponse) {
      const { finishReason, message } = llmChatResponse;
      return (
        <Container>
          <Item label="Finish Reason" isLoading={ isLoading }>
            { finishReason }
          </Item>
          <Item isLoading={ isLoading }>
            <Container direction="column" rowGap={ 2 }>
              <Item label="Role">
                { message.role }
              </Item>
              <Item label="Content">
                { isEmpty(message.content) ? 'None' : message.content }
              </Item>
              <Item label="Name">
                { isEmpty(message.name) ? 'None' : message.name }
              </Item>
              <Item label="Tool Call ID">
                { isEmpty(message.toolCallId) ? 'None' : message.toolCallId }
              </Item>

              <Item label="Tool Calls">
                { isEmpty(message.toolCalls) ? 'None' : (
                  <Accordion defaultIndex={ range(0, message.toolCalls.length) } allowMultiple>
                    { message.toolCalls.map(({ id, name, arguments: args }, index) => {
                      if (args.length === 0) {
                        return;
                      }
                      const decoded = JSON.parse(args);

                      return (
                        <AccordionItem key={ id + index }>
                          <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                              { name }
                            </Box>
                            <AccordionIcon/>
                          </AccordionButton>
                          <AccordionPanel>
                            <Item isCode>
                              { JSON.stringify(decoded, null, 4) }
                            </Item>
                          </AccordionPanel>
                        </AccordionItem>
                      );
                    }) }
                  </Accordion>
                ) }
              </Item>
            </Container>
          </Item>
        </Container>
      );
    }
  } catch {}

  return (
    value &&
    (
      <Container>
        <Item isLoading={ isLoading }>
          { JSON.stringify(value, null, 4) }
        </Item>
      </Container>
    )
  );
};

export default InferenceOutput;
