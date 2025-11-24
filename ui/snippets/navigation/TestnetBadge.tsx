import { Box, chakra, Text } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';

interface Props {
  className?: string;
  ml?: number | string;
}

const TestnetBadge = ({ className, ml }: Props) => {
  if (!config.chain.isTestnet) {
    return null;
  }

  return (
    <Box
      className={ className }
      ml={ ml }
      display="inline-flex"
      alignItems="center"
      gap={ 1 }
      px={ 1.5 }
      py={ 0.5 }
      bgGradient={{
        _light: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%)',
        _dark: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.25) 100%)',
      }}
      border="1px solid"
      borderColor={{
        _light: 'rgba(239, 68, 68, 0.2)',
        _dark: 'rgba(239, 68, 68, 0.3)',
      }}
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
        animation: 'shimmer 2s infinite',
      }}
    >
      <Box
        position="relative"
        display="flex"
        alignItems="center"
        gap={ 1 }
      >
        <Box
          position="relative"
          w="6px"
          h="6px"
          borderRadius="50%"
          bg="red.500"
          boxShadow="0 0 6px rgba(239, 68, 68, 0.6)"
          _dark={{
            boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)',
          }}
          animation="pulseOpacity 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
        />
        <Text
          fontSize="9px"
          fontWeight="600"
          letterSpacing="0.08em"
          textTransform="uppercase"
          color="red.600"
          _dark={{ color: 'red.400' }}
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          Testnet
        </Text>
      </Box>
    </Box>
  );
};

export default React.memo(chakra(TestnetBadge));
