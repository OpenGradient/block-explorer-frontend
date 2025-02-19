import { Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from '@chakra-ui/react';
import { isNil, range } from 'es-toolkit';
import { isEmpty } from 'es-toolkit/compat';
import React from 'react';

import { isLLMChatRequest } from 'lib/inferences/llmChat/request';
import { isLLMCompletionRequest } from 'lib/inferences/llmCompletion/typeGuard';
import type { PrecompileDecodedData } from 'lib/inferences/precompile';
import { isModelInput } from 'lib/inferences/traditional/typeGuards';
import reshapeArray from 'lib/reshapeArray';
import Tag from 'ui/shared/chakra/Tag';

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
                <Accordion defaultIndex={ range(0, messages.length) } allowMultiple width="100%" border="transparent">
                  { messages.map((message, index) => {
                    return (
                      <AccordionItem key={ index }>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            { `Message ${ index + 1 }` }
                          </Box>
                          <AccordionIcon/>
                        </AccordionButton>
                        <AccordionPanel>
                          <ChatMessage message={ message }/>
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  }) }
                </Accordion>
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
                <Accordion defaultIndex={ range(0, tools.length) } allowMultiple>
                  { tools.map((tool, index) => {
                    return (
                      <AccordionItem key={ index }>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            { tool.name }
                          </Box>
                          <AccordionIcon/>
                        </AccordionButton>
                        <AccordionPanel>
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
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  }) }
                </Accordion>
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
                  <Accordion defaultIndex={ range(0, numbers.length) } allowMultiple width="100%" border="transparent">
                    { numbers.map((number, index) => {

                      const values = number.values.map((v) => Number(v.value) / (10 ** Number(v.decimals)));
                      return (
                        <AccordionItem key={ index }>
                          <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                              { number.name }
                            </Box>
                            <AccordionIcon/>
                          </AccordionButton>
                          <AccordionPanel>
                            <VStackContainer>
                              <Item isLoading={ isLoading } isCode>
                                { `${ JSON.stringify(reshapeArray(values, number.shape.map(Number))) }

Shape: [${ number.shape.map(String).join(',') }]` }
                              </Item>
                            </VStackContainer>
                          </AccordionPanel>
                        </AccordionItem>
                      );
                    }) }
                  </Accordion>
                ) }
              </Item>
            ) }

            { !isEmpty(strings) && (
              <Item label={ `Strings (${ strings.length })` }>
                <Accordion defaultIndex={ range(0, strings.length) } allowMultiple width="100%" border="transparent">
                  { strings.map((string, index) => {
                    return (
                      <AccordionItem key={ index }>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            { string.name }
                          </Box>
                          <AccordionIcon/>
                        </AccordionButton>
                        <AccordionPanel>
                          <VStackContainer>
                            <Item isLoading={ isLoading } isCode>
                              { `[${ string.values.join(',') }]` }
                            </Item>
                          </VStackContainer>
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  }) }
                </Accordion>
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
