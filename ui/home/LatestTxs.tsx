import { Box, Text, Flex } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useIsMobile from 'lib/hooks/useIsMobile';
import useNewTxsSocket from 'lib/hooks/useNewTxsSocket';
import { TX } from 'stubs/tx';
import { Link } from 'toolkit/chakra/link';

import { HOME_BRAND } from './brand';
import LatestTxsItem from './LatestTxsItem';
import LatestTxsItemMobile from './LatestTxsItemMobile';

const { colors, fonts, panel, text } = HOME_BRAND;

const LatestTransactions = () => {
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 2 : 11;
  const { data, isPlaceholderData, isError } = useApiQuery('homepage_txs', {
    queryOptions: {
      placeholderData: Array(txsCount).fill(TX),
    },
  });
  const validatedTxsQuery = useApiQuery('txs_validated', {
    queryParams: {
      filter: 'validated',
    },
    queryOptions: {
      placeholderData: {
        items: Array(txsCount).fill(TX),
        next_page_params: null,
      },
    },
  });

  const { num, socketAlert } = useNewTxsSocket();
  const txsUrl = route({ pathname: '/txs' });

  let content;

  const txs = isMobile ? data : validatedTxsQuery.data?.items;
  const isTxsPlaceholderData = isMobile ? isPlaceholderData : validatedTxsQuery.isPlaceholderData;
  const isTxsError = isMobile ? isError : validatedTxsQuery.isError;

  if (isTxsError) {
    content = (
      <Box px={{ base: 4, lg: 6 }} py={ 8 }>
        <Text
          fontSize="sm"
          color={ text.secondary }
          fontFamily={ fonts.sans }
        >
          No data. Please reload the page.
        </Text>
      </Box>
    );
  } else if (txs) {
    content = (
      <>
        <Box
          display={{ base: 'block', lg: 'none' }}
          width="100%"
          bg="transparent"
          borderRadius="0"
          overflow="hidden"
        >
          { txs.slice(0, txsCount).map(((tx, index) => (
            <Box
              key={ tx.hash + (isTxsPlaceholderData ? index : '') }
              borderBottom={ index < txsCount - 1 ? '1px solid' : 'none' }
              borderColor={ panel.border }
            >
              <LatestTxsItemMobile
                tx={ tx }
                isLoading={ isTxsPlaceholderData }
              />
            </Box>
          ))) }
        </Box>
        <AddressHighlightProvider>
          <Box
            display={{ base: 'none', lg: 'block' }}
            width="100%"
            bg="transparent"
            borderRadius="0"
            overflow="hidden"
            position="relative"
          >
            <Box>
              { txs.slice(0, txsCount).map(((tx, index) => (
                <Box
                  key={ tx.hash + (isTxsPlaceholderData ? index : '') }
                  borderBottom={ index < txsCount - 1 ? '1px solid' : 'none' }
                  borderColor={ panel.border }
                >
                  <LatestTxsItem
                    tx={ tx }
                    isLoading={ isTxsPlaceholderData }
                  />
                </Box>
              ))) }
            </Box>
          </Box>
        </AddressHighlightProvider>
        <Box
          mt={ 2 }
          px={{ base: 4, lg: 4 }}
          pb={{ base: 4, lg: 4 }}
          pt={ 1 }
        >
          <Link
            href={ txsUrl }
            fontSize="10px"
            fontWeight={ 500 }
            letterSpacing="0.08em"
            textTransform="uppercase"
            color={ text.muted }
            fontFamily={ fonts.mono }
            width="100%"
            display="block"
            textAlign="center"
            py={ 2.5 }
            transition="all 0.2s ease"
            _hover={{
              textDecoration: 'none',
              opacity: 0.7,
              color: text.accent,
            }}
          >
            View all transactions
          </Link>
        </Box>
      </>
    );
  }

  const statusText = socketAlert || (num ? `${ num.toLocaleString() } new txns` : 'Monitoring...');

  return (
    <Box
      width="100%"
      height="100%"
      border="1px solid"
      borderColor={ panel.border }
      borderRadius="8px"
      bg={ panel.bg }
      boxShadow={ panel.shadow }
      backdropFilter="blur(18px)"
      overflow="hidden"
    >
      <Flex
        alignItems="center"
        gap={ 2 }
        px={{ base: 4, lg: 4 }}
        pt={{ base: 4, lg: 4 }}
        pb={ 3 }
        borderBottom="1px solid"
        borderColor={ panel.border }
      >
        <Box
          position="relative"
          w="6px"
          h="6px"
          borderRadius="50%"
          bg={ colors.cyan }
          boxShadow="0 0 10px rgba(36, 188, 227, 0.8), 0 0 20px rgba(36, 188, 227, 0.4)"
          animation="pulseOpacity 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
        />
        <Text
          fontSize="11px"
          fontWeight={ 500 }
          letterSpacing="0.12em"
          textTransform="uppercase"
          color={ text.accent }
          fontFamily={ fonts.mono }
        >
          / Latest transactions
        </Text>
        { (num || socketAlert) && !isTxsPlaceholderData && (
          <Link
            href={ txsUrl }
            display="inline-flex"
            alignItems="center"
            px={ 2.5 }
            py={ 1 }
            borderRadius="full"
            bg={{ _light: 'rgba(36, 188, 227, 0.10)', _dark: 'rgba(36, 188, 227, 0.16)' }}
            border="1px solid"
            borderColor={{ _light: 'rgba(36, 188, 227, 0.24)', _dark: 'rgba(80, 201, 233, 0.28)' }}
            fontSize="10px"
            fontWeight={ 500 }
            color={ text.accent }
            fontFamily={ fonts.mono }
            transition="all 0.2s ease"
            _hover={{
              bg: { _light: 'rgba(36, 188, 227, 0.16)', _dark: 'rgba(36, 188, 227, 0.24)' },
              borderColor: { _light: 'rgba(36, 188, 227, 0.34)', _dark: 'rgba(80, 201, 233, 0.42)' },
              textDecoration: 'none',
            }}
          >
            { statusText }
          </Link>
        ) }
      </Flex>
      <Box>
        { content }
      </Box>
    </Box>
  );
};

export default LatestTransactions;
