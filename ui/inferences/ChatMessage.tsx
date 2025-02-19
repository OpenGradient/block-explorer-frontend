import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';
import { range } from 'es-toolkit';
import { isEmpty } from 'es-toolkit/compat';

import type { ChatMessage as ChatMessageType } from 'types/client/inference/llmChat';

import Item from './layout/Item';
import VStackContainer from './layout/VStackContainer';

const ChatMessage = ({ message }: { message: ChatMessageType }) => (
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
);

export default ChatMessage;
