import { Box, Flex, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';

interface Props {
  isLoading?: boolean;
  className?: string;
}

const TestnetWarning = ({ isLoading, className }: Props) => {
  if (!config.chain.isTestnet) {
    return null;
  }

  return (
    <Box
      className={ className }
      w="100%"
      px={ 4 }
      py={ 3 }
      bgGradient={{
        _light: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(217, 119, 6, 0.08) 100%)',
        _dark: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.15) 100%)',
      }}
      border="1px solid"
      borderColor={{
        _light: 'rgba(245, 158, 11, 0.2)',
        _dark: 'rgba(245, 158, 11, 0.3)',
      }}
      borderRadius="md"
      position="relative"
      overflow="hidden"
    >
      <Flex
        alignItems="center"
        gap={ 2.5 }
      >
        <Box
          position="relative"
          w="8px"
          h="8px"
          borderRadius="50%"
          bg="amber.500"
          boxShadow="0 0 8px rgba(245, 158, 11, 0.6)"
          _dark={{
            boxShadow: '0 0 10px rgba(245, 158, 11, 0.8)',
          }}
          animation="pulseOpacity 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
          flexShrink={ 0 }
        />
        <Skeleton loading={ isLoading }>
          <Text
            fontSize="13px"
            fontWeight={ 500 }
            letterSpacing="0.01em"
            color={{ _light: 'rgba(180, 83, 9, 0.95)', _dark: 'rgba(251, 191, 36, 0.95)' }}
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            This is a testnet transaction only
          </Text>
        </Skeleton>
      </Flex>
    </Box>
  );
};

export default React.memo(chakra(TestnetWarning));
