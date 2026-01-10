import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { Log } from 'types/api/log';

import { route } from 'nextjs-routes';

import { space } from 'lib/html-entities';
import { Alert } from 'toolkit/chakra/alert';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';

import InferenceOutput from './InferenceOutput';
import Item from './layout/Item';
import VStackContainer from './layout/VStackContainer';

type Props = Log & {
  type: 'address' | 'transaction';
  isLoading?: boolean;
};

const RowHeader = ({ children, isLoading }: { children: React.ReactNode; isLoading?: boolean }) => (
  <GridItem _notFirst={{ my: { base: 4, lg: 0 } }}>
    <Skeleton fontWeight={ 500 } loading={ isLoading }>{ children }</Skeleton>
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
              // Skip the first parameter if it's the event name/identifier
              // Display all parameters as key-value pairs
              return (
                <React.Fragment key={ param.name || index }>
                  <RowHeader isLoading={ isLoading }>
                    { param.name || `Parameter ${ index + 1 }` }
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
                <Item isLoading={ isLoading }>
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
