import { Grid, GridItem, useColorModeValue, Alert, Link } from '@chakra-ui/react';
import React from 'react';

import type { Log } from 'types/api/log';
import { InferenceEvent } from 'types/client/inference';

import { route } from 'nextjs-routes';

// import searchIcon from 'icons/search.svg';
import { space } from 'lib/html-entities';
import { getInferenceEvent } from 'lib/inferences/utils';
import Skeleton from 'ui/shared/chakra/Skeleton';
import Tag from 'ui/shared/chakra/Tag';

import InferenceOutput from './InferenceOutput';

type Props = Log & {
  type: 'address' | 'transaction';
  isLoading?: boolean;
};

const RowHeader = ({ children, isLoading }: { children: React.ReactNode; isLoading?: boolean }) => (
  <GridItem _notFirst={{ my: { base: 4, lg: 0 } }}>
    <Skeleton fontWeight={ 500 } isLoaded={ !isLoading } /* display="inline-block" */>{ children }</Skeleton>
  </GridItem>
);

const InferenceItem = ({ address, decoded, type, isLoading }: Props) => {

  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  const renderInferenceType = () => {
    const event = getInferenceEvent(decoded?.method_call);
    if (event === InferenceEvent.InferenceResult) {
      return 'ML Inference';
    } else if (event === InferenceEvent.LLMChatResult || InferenceEvent.LLMCompletionResult) {
      return 'LLM Inference';
    }

    return 'ML Inference';
  };

  return (
    decoded &&
    (
      <Grid
        gridTemplateColumns={{ base: 'minmax(0, 1fr)', lg: '200px minmax(0, 1fr)' }}
        gap={{ base: 2, lg: 8 }}
        py={ 8 }
        _notFirst={{
          borderTopWidth: '1px',
          borderTopColor: borderColor,
        }}
        _first={{
          pt: 0,
        }}
      >
        { !decoded && !address.is_verified && type === 'transaction' && (
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <Alert status="warning" display="inline-table" whiteSpace="normal">
              To see accurate decoded input data, the contract must be verified.{ space }
              <Link href={ route({ pathname: '/address/[hash]/contract-verification', query: { hash: address.hash } }) }>Verify the contract here</Link>
            </Alert>
          </GridItem>
        ) }
        <RowHeader isLoading={ isLoading }>Type</RowHeader>
        <GridItem display="flex" alignItems="center">
          <Tag isLoading={ isLoading } fontSize="md">{ renderInferenceType() }</Tag>
        </GridItem>

        <RowHeader isLoading={ isLoading }>
          Output
          { /* <Flex alignItems="center" justifyContent="space-between">
            Output
            <Skeleton isLoaded={ !isLoading } ml="auto" borderRadius="base">
              <Tooltip label="Parameter count">
                <Button variant="outline" colorScheme="gray" data-selected="true" size="sm" fontWeight={ 400 }>
                  { decoded.parameters.length }
                </Button>
              </Tooltip>
            </Skeleton>
          </Flex> */ }
        </RowHeader>
        <GridItem>
          { decoded.parameters.map((param) => (
            <InferenceOutput key={ param.name } value={ param.value } isLoading={ isLoading }/>
          )) }
        </GridItem>
      </Grid>
    )
  );
};

export default React.memo(InferenceItem);
