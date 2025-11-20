import type { ConditionalValue } from '@chakra-ui/react';
import { Flex, Text, chakra, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';

import type { AddressParam } from 'types/api/addressParams';

import type { EntityProps } from 'ui/shared/entities/address/AddressEntity';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityWithTokenFilter from 'ui/shared/entities/address/AddressEntityWithTokenFilter';

type Mode = 'compact' | 'long';

interface Props {
  from: AddressParam;
  to: AddressParam | null;
  current?: string;
  mode?: Mode | ConditionalValue<Mode>;
  className?: string;
  isLoading?: boolean;
  tokenHash?: string;
  truncation?: EntityProps['truncation'];
  noIcon?: boolean;
  noCopy?: boolean;
}

const AddressFromTo = ({ from, to, current, mode: modeProp, className, isLoading, tokenHash = '', noIcon, noCopy }: Props) => {
  const mode = useBreakpointValue(
    {
      base: (typeof modeProp === 'object' && 'base' in modeProp ? modeProp.base : modeProp),
      lg: (typeof modeProp === 'object' && 'lg' in modeProp ? modeProp.lg : modeProp),
      xl: (typeof modeProp === 'object' && 'xl' in modeProp ? modeProp.xl : modeProp),
    },
  ) ?? 'long';

  const Entity = tokenHash ? AddressEntityWithTokenFilter : AddressEntity;

  if (mode === 'compact') {
    return (
      <Flex className={ className } flexDir="column" rowGap={ 2 }>
        <Flex alignItems="center" columnGap={ 2 }>
          <Text color="text.secondary" fontSize="xs" fontWeight="500">From</Text>
          <Entity
            address={ from }
            isLoading={ isLoading }
            noLink={ current === from.hash }
            noCopy={ noCopy ?? (current === from.hash) }
            noIcon={ noIcon }
            tokenHash={ tokenHash }
            truncation="constant"
            maxW="100%"
            w="min-content"
          />
        </Flex>
        { to && (
          <Flex alignItems="center" columnGap={ 2 }>
            <Text color="text.secondary" fontSize="xs" fontWeight="500">To</Text>
            <Entity
              address={ to }
              isLoading={ isLoading }
              noLink={ current === to.hash }
              noCopy={ noCopy ?? (current === to.hash) }
              noIcon={ noIcon }
              tokenHash={ tokenHash }
              truncation="constant"
              maxW="100%"
              w="min-content"
            />
          </Flex>
        ) }
      </Flex>
    );
  }

  const isOutgoing = current === from.hash;

  return (
    <Flex className={ className } alignItems="center" columnGap={ 3 } flexWrap="wrap">
      <Flex alignItems="center" columnGap={ 2 }>
        <Text color="text.secondary" fontSize="xs" fontWeight="500">From</Text>
        <Entity
          address={ from }
          isLoading={ isLoading }
          noLink={ isOutgoing }
          noCopy={ noCopy ?? isOutgoing }
          noIcon={ noIcon }
          tokenHash={ tokenHash }
          truncation="constant"
        />
      </Flex>
      { to && (
        <Flex alignItems="center" columnGap={ 2 }>
          <Text color="text.secondary" fontSize="xs" fontWeight="500">To</Text>
          <Entity
            address={ to }
            isLoading={ isLoading }
            noLink={ current === to.hash }
            noCopy={ noCopy ?? (current === to.hash) }
            noIcon={ noIcon }
            tokenHash={ tokenHash }
            truncation="constant"
          />
        </Flex>
      ) }
    </Flex>
  );
};

export default chakra(AddressFromTo);
