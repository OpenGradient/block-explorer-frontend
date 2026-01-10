import { Grid, GridItem, Flex } from '@chakra-ui/react';
import React from 'react';

import type { Log } from 'types/api/log';

import { route } from 'nextjs-routes';

import { space } from 'lib/html-entities';
import { Alert } from 'toolkit/chakra/alert';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import InferenceOutput from './InferenceOutput';
import Item from './layout/Item';
import VStackContainer from './layout/VStackContainer';

// Convert camelCase or snake_case to Title Case with spaces
const formatFieldName = (name: string): string => {
  return name
    // Insert space before capital letters (camelCase)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Replace underscores with spaces (snake_case)
    .replace(/_/g, ' ')
    // Capitalize first letter of each word
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// Field descriptions for common settlement parameters
const fieldDescriptions: Record<string, string> = {
  batchSize: 'The number of LLM inferences settled and verified in this batch',
  merkleRoot: 'The merkle root hash of the LLM inference results and proofs',
  modelId: 'Identifier of the AI model used for inference',
  requestId: 'Unique identifier for this inference request',
  input: 'The input data provided to the model',
  output: 'The result returned by the model',
  timestamp: 'When this inference was executed',
  caller: 'The address that initiated this inference',
  callback: 'The callback address for receiving results',
  gasUsed: 'Amount of gas consumed by this operation',
  fee: 'The fee paid for this inference',
  status: 'Current status of the inference request',
  proof: 'Cryptographic proof of inference execution',
  result: 'The final result of the inference',
  data: 'Raw data associated with this event',
};

type Props = Log & {
  type: 'address' | 'transaction';
  isLoading?: boolean;
};

const RowHeader = ({ children, isLoading, tooltip }: { children: React.ReactNode; isLoading?: boolean; tooltip?: string }) => (
  <GridItem
    _notFirst={{ mt: { base: 4, lg: 0 } }}
    display="flex"
    alignItems={{ base: 'flex-start', lg: 'flex-start' }}
    pt={{ base: 0, lg: 1 }}
  >
    <Flex alignItems="center" gap={ 1 }>
      <Skeleton fontWeight={ 500 } loading={ isLoading }>{ children }</Skeleton>
      { tooltip && !isLoading && (
        <Tooltip content={ tooltip }>
          <IconSvg
            name="info"
            boxSize={ 4 }
            color="icon.info"
            cursor="pointer"
            flexShrink={ 0 }
          />
        </Tooltip>
      ) }
    </Flex>
  </GridItem>
);

const SettlementInferenceItem = ({ type, address, decoded, isLoading }: Props) => {
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  const renderGridItems = () => {
    return (
      <>
        { decoded?.parameters && decoded.parameters.length > 0 && (
          <>
            { decoded.parameters.map((param, index) => {
              const fieldName = param.name || `Parameter ${ index + 1 }`;
              const displayName = param.name ? formatFieldName(param.name) : fieldName;
              const tooltip = param.name ? fieldDescriptions[param.name] : undefined;

              return (
                <React.Fragment key={ param.name || index }>
                  <RowHeader isLoading={ isLoading } tooltip={ tooltip }>
                    { displayName }
                  </RowHeader>
                  <GridItem>
                    <InferenceOutput value={ param.value } isLoading={ isLoading }/>
                  </GridItem>
                </React.Fragment>
              );
            }) }
          </>
        ) }

        { !decoded && !address.is_verified && type === 'transaction' && (
          <>
            <RowHeader isLoading={ isLoading }>
              Output
            </RowHeader>
            <GridItem>
              <Alert status="warning" display="inline-table" whiteSpace="normal">
                To see accurate decoded input data, the contract must be verified.{ space }
                <Link href={ route({ pathname: '/address/[hash]/contract-verification', query: { hash: address.hash } }) }>Verify the contract here</Link>
              </Alert>
            </GridItem>
          </>
        ) }

        { !decoded?.parameters && decoded && (
          <>
            <RowHeader isLoading={ isLoading }>
              Data
            </RowHeader>
            <GridItem>
              <VStackContainer>
                <Item isLoading={ isLoading } isCode>
                  { JSON.stringify(decoded, null, 2) }
                </Item>
              </VStackContainer>
            </GridItem>
          </>
        ) }
      </>
    );
  };

  return (
    <Grid
      gridTemplateColumns={{ base: 'minmax(0, 1fr)', lg: '200px minmax(0, 1fr)' }}
      gap={{ base: 2, lg: 8 }}
      py={ 8 }
      alignItems={{ base: 'flex-start', lg: 'flex-start' }}
      _notFirst={{
        borderTopWidth: '1px',
        borderTopColor: borderColor,
      }}
      _first={{
        pt: 0,
      }}
    >
      { renderGridItems() }
    </Grid>
  );
};

export default React.memo(SettlementInferenceItem);
