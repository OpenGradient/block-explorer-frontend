import { Text, Box } from '@chakra-ui/react';
import React from 'react';

import type { SchedulerTask } from 'lib/opengradient/contracts/scheduler';
import { formatPrettyTimestamp } from 'lib/opengradient/datetime';
import Skeleton from 'ui/shared/chakra/Skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  task: SchedulerTask;
  isLoading?: boolean;
};

const Label = ({ value, isLoading }: { value: string; isLoading?: boolean }) => (
  <Skeleton mb={{ base: 2 }} isLoaded={ !isLoading } /* display="inline-block" */><Text fontWeight="semibold">{ value }</Text></Skeleton>
);

/** Rendered on mobile screens only. */
const WorkflowsListItem = ({
  task,
  isLoading,
}: Props) => {
  const { user, contractAddress, endTime, frequency } = task;

  const endTimePretty = formatPrettyTimestamp(Number(endTime));

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
        <Label value="Frequency" isLoading={ isLoading }/>
        <Skeleton isLoaded={ !isLoading }>
          <Text>{ `${ Number(frequency) / 60 }s` }</Text>
        </Skeleton>
      </Box>

      <Box>
        <Label value="End Time" isLoading={ isLoading }/>
        <Skeleton isLoaded={ !isLoading }>
          <Text>{ `${ endTimePretty.fullDate } (${ endTimePretty.relativeTime })` }</Text>
        </Skeleton>
      </Box>
    </ListItemMobile>
  );
};

export default WorkflowsListItem;
