import { Box } from '@chakra-ui/react';
import { isEmpty } from 'es-toolkit/compat';

import type { ChatMessage as ChatMessageType } from 'types/client/inference/llmChat';

import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from 'toolkit/chakra/accordion';

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
        <AccordionRoot defaultValue={ message.toolCalls.map((t, i) => t.id + i) } multiple>
          { message.toolCalls.map(({ id, name, arguments: args }, index) => {
            if (args.length === 0) {
              return;
            }
            const decoded = JSON.parse(args);

            return (
              <AccordionItem key={ id + index } value={ id + index }>
                <AccordionItemTrigger indicatorPlacement="end">
                  <Box as="span" flex="1" textAlign="left">
                    { name }
                  </Box>
                </AccordionItemTrigger>
                <AccordionItemContent>
                  <Item isCode>
                    { JSON.stringify(decoded, null, 4) }
                  </Item>
                </AccordionItemContent>
              </AccordionItem>
            );
          }) }
        </AccordionRoot>
      ) }
    </Item>
  </VStackContainer>
);

export default ChatMessage;
