import { Accordion,
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
import { convertArrayToLLMCompletionResponse } from 'lib/inferences/llmCompletion';
import { convertArrayToModelOutput } from 'lib/inferences/traditional';

import Item from './layout/Item';
import VStackContainer from './layout/VStackContainer';

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
        return <VStackContainer>{ elements }</VStackContainer>;
      }
    }

    const llmChatResponse = convertArrayToLLMChatResponse(value);
    if (llmChatResponse) {
      const { finishReason, message } = llmChatResponse;
      return (
        <VStackContainer>
          <Item label="Finish Reason" isLoading={ isLoading }>
            { finishReason }
          </Item>
          <Item isLoading={ isLoading }>
            <VStackContainer direction="column" rowGap={ 2 }>
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
            </VStackContainer>
          </Item>
        </VStackContainer>
      );
    }

    const llmCompletionResponse = convertArrayToLLMCompletionResponse(value);
    if (llmCompletionResponse) {
      const { answer } = llmCompletionResponse;
      return answer.length > 0 ? (
        <Item isCode whiteSpace="pre-wrap">
          { llmCompletionResponse.answer }
        </Item>
      ) : 'None';
    }
  } catch {}

  return (
    value &&
    (
      <VStackContainer>
        <Item isLoading={ isLoading }>
          { JSON.stringify(value, null, 4) }
        </Item>
      </VStackContainer>
    )
  );
};

export default InferenceOutput;
