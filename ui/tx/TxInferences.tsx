import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import type { DecodedInput } from 'types/api/decodedInput';
import type { Log } from 'types/api/log';
import { InferenceEvents } from 'types/client/inference/event';

import { SUPPORTED_INFERENCE_ADDRESSES } from 'lib/inferences/address';
import { getInferenceEvent } from 'lib/inferences/event';
import { LOG } from 'stubs/log';
import { generateListStub } from 'stubs/utils';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from 'toolkit/chakra/accordion';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Skeleton } from 'toolkit/chakra/skeleton';
import InferenceItem from 'ui/inferences/InferenceItem';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
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
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const hoverBgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

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

  // if (logsFilter) {
  //   items = (data?.items ?? []).filter(logsFilter);
  // }

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

  const inferenceHubLogs = items.map((item, index) => {
    const prevItem = index > 0 ? items[index - 1] : undefined;

    if (item.address.hash === SUPPORTED_INFERENCE_ADDRESSES.InferenceHub && prevItem?.address.hash === SUPPORTED_INFERENCE_ADDRESSES.Precompile) {
      return {
        ...item,
        preCompileData: prevItem.data,
      };
    }

    return item;
  }).filter((i) => i.address.hash === SUPPORTED_INFERENCE_ADDRESSES.InferenceHub);

  if (!inferenceHubLogs.length && !isPlaceholderData) {
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
        <AccordionRoot defaultValue={ inferenceHubLogs.map((it) => calculateAccordionKeyValue(it.address.hash, it.index)) } multiple>
          { inferenceHubLogs.map((item, index) => {
            const keyValue = calculateAccordionKeyValue(item.address.hash, item.index);
            const inferenceType = renderInferenceType(item.decoded);
            const headerLabel = `${ inferenceType } #${ index + 1 }`;

            return (
              <AccordionItem key={ keyValue } value={ keyValue }>
                <AccordionItemTrigger
                  indicatorPlacement="end"
                  mb={ 4 }
                  bgColor={ bgColor }
                  borderWidth="1px"
                  borderColor={ borderColor }
                  borderRadius="md"
                  px={ 4 }
                  py={ 3 }
                  fontWeight={ 600 }
                  _hover={{
                    bgColor: hoverBgColor,
                  }}
                >
                  <Box as="span" flex="1" textAlign="left">
                    { headerLabel }
                  </Box>
                </AccordionItemTrigger>
                <AccordionItemContent>
                  <InferenceItem
                    { ...item }
                    type="transaction"
                    isLoading={ isPlaceholderData }
                  />
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
