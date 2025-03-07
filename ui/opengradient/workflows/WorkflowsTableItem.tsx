import { Td, Text, Tr } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { ModelOutput } from 'types/client/inference/traditional';

import type { SchedulerTask } from 'lib/opengradient/contracts/scheduler';
import { readWorkflowResult } from 'lib/opengradient/contracts/workflow';
import { formatTimestamp, getRelativeTime } from 'lib/opengradient/datetime';
import Code from 'ui/inferences/layout/Code';
import Skeleton from 'ui/shared/chakra/Skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

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

  const placeholderData: ModelOutput = React.useMemo(() => ({
    numbers: [ { name: 'Y', values: [ { value: '3774157376028597354888916016', decimals: '31' } ], shape: [ 1 ] } ],
    strings: [],
    jsons: [],
    isSimulationResult: true,
  }), []);
  const { data: workflowResult, error, isPlaceholderData } = useQuery({
    queryKey: [ 'opengradient', 'readWorkflowResult' ],
    queryFn: async() => readWorkflowResult(contractAddress),
    placeholderData,
  });

  const renderWorkflowResult = () => {
    if (!workflowResult || error) {
      return;
    }

    const { numbers, strings, jsons } = workflowResult;
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

    return nameToValues.join('\n');
  };

  return (
    <Tr
      role="group"
    >
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
        <Skeleton isLoaded={ !isLoading }>
          <AddressEntity
            address={{ hash: contractAddress, is_contract: true }}
            isLoading={ isLoading }
            truncation="constant_long"
          />
        </Skeleton>
      </Td>

      <Td>
        <Code isLoaded={ !isPlaceholderData }>{ renderWorkflowResult() ?? 'None' }</Code>
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
