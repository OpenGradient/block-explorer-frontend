import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { AddressParam } from 'types/api/addressParams';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { NOVES_TRANSLATE } from 'stubs/noves/NovesTranslate';
import { TX_INTERPRETATION } from 'stubs/txInterpretation';
import { Badge } from 'toolkit/chakra/badge';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import AppActionButton from 'ui/shared/AppActionButton/AppActionButton';
import useAppActionData from 'ui/shared/AppActionButton/useAppActionData';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import { TX_ACTIONS_BLOCK_ID } from 'ui/shared/DetailedInfo/DetailedInfoActionsWrapper';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import TxInterpretation from 'ui/shared/tx/interpretation/TxInterpretation';

import { createNovesSummaryObject } from './assetFlows/utils/createNovesSummaryObject';
import type { TxQuery } from './useTxQuery';

type Props = {
  hash: string;
  hasTag: boolean;
  txQuery: TxQuery;
};

const feature = config.features.txInterpretation;

const TxSubHeading = ({ hash, hasTag, txQuery }: Props) => {
  const hasInterpretationFeature = feature.isEnabled;
  const isNovesInterpretation = hasInterpretationFeature && feature.provider === 'noves';

  const appActionData = useAppActionData(txQuery.data?.to?.hash, !txQuery.isPlaceholderData);

  const txInterpretationQuery = useApiQuery('tx_interpretation', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && (hasInterpretationFeature && !isNovesInterpretation),
      placeholderData: TX_INTERPRETATION,
    },
  });

  const novesInterpretationQuery = useApiQuery('noves_transaction', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && isNovesInterpretation,
      placeholderData: NOVES_TRANSLATE,
    },
  });

  const hasNovesInterpretation = isNovesInterpretation &&
    (novesInterpretationQuery.isPlaceholderData || Boolean(novesInterpretationQuery.data?.classificationData.description));

  const hasInternalInterpretation = (hasInterpretationFeature && !isNovesInterpretation) &&
  (txInterpretationQuery.isPlaceholderData || Boolean(txInterpretationQuery.data?.data.summaries.length));

  const hasViewAllInterpretationsLink =
    !txInterpretationQuery.isPlaceholderData && txInterpretationQuery.data?.data.summaries && txInterpretationQuery.data?.data.summaries.length > 1;

  const addressDataMap: Record<string, AddressParam> = {};
  [ txQuery.data?.from, txQuery.data?.to ]
    .filter((data): data is AddressParam => Boolean(data && data.hash))
    .forEach(data => {
      addressDataMap[data.hash] = data;
    });

  const content = (() => {
    if (hasNovesInterpretation && novesInterpretationQuery.data) {
      const novesSummary = createNovesSummaryObject(novesInterpretationQuery.data);
      return (
        <TxInterpretation
          summary={ novesSummary }
          isLoading={ novesInterpretationQuery.isPlaceholderData || txQuery.isPlaceholderData }
          addressDataMap={ addressDataMap }
          fontSize="lg"
          mr={{ base: 0, lg: 2 }}
          isNoves
        />
      );
    } else if (hasInternalInterpretation) {
      return (
        <Flex mr={{ base: 0, lg: 2 }} flexWrap="wrap" alignItems="center">
          <TxInterpretation
            summary={ txInterpretationQuery.data?.data.summaries[0] }
            isLoading={ txInterpretationQuery.isPlaceholderData || txQuery.isPlaceholderData }
            addressDataMap={ addressDataMap }
            fontSize="lg"
            mr={ hasViewAllInterpretationsLink ? 3 : 0 }
          />
          { hasViewAllInterpretationsLink &&
          <Link href={ `#${ TX_ACTIONS_BLOCK_ID }` }>View all</Link> }
        </Flex>
      );
    } else if (hasInterpretationFeature && txQuery.data?.method && txQuery.data?.from && txQuery.data?.to) {
      return (
        <TxInterpretation
          summary={{
            summary_template: `{sender_hash} ${ txQuery.data.status === 'error' ? 'failed to call' : 'called' } {method} on {receiver_hash}`,
            summary_template_variables: {
              sender_hash: {
                type: 'address',
                value: txQuery.data.from,
              },
              method: {
                type: 'method',
                value: txQuery.data.method,
              },
              receiver_hash: {
                type: 'address',
                value: txQuery.data.to,
              },
            },
          }}
          isLoading={ txQuery.isPlaceholderData }
          fontSize="lg"
          mr={{ base: 0, lg: 2 }}
        />
      );
    } else {
      return (
        <Flex
          alignItems="center"
          gap={ 2.5 }
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          <Skeleton loading={ txQuery.isPlaceholderData }>
            <Flex
              alignItems="center"
              gap={ 2 }
            >
              <Badge
                colorPalette="gray"
                fontSize={{ base: '13px', md: '14px' }}
                fontWeight={ 500 }
                px={ 3 }
                py={ 1.5 }
                fontFamily="mono"
                letterSpacing="0.02em"
                bgGradient={{
                  _light: 'linear-gradient(135deg, rgba(30, 58, 138, 0.06) 0%, rgba(51, 65, 85, 0.08) 100%)',
                  _dark: 'linear-gradient(135deg, rgba(30, 58, 138, 0.12) 0%, rgba(51, 65, 85, 0.16) 100%)',
                }}
                border="1px solid"
                borderColor={{
                  _light: 'rgba(30, 58, 138, 0.15)',
                  _dark: 'rgba(148, 163, 184, 0.2)',
                }}
                color={{ _light: 'rgba(30, 58, 138, 0.95)', _dark: 'rgba(255, 255, 255, 0.95)' }}
              >
                <HashStringShortenDynamic hash={ hash }/>
              </Badge>
              <CopyToClipboard text={ hash } isLoading={ txQuery.isPlaceholderData }/>
            </Flex>
          </Skeleton>
        </Flex>
      );
    }
  })();

  const isLoading =
    txQuery.isPlaceholderData ||
    (hasNovesInterpretation && novesInterpretationQuery.isPlaceholderData) ||
    (hasInternalInterpretation && txInterpretationQuery.isPlaceholderData);

  return (
    <Box display={{ base: 'block', lg: 'flex' }} alignItems="center" w="100%" gap={ 4 }>
      <Box
        flex="1"
        minW={ 0 }
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        { content }
      </Box>
      <Flex
        alignItems="center"
        justifyContent={{ base: 'start', lg: 'flex-end' }}
        gap={ 3 }
        mt={{ base: 3, lg: 0 }}
        flexShrink={ 0 }
      >
        { !hasTag && <AccountActionsMenu isLoading={ isLoading }/> }
        { appActionData && (
          <AppActionButton data={ appActionData } txHash={ hash } source="Txn"/>
        ) }
        <NetworkExplorers type="tx" pathParam={ hash }/>
      </Flex>
    </Box>
  );
};

export default TxSubHeading;
