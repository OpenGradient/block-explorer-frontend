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

        return (
          <VStackContainer>
            { !isEmpty(numbers) && (
              <Item label={ `Numbers (${ numbers.length })` }>
                { isEmpty(numbers) ? 'None' : (
                  <AccordionRoot defaultValue={ numbers.map((_, i) => i.toString()) } multiple width="100%" border="transparent">
                    { numbers.map((number, index) => {

                      const values = number.values.map((v) => Number(v.value) / (10 ** Number(v.decimals)));
                      return (
                        <AccordionItem key={ index } value={ index.toString() }>
                          <AccordionItemTrigger indicatorPlacement="end">
                            <Box as="span" flex="1" textAlign="left">
                              { number.name }
                            </Box>
                          </AccordionItemTrigger>
                          <AccordionItemContent>
                            <Item isLoading={ isLoading } isCode>
                              { JSON.stringify(reshapeArray(values, number.shape.map(Number))) }
                              { /* { `${ JSON.stringify(reshapeArray(values, number.shape.map(Number))) }

Shape: [${ number.shape.map(String).join(',') }]` } */ }
                            </Item>
                          </AccordionItemContent>
                        </AccordionItem>
                      );
                    }) }
                  </AccordionRoot>
                ) }
              </Item>
            ) }

            { !isEmpty(strings) && (
              <Item label={ `Strings (${ strings.length })` }>
                <AccordionRoot defaultValue={ strings.map((_, i) => i.toString()) } multiple width="100%" border="transparent">
                  { strings.map((string, index) => {
                    return (
                      <AccordionItem key={ index } value={ index.toString() }>
                        <AccordionItemTrigger indicatorPlacement="end">
                          <Box as="span" flex="1" textAlign="left">
                            { string.name }
                          </Box>
                        </AccordionItemTrigger>
                        <AccordionItemContent>
                          <VStackContainer>
                            <Item isLoading={ isLoading } isCode>
                              { `[${ string.values.join(',') }]` }
                            </Item>
                          </VStackContainer>
                        </AccordionItemContent>
                      </AccordionItem>
                    );
                  }) }
                </AccordionRoot>
              </Item>
            ) }
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
