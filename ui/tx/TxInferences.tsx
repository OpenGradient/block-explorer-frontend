import { Box, Text, Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon } from '@chakra-ui/react';
import { range } from 'es-toolkit';
import React from 'react';

import type { DecodedInput } from 'types/api/decodedInput';
import type { Log } from 'types/api/log';
import { InferenceEvents } from 'types/client/inference/event';

import { SUPPORTED_INFERENCE_ADDRESSES } from 'lib/inferences/address';
import { getInferenceEvent } from 'lib/inferences/event';
import { LOG } from 'stubs/log';
import { generateListStub } from 'stubs/utils';
import InferenceItem from 'ui/inferences/InferenceItem';
import ActionBar from 'ui/shared/ActionBar';
import Skeleton from 'ui/shared/chakra/Skeleton';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';

import type { TxQuery } from './useTxQuery';

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

  return (
    <Box>
      { pagination.isVisible && (
        <ActionBar mt={ -6 }>
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
      <Skeleton isLoaded={ !isPlaceholderData }>
        <Accordion defaultIndex={ range(0, items.length) } allowMultiple>
          { inferenceHubLogs.map((item) => (
            <AccordionItem key={ `${ item.address.hash }-${ item.index }` }>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  { renderInferenceType(item.decoded) }
                </Box>
                <AccordionIcon/>
              </AccordionButton>
              <AccordionPanel>
                <InferenceItem
                  { ...item }
                  type="transaction"
                  isLoading={ isPlaceholderData }
                />
              </AccordionPanel>
            </AccordionItem>
          )) }
        </Accordion>
      </Skeleton>
    </Box>
  );
};

export default TxInferences;
