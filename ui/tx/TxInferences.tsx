import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { DecodedInput } from 'types/api/decodedInput';
import type { Log } from 'types/api/log';
import { InferenceEvents } from 'types/client/inference/event';

import { SUPPORTED_INFERENCE_ADDRESSES } from 'lib/inferences/address';
import { getInferenceEvent } from 'lib/inferences/event';
import { LOG } from 'stubs/log';
import { generateListStub } from 'stubs/utils';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from 'toolkit/chakra/accordion';
import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import InferenceItem from 'ui/inferences/InferenceItem';
import SettlementInferenceItem from 'ui/inferences/SettlementInferenceItem';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import IconSvg from 'ui/shared/IconSvg';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';

import type { TxQuery } from './useTxQuery';

const calculateAccordionKeyValue = (hash: string, index: number) => `${ hash }-${ index }`;

interface AccordionItem {
  label: string;
  content: React.ReactNode;
}

interface Props {
  txQuery: TxQuery;
  logsFilter?: (log: Log) => boolean;
}

const TxInferences = ({ txQuery, logsFilter }: Props) => {

  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'tx_logs',
    pathParams: { hash: txQuery.data?.hash },
    options: {
      enabled: !txQuery.isPlaceholderData && Boolean(txQuery.data?.hash) && Boolean(txQuery.data?.status),
      placeholderData: generateListStub<'tx_logs'>(LOG, 3, { next_page_params: null }),
    },
  });

  if (!txQuery.isPending && !txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  if (isError || txQuery.isError) {
    return <DataFetchAlert/>;
  }

  let items: Array<Log> = [];

  if (data?.items) {
    if (isPlaceholderData) {
      items = data?.items;
    } else {
      items = logsFilter ? data.items.filter(logsFilter) : data.items;
    }
  }

  if (!items.length) {
    return <Text as="span">There are no inferences for this transaction.</Text>;
  }

  const renderInferenceType = (decoded: DecodedInput | null) => {
    const event = getInferenceEvent(decoded?.method_call);
    if (event === InferenceEvents.InferenceResult) {
      return 'ML Inference';
    } else if (event === InferenceEvents.LLMChatResult) {
      return 'LLM Chat Inference';
    } else if (event === InferenceEvents.LLMCompletionResult) {
      return 'LLM Completion Inference';
    } else if (event === InferenceEvents.BatchSettlement) {
      return 'LLM Batch Settlement';
    } else if (event === InferenceEvents.InferenceSettlement) {
      return 'LLM Individual Settlement';
    } else if (event === InferenceEvents.SettlementWithMetadata) {
      return 'LLM Individual Settlement with Metadata';
    }

    return 'ML Inference';
  };

  const isSettlementInference = (decoded: DecodedInput | null): boolean => {
    const event = getInferenceEvent(decoded?.method_call);
    return event === InferenceEvents.BatchSettlement ||
           event === InferenceEvents.InferenceSettlement ||
           event === InferenceEvents.SettlementWithMetadata;
  };

  // Settlement logs come from LLMInference - no pairing needed
  // InferenceHub logs may need Precompile pairing
  const inferenceLogs = items
    .filter((item) =>
      item.address.hash === SUPPORTED_INFERENCE_ADDRESSES.InferenceHub ||
      item.address.hash === SUPPORTED_INFERENCE_ADDRESSES.LLMInference,
    )
    .map((item) => {
      // Settlement logs from LLMInference don't need precompile pairing
      if (item.address.hash === SUPPORTED_INFERENCE_ADDRESSES.LLMInference) {
        return item;
      }

      // For InferenceHub logs, check if previous log in original array is from Precompile
      const itemIndex = items.findIndex((log) => log === item);
      const prevItem = itemIndex > 0 ? items[itemIndex - 1] : undefined;

      if (prevItem?.address.hash === SUPPORTED_INFERENCE_ADDRESSES.Precompile) {
        return {
          ...item,
          preCompileData: prevItem.data,
        };
      }

      return item;
    });

  if (!inferenceLogs.length && !isPlaceholderData) {
    return <Text as="span">There are no inferences for this transaction.</Text>;
  }

  return (
    <Box>
      { pagination.isVisible && (
        <ActionBar mt={ -6 }>
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
      <Skeleton loading={ isPlaceholderData }>
        { /* Skeleton doesn't work for accordion, so this is a placeholder. */ }
        { isPlaceholderData && 'Loading...' }
        <AccordionRoot defaultValue={ inferenceLogs.map((it) => calculateAccordionKeyValue(it.address.hash, it.index)) } multiple>
          { inferenceLogs.map((item, index) => {
            const keyValue = calculateAccordionKeyValue(item.address.hash, item.index);
            const inferenceType = renderInferenceType(item.decoded);
            const isSettlement = isSettlementInference(item.decoded);

            return (
              <AccordionItem key={ keyValue } value={ keyValue }>
                <AccordionItemTrigger
                  indicatorPlacement="end"
                  mb={ 3 }
                  bgColor={{ _light: 'rgba(255, 255, 255, 0.8)', _dark: 'rgba(255, 255, 255, 0.04)' }}
                  borderWidth="1px"
                  borderColor={{ _light: 'gray.100', _dark: 'whiteAlpha.100' }}
                  borderRadius="xl"
                  px={ 5 }
                  py={ 4 }
                  fontWeight={ 500 }
                  transition="all 0.2s ease"
                  _hover={{
                    bgColor: { _light: 'rgba(255, 255, 255, 1)', _dark: 'rgba(255, 255, 255, 0.06)' },
                    borderColor: { _light: 'gray.200', _dark: 'whiteAlpha.200' },
                    boxShadow: { _light: '0 4px 12px rgba(0, 0, 0, 0.05)', _dark: '0 4px 12px rgba(0, 0, 0, 0.2)' },
                    transform: 'translateY(-1px)',
                  }}
                  _expanded={{
                    bgColor: { _light: 'rgba(255, 255, 255, 1)', _dark: 'rgba(255, 255, 255, 0.06)' },
                    borderColor: { _light: 'blue.200', _dark: 'blue.700' },
                    boxShadow: { _light: '0 4px 12px rgba(66, 153, 225, 0.1)', _dark: '0 4px 12px rgba(66, 153, 225, 0.15)' },
                  }}
                >
                  <Flex flex="1" alignItems="center" gap={ 3 } textAlign="left">
                    <Flex
                      alignItems="center"
                      justifyContent="center"
                      w={ 8 }
                      h={ 8 }
                      borderRadius="lg"
                      bgColor={{ _light: isSettlement ? 'purple.50' : 'blue.50', _dark: isSettlement ? 'purple.900' : 'blue.900' }}
                      flexShrink={ 0 }
                    >
                      <IconSvg
                        name={ isSettlement ? 'check' : 'lightning' }
                        boxSize={ 4 }
                        color={{ _light: isSettlement ? 'purple.500' : 'blue.500', _dark: isSettlement ? 'purple.300' : 'blue.300' }}
                      />
                    </Flex>
                    <Box>
                      <Text fontSize="sm" fontWeight={ 600 } color={{ _light: 'gray.800', _dark: 'gray.100' }}>
                        { inferenceType }
                      </Text>
                      <Text fontSize="xs" color={{ _light: 'gray.500', _dark: 'gray.400' }}>
                        Event #{ index + 1 }
                      </Text>
                    </Box>
                    <Badge
                      ml="auto"
                      mr={ 2 }
                      colorPalette={ isSettlement ? 'purple' : 'blue' }
                      variant="subtle"
                    >
                      { isSettlement ? 'Settlement' : 'Inference' }
                    </Badge>
                  </Flex>
                </AccordionItemTrigger>
                <AccordionItemContent pb={ 4 }>
                  { isSettlement ? (
                    <SettlementInferenceItem
                      { ...item }
                      type="transaction"
                      isLoading={ isPlaceholderData }
                    />
                  ) : (
                    <InferenceItem
                      { ...item }
                      type="transaction"
                      isLoading={ isPlaceholderData }
                    />
                  ) }
                </AccordionItemContent>
              </AccordionItem>
            );
          }) }
        </AccordionRoot>
      </Skeleton>
    </Box>
  );
};

export default TxInferences;
