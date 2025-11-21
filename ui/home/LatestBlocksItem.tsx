import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { Block } from 'types/api/block';

import config from 'configs/app';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import IconSvg from 'ui/shared/IconSvg';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

type Props = {
  block: Block;
  isLoading?: boolean;
  animation?: string;
};

const LatestBlocksItem = ({ block, isLoading, animation }: Props) => {
  return (
    <Box
      animation={ animation }
      py={{ base: 3, lg: 4 }}
      px={{ base: 3, lg: 4 }}
      width="100%"
      transition="opacity 0.2s ease"
      _hover={{
        opacity: 0.7,
      }}
    >
      <Flex alignItems="center" justifyContent="space-between" mb={ 2 }>
        <BlockEntity
          isLoading={ isLoading }
          number={ block.height }
          tailLength={ 2 }
          textStyle="sm"
          fontWeight={ 600 }
        />
        { block.celo?.is_epoch_block && (
          <Tooltip content={ `Finalized epoch #${ block.celo.epoch_number }` }>
            <IconSvg name="checkered_flag" boxSize={ 4 } p="1px" isLoading={ isLoading } flexShrink={ 0 }/>
          </Tooltip>
        ) }
        <TimeAgoWithTooltip
          timestamp={ block.timestamp }
          enableIncrement={ !isLoading }
          isLoading={ isLoading }
          color="text.secondary"
          textStyle="xs"
          flexShrink={ 0 }
        />
      </Flex>
      <Flex alignItems="center" gap={ 4 } textStyle="xs">
        <Skeleton loading={ isLoading } textStyle="xs" color="text.secondary">
          <Text as="span" fontWeight={ 500 }>Txn</Text>
          <Text as="span" ml={ 1.5 } fontWeight={ 600 } color="text.primary">
            { block.transaction_count }
          </Text>
        </Skeleton>
        { !config.features.rollup.isEnabled && !config.UI.views.block.hiddenFields?.miner && (
          <Skeleton loading={ isLoading } textStyle="xs">
            <Text as="span" color="text.secondary" textTransform="capitalize" fontWeight={ 500 }>
              { getNetworkValidatorTitle() }
            </Text>
            <Box as="span" ml={ 1.5 } display="inline-block">
              <AddressEntity
                address={ block.miner }
                isLoading={ isLoading }
                noIcon
                noCopy
                truncation="constant"
                textStyle="xs"
              />
            </Box>
          </Skeleton>
        ) }
      </Flex>
    </Box>
  );
};

export default LatestBlocksItem;
