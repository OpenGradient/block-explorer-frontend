import { Flex, Td, Text, Tr } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { SchedulerTask } from 'lib/opengradient/contracts/scheduler';
import { getReadWorkflowResultQueryKey, READ_WORKFLOW_RESULT_PLACEHOLDER_DATA, readWorkflowResult } from 'lib/opengradient/contracts/workflow';
import { formatTimestamp, getRelativeTime } from 'lib/opengradient/datetime';
import Code from 'ui/inferences/layout/Code';
import Skeleton from 'ui/shared/chakra/Skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as EntityBase from 'ui/shared/entities/base/components';

type Props = {
  task: SchedulerTask;
  isLoading?: boolean;
};

const WorkflowsTableItem = ({
  task,
  isLoading,
}: Props) => {

  const { user, contractAddress, endTime, frequency } = task;

  const prettyEndTime = formatTimestamp(Number(endTime));
  const relativeEndTime = getRelativeTime(Number(endTime), { addSuffix: true });

  const { data: workflowResult, error, isPlaceholderData } = useQuery({
    queryKey: getReadWorkflowResultQueryKey(contractAddress),
    queryFn: async() => readWorkflowResult(contractAddress),
    placeholderData: READ_WORKFLOW_RESULT_PLACEHOLDER_DATA,
  });

  const renderLatestResult = () => {
    const modelOutput = workflowResult?.output;
    if (!modelOutput || error) {
      return;
    }

    const { numbers, strings, jsons } = modelOutput;
    const nameToValues: Array<string> = [];
    if (numbers.length > 0) {
      nameToValues.push(...numbers.map(({ name, values }) => {
        const decimalValues = values.map((v) => (Number(v.value) / (10 ** Number(v.decimals))));
        return `${ name }: ${ JSON.stringify(decimalValues) }`;
      }));
    }
    if (strings.length > 0) {
      nameToValues.push(...strings.map(({ name, values }) => {
        return `${ name }: ${ JSON.stringify(values) }`;
      }));
    }
    if (jsons.length > 0) {
      nameToValues.push(...jsons.map(({ name, value }) => {
        return `${ name }: ${ JSON.stringify(JSON.parse(value)) }`;
      }));
    }

    if (nameToValues.length === 0) {
      return;
    }

    return nameToValues.join('\n');
  };

  return (
    <Tr
      role="group"
    >
      <Td>
        <Skeleton isLoaded={ !isLoading }>
          <AddressEntity
            address={{ hash: contractAddress, is_contract: true }}
            isLoading={ isLoading }
            truncation="constant_long"
          />
        </Skeleton>
      </Td>

      <Td>
        <Code isLoaded={ !isPlaceholderData }>{ renderLatestResult() ?? 'N/A' }</Code>
      </Td>

      <Td>
        <Skeleton isLoaded={ !isLoading }>
          <AddressEntity
            address={{ hash: user }}
            isLoading={ isLoading }
            truncation="constant_long"
          />
        </Skeleton>
      </Td>

      <Td>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { workflowResult?.modelCid ? (
            <Flex>
              <Text isTruncated>{ workflowResult.modelCid }</Text>
              <EntityBase.Copy
                text={ workflowResult?.modelCid ?? '' }
              />
            </Flex>
          ) : <Text>N/A</Text> }
        </Skeleton>
      </Td>

      <Td>
        <Skeleton isLoaded={ !isLoading }>
          <Text>{ `${ Number(frequency) / 60 }s` }</Text>
        </Skeleton>
      </Td>

      <Td>
        <Skeleton isLoaded={ !isLoading }>
          <Text>{ `${ prettyEndTime } (${ relativeEndTime })` }</Text>
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default WorkflowsTableItem;
