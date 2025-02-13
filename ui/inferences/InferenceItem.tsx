import { Grid, GridItem, useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import type { Log } from 'types/api/log';
import { InferenceEvents } from 'types/client/inference/event';

import { SUPPORTED_INFERENCE_ADDRESSES } from 'lib/inferences/address';
import { getInferenceEvent } from 'lib/inferences/event';
import { decodePrecompileData } from 'lib/inferences/precompile';
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

const InferenceItem = ({ address, data, decoded, isLoading }: Props) => {

  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  const renderGridItems = () => {
    if (address.hash === SUPPORTED_INFERENCE_ADDRESSES.Precompile) {
      const precompileDecoded = decodePrecompileData(data);
      const { data: { inferenceID, mode, modelCID } } = precompileDecoded;
      return (
        <>
          <RowHeader isLoading={ isLoading }>Event</RowHeader>
          <GridItem>
            <Tag isLoading={ isLoading }>{ precompileDecoded.event }</Tag>
          </GridItem>

          <RowHeader isLoading={ isLoading }>Inference ID</RowHeader>
          <GridItem>
            <Tag isLoading={ isLoading }>{ inferenceID }</Tag>
          </GridItem>

          <RowHeader isLoading={ isLoading }>Mode</RowHeader>
          <GridItem>
            <Skeleton isLoaded={ !isLoading }> { mode.toString() } </Skeleton>
          </GridItem>

          <RowHeader isLoading={ isLoading }>Model CID</RowHeader>
          <GridItem>
            <Tag isLoading={ isLoading }>{ modelCID }</Tag>
          </GridItem>
        </>
      );
    } else if (address.hash === SUPPORTED_INFERENCE_ADDRESSES.InferenceHub) {
      return (
        <>
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
            { decoded?.parameters.map((param) => (
              <InferenceOutput key={ param.name } value={ param.value } isLoading={ isLoading }/>
            )) }
          </GridItem>
        </>
      );
    }
  };

  const renderInferenceType = () => {
    const event = getInferenceEvent(decoded?.method_call);
    if (event === InferenceEvents.InferenceResult) {
      return 'ML Inference';
    } else if (event === InferenceEvents.LLMChatResult) {
      return 'LLM Chat Inference';
    } else if (event === InferenceEvents.LLMCompletionResult) {
      return 'LLM Completion Inference';
    }

    return 'ML Inference';
  };

  return (
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
      { renderGridItems() }
    </Grid>
  );
};

export default React.memo(InferenceItem);
