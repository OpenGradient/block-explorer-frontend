import { Grid, GridItem, useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import type { Log } from 'types/api/log';

import { decodePrecompileData } from 'lib/inferences/precompile';
import Skeleton from 'ui/shared/chakra/Skeleton';
import Tag from 'ui/shared/chakra/Tag';

import InferenceInput from './InferenceInput';
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

const InferenceItem = ({ preCompileData, decoded, isLoading }: Props) => {

  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  const renderGridItems = () => {
    const precompileDecodedData = decodePrecompileData(preCompileData);

    // console.log(precompileDecodedData);

    return (
      <>
        { precompileDecodedData && (
          <>
            <RowHeader isLoading={ isLoading }>
              Inference ID
            </RowHeader>
            <GridItem>
              <Tag>
                { precompileDecodedData.inferenceID }
              </Tag>
            </GridItem>

            <RowHeader isLoading={ isLoading }>
              Mode
            </RowHeader>
            <GridItem>
              <Tag>
                { precompileDecodedData.mode }
              </Tag>
            </GridItem>

            <RowHeader isLoading={ isLoading }>
              Model CID
            </RowHeader>
            <GridItem>
              <Tag>
                { precompileDecodedData.modelCID }
              </Tag>
            </GridItem>

            { precompileDecodedData.request && (
              <>
                <RowHeader isLoading={ isLoading }>
                  Input
                </RowHeader>
                <GridItem>
                  <InferenceInput value={ precompileDecodedData.request } isLoading={ isLoading }/>
                </GridItem>
              </>
            ) }
          </>
        ) }

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
