import { Text, Box, Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { SchedulerTask } from 'lib/opengradient/contracts/scheduler';
import { getReadWorkflowResultQueryKey, READ_WORKFLOW_RESULT_PLACEHOLDER_DATA, readWorkflowResult } from 'lib/opengradient/contracts/workflow';
import { formatTimestamp, getRelativeTime } from 'lib/opengradient/datetime';
import Code from 'ui/inferences/layout/Code';
import Skeleton from 'ui/shared/chakra/Skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as EntityBase from 'ui/shared/entities/base/components';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  task: SchedulerTask;
  isLoading?: boolean;
};

const Label = ({ value, isLoading }: { value: string; isLoading?: boolean }) => (
  <Skeleton mb={{ base: 2 }} isLoaded={ !isLoading } /* display="inline-block" */><Text fontWeight="semibold">{ value }</Text></Skeleton>
);

const WorkflowsListItem = ({
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

    return nameToValues.join('\n');
  };

  return (
    <ListItemMobile rowGap={ 5 } py={ 8 }>
      <Box>
        <Label value="User Address" isLoading={ isLoading }/>
        <Skeleton isLoaded={ !isLoading }>
          <AddressEntity
            address={{ hash: user /* name: 'User address' */ }}
            isLoading={ isLoading }
            truncation="none"
          />
        </Skeleton>
      </Box>

      <Box>
        <Label value="Contract Address" isLoading={ isLoading }/>
        <Skeleton isLoaded={ !isLoading }>
          <AddressEntity
            address={{ hash: contractAddress, is_contract: true }}
            isLoading={ isLoading }
            truncation="none"
          />
        </Skeleton>
      </Box>

      <Box>
        <Label value="Latest Result" isLoading={ isPlaceholderData }/>
        <Code isLoaded={ !isPlaceholderData }>{ renderLatestResult() ?? 'N/A' }</Code>
      </Box>

      <Box>
        <Label value="Model CID" isLoading={ isPlaceholderData }/>
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
      </Box>

      <Box>
        <Label value="Frequency" isLoading={ isLoading }/>
        <Skeleton isLoaded={ !isLoading }>
          <Text>{ `${ Number(frequency) / 60 }s` }</Text>
        </Skeleton>
      </Box>

      <Box>
        <Label value="End Time" isLoading={ isLoading }/>
        <Skeleton isLoaded={ !isLoading }>
          <Text>{ `${ prettyEndTime } (${ relativeEndTime })` }</Text>
        </Skeleton>
      </Box>
    </ListItemMobile>
  );
};

export default WorkflowsListItem;
