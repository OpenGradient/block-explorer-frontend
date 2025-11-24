import { Box, Flex, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import dayjs from 'lib/date/dayjs';
import type { SchedulerTask } from 'lib/opengradient/contracts/scheduler';
import { getReadWorkflowResultQueryKey, READ_WORKFLOW_RESULT_PLACEHOLDER_DATA, readWorkflowResult } from 'lib/opengradient/contracts/workflow';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import Code from 'ui/inferences/layout/Code';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as EntityBase from 'ui/shared/entities/base/components';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  task: SchedulerTask;
  isLoading?: boolean;
};

const Label = ({ value, isLoading }: { value: string; isLoading?: boolean }) => (
  <Skeleton mb={{ base: 2 }} loading={ isLoading } /* display="inline-block" */><Text fontWeight="semibold">{ value }</Text></Skeleton>
);

const WorkflowsListItem = ({
  task,
  isLoading,
}: Props) => {
  const { user, contractAddress, endTime, frequency } = task;

  const endTimeNumber = Number(endTime);
  const endTimeDate = dayjs.unix(endTimeNumber);
  const isExpired = endTimeNumber < Math.floor(Date.now() / 1000);
  const formattedEndTime = endTimeDate.format('MMM DD, YYYY');
  const fullEndTime = endTimeDate.format('llll');

  const { data: workflowResult, error, isPlaceholderData } = useQuery({
    queryKey: getReadWorkflowResultQueryKey(contractAddress),
    queryFn: async() => readWorkflowResult(contractAddress),
    placeholderData: READ_WORKFLOW_RESULT_PLACEHOLDER_DATA,
  });

  const renderLatestResult = () => {
    const modelOutput = workflowResult?.output;
    if (!modelOutput || error) {
      return null;
    }

    const { numbers, strings, jsons } = modelOutput;
    const parts: Array<string> = [];

    if (numbers.length > 0) {
      numbers.forEach(({ name, values }) => {
        const decimalValues = values.map((v) => (Number(v.value) / (10 ** Number(v.decimals))));
        parts.push(`${ name }: ${ JSON.stringify(decimalValues) }`);
      });
    }
    if (strings.length > 0) {
      strings.forEach(({ name, values }) => {
        parts.push(`${ name }: ${ JSON.stringify(values) }`);
      });
    }
    if (jsons.length > 0) {
      jsons.forEach(({ name, value }) => {
        parts.push(`${ name }: ${ JSON.stringify(JSON.parse(value)) }`);
      });
    }

    if (parts.length === 0) {
      return null;
    }

    return parts.join(', ');
  };

  return (
    <ListItemMobile rowGap={ 5 } py={ 8 }>
      <Box>
        <Label value="User Address" isLoading={ isLoading }/>
        <Skeleton loading={ isLoading }>
          <AddressEntity
            address={{ hash: user /* name: 'User address' */ }}
            isLoading={ isLoading }
            truncation="none"
          />
        </Skeleton>
      </Box>

      <Box>
        <Label value="Contract Address" isLoading={ isLoading }/>
        <Skeleton loading={ isLoading }>
          <AddressEntity
            address={{ hash: contractAddress, is_contract: true }}
            isLoading={ isLoading }
            truncation="none"
          />
        </Skeleton>
      </Box>

      <Box>
        <Label value="Latest Result" isLoading={ isPlaceholderData }/>
        <Code loading={ isPlaceholderData } p={ 2 } fontSize="xs" mt={ 2 } fontFamily="mono">
          { renderLatestResult() ?? 'N/A' }
        </Code>
      </Box>

      <Box>
        <Label value="Model CID" isLoading={ isPlaceholderData }/>
        <Skeleton loading={ isPlaceholderData }>
          { workflowResult?.modelCid ? (
            <Flex gap={ 2 } alignItems="center">
              <Link
                href={ `https://walruscan.com/mainnet/blob/${ workflowResult.modelCid }` }
                external
                fontSize="sm"
                fontWeight={ 600 }
                fontFamily="mono"
                color="link.default"
                _hover={{ textDecoration: 'underline' }}
              >
                { `${ workflowResult.modelCid.slice(0, 8) }...` }
              </Link>
              <EntityBase.Copy
                text={ workflowResult?.modelCid ?? '' }
              />
            </Flex>
          ) : <Text>N/A</Text> }
        </Skeleton>
      </Box>

      <Box>
        <Label value="Frequency" isLoading={ isLoading }/>
        <Skeleton loading={ isLoading }>
          <Text>{ `${ Number(frequency) / 60 }s` }</Text>
        </Skeleton>
      </Box>

      <Box>
        <Label value="End Time" isLoading={ isLoading }/>
        <Skeleton loading={ isLoading } mt={ 2 }>
          <Tooltip content={ fullEndTime }>
            <Text color={ isExpired ? 'text.secondary' : 'text.primary' } fontSize="sm">
              { formattedEndTime }
            </Text>
          </Tooltip>
        </Skeleton>
      </Box>
    </ListItemMobile>
  );
};

export default WorkflowsListItem;
