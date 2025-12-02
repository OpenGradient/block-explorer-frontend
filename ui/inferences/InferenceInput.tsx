import { Box } from '@chakra-ui/react';
import { isNil } from 'es-toolkit';
import { isEmpty } from 'es-toolkit/compat';
import React from 'react';

import { isLLMChatRequest } from 'lib/inferences/llmChat/request';
import { isLLMCompletionRequest } from 'lib/inferences/llmCompletion/typeGuard';
import type { PrecompileDecodedData } from 'lib/inferences/precompile';
import { isModelInput } from 'lib/inferences/traditional/typeGuards';
import reshapeArray from 'lib/reshapeArray';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from 'toolkit/chakra/accordion';
import { Tag } from 'toolkit/chakra/tag';

import ChatMessage from './ChatMessage';
import Item from './layout/Item';
import VStackContainer from './layout/VStackContainer';

interface InferenceInputProps {
  value: PrecompileDecodedData['request'];
  isLoading?: boolean;
}

const InferenceInput = ({ value, isLoading }: InferenceInputProps) => {
  try {
    if (value) {
      if (isLLMChatRequest(value)) {
        const {
          messages,
          tools,
          toolChoice,
          maxTokens,
          stopSequence,
          temperature } = value;
        return (
          <VStackContainer>
            <Item label={ `Messages (${ messages.length })` }>
              { isEmpty(messages) ? 'None' : (
                <AccordionRoot defaultValue={ messages.map((_, i) => i.toString()) } multiple width="100%" border="transparent">
                  { messages.map((message, index) => {
                    return (
                      <AccordionItem key={ index } value={ index.toString() }>
                        <AccordionItemTrigger indicatorPlacement="end">
                          <Box as="span" flex="1" textAlign="left">
                            { `Message ${ index + 1 }` }
                          </Box>
                        </AccordionItemTrigger>
                        <AccordionItemContent>
                          <ChatMessage message={ message }/>
                        </AccordionItemContent>
                      </AccordionItem>
                    );
                  }) }
                </AccordionRoot>
              ) }
            </Item>

            <Item label="Max Tokens">
              { maxTokens.toString() }
            </Item>

            <Item label="Temperature">
              { temperature.toString() }
            </Item>

            <Item label="Stop Sequence">
              <Tag>
                { JSON.stringify(stopSequence) }
              </Tag>
            </Item>

            <Item label="Tool Choice">
              { isNil(toolChoice) ? 'None' : toolChoice }
            </Item>

            <Item label="Tools">
              { isEmpty(tools) ? 'None' : (
                <AccordionRoot defaultValue={ tools.map((_, i) => i.toString()) } multiple>
                  { tools.map((tool, index) => {
                    return (
                      <AccordionItem key={ index } value={ index.toString() }>
                        <AccordionItemTrigger indicatorPlacement="end">
                          <Box as="span" flex="1" textAlign="left">
                            { tool.name }
                          </Box>
                        </AccordionItemTrigger>
                        <AccordionItemContent>
                          <VStackContainer>
                            <Item label="Name" isLoading={ isLoading }>
                              { tool.name }
                            </Item>
                            <Item label="Description" isLoading={ isLoading }>
                              { tool.description }
                            </Item>
                            <Item label="Parameters" isLoading={ isLoading }>
                              <Tag>{ tool.parameters }</Tag>
                            </Item>
                          </VStackContainer>
                        </AccordionItemContent>
                      </AccordionItem>
                    );
                  }) }
                </AccordionRoot>
              ) }
            </Item>
          </VStackContainer>
        );
      } else if (isModelInput(value)) {
        const { numbers, strings } = value;

        const allItems: Array<React.ReactNode> = [];

        if (!isEmpty(numbers)) {
          numbers.forEach((number, index) => {
            const values = number.values.map((v) => Number(v.value) / (10 ** Number(v.decimals)));
            allItems.push(
              <VStackContainer key={ `number-${ index }` }>
                <Item label="Name" isLoading={ isLoading }>
                  { number.name }
                </Item>
                <Item label="Value" isLoading={ isLoading } isCode>
                  { JSON.stringify(reshapeArray(values, number.shape.map(Number))) }
                  { /* { `${ JSON.stringify(reshapeArray(values, number.shape.map(Number))) }

Shape: [${ number.shape.map(String).join(',') }]` } */ }
                </Item>
                <Item label="Type" isLoading={ isLoading }>
                  number
                </Item>
              </VStackContainer>,
            );
          });
        }

        if (!isEmpty(strings)) {
          strings.forEach((string, index) => {
            allItems.push(
              <VStackContainer key={ `string-${ index }` }>
                <Item label="Name" isLoading={ isLoading }>
                  { string.name }
                </Item>
                <Item label="Value" isLoading={ isLoading } isCode>
                  { `[${ string.values.join(',') }]` }
                </Item>
                <Item label="Type" isLoading={ isLoading }>
                  string
                </Item>
              </VStackContainer>,
            );
          });
        }

        return (
          <VStackContainer>
            { allItems.length > 0 ? allItems : 'None' }
          </VStackContainer>
        );
      } else if (isLLMCompletionRequest(value)) {
        const { prompt, maxTokens, stopSequence, temperature } = value;
        return (
          <VStackContainer>
            <Item label="Prompt">
              { prompt }
            </Item>

            <Item label="Max Tokens">
              { maxTokens.toString() }
            </Item>

            <Item label="Temperature">
              { temperature.toString() }
            </Item>

            <Item label="Stop Sequence">
              <Tag>
                { JSON.stringify(stopSequence) }
              </Tag>
            </Item>
          </VStackContainer>
        );
      }
    }

    return <div>TODO</div>;
  } catch {
    return 'None';
  }
};

export default InferenceInput;
