import { Box, Flex, Text, Spinner } from '@chakra-ui/react';
import type { LoadedWalrusIndividualSettlement, WalrusSignatureVerificationClient } from 'og-fe-tee-verification';
import { fetchWalrusIndividualSettlement, verifyWalrusIndividualSettlementSignature } from 'og-fe-tee-verification';
import React from 'react';

import { publicClient } from 'lib/web3/client';
import { Alert } from 'toolkit/chakra/alert';
import { Button } from 'toolkit/chakra/button';
import { Tooltip } from 'toolkit/chakra/tooltip';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import IconSvg from 'ui/shared/IconSvg';

const formatPayload = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

type VerifyStatus = 'idle' | 'loading' | 'verified' | 'failed' | 'error';

interface Props {
  walrusBlobId: string;
}

const IndividualSettlementView = ({ walrusBlobId }: Props) => {
  const [ settlement, setSettlement ] = React.useState<LoadedWalrusIndividualSettlement | null>(null);
  const [ loading, setLoading ] = React.useState(true);
  const [ fetchError, setFetchError ] = React.useState<string | null>(null);
  const [ verifyStatus, setVerifyStatus ] = React.useState<VerifyStatus>('idle');
  const [ verifyError, setVerifyError ] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const load = async() => {
      setLoading(true);
      setFetchError(null);
      try {
        const result = await fetchWalrusIndividualSettlement(walrusBlobId);
        if (!cancelled) setSettlement(result);
      } catch (err) {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : 'Failed to fetch settlement');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [ walrusBlobId ]);

  const handleVerify = React.useCallback(async() => {
    if (!settlement || !publicClient) return;

    setVerifyStatus('loading');
    setVerifyError(null);

    try {
      const verified = await verifyWalrusIndividualSettlementSignature({
        settlement,
        publicClient: publicClient as unknown as WalrusSignatureVerificationClient,
      });
      setVerifyStatus(verified ? 'verified' : 'failed');
    } catch (err) {
      setVerifyStatus('error');
      setVerifyError(err instanceof Error ? err.message : 'Verification failed');
    }
  }, [ settlement ]);

  const renderVerifyBadge = () => {
    if (verifyStatus === 'loading') return <Spinner size="xs"/>;
    if (verifyStatus === 'verified') {
      return (
        <Flex alignItems="center" gap={ 1 } color="green.500">
          <IconSvg name="check" boxSize={ 3.5 }/>
          <Text fontSize="xs" fontWeight={ 600 }>Signature Verified On-Chain</Text>
        </Flex>
      );
    }
    if (verifyStatus === 'failed') {
      return (
        <Flex alignItems="center" gap={ 1 } color="red.500">
          <IconSvg name="cross" boxSize={ 3.5 }/>
          <Text fontSize="xs" fontWeight={ 600 }>Verification Failed</Text>
        </Flex>
      );
    }
    if (verifyStatus === 'error') {
      return (
        <Tooltip content={ verifyError || 'Verification error' }>
          <Flex alignItems="center" gap={ 1 } color="orange.500">
            <IconSvg name="info" boxSize={ 3.5 }/>
            <Text fontSize="xs" fontWeight={ 600 }>Error</Text>
          </Flex>
        </Tooltip>
      );
    }
    return null;
  };

  const renderPayload = (label: string, value: unknown) => {
    const text = formatPayload(value);
    return (
      <Box>
        <Flex alignItems="center" justifyContent="space-between" mb={ 2 }>
          <Text
            fontSize="xs"
            fontWeight={ 600 }
            textTransform="uppercase"
            letterSpacing="0.06em"
            color={{ _light: 'gray.500', _dark: 'gray.400' }}
          >
            { label }
          </Text>
          { text && <CopyToClipboard text={ text } boxSize={ 3.5 }/> }
        </Flex>
        { text ? (
          <Box
            as="pre"
            p={ 3 }
            borderRadius="md"
            bgColor={{ _light: 'gray.50', _dark: 'whiteAlpha.50' }}
            border="1px solid"
            borderColor={{ _light: 'gray.100', _dark: 'whiteAlpha.100' }}
            fontSize="xs"
            fontFamily="mono"
            color={{ _light: 'gray.800', _dark: 'gray.100' }}
            whiteSpace="pre-wrap"
            wordBreak="break-word"
            overflowX="auto"
            m={ 0 }
          >
            { text }
          </Box>
        ) : (
          <Text fontSize="sm" color={{ _light: 'gray.500', _dark: 'gray.400' }} fontStyle="italic">
            (empty)
          </Text>
        ) }
      </Box>
    );
  };

  return (
    <Box mt={ 4 }>
      { /* Header: clearly label this section as Walrus-sourced */ }
      <Flex
        alignItems={{ base: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        flexDirection={{ base: 'column', md: 'row' }}
        gap={ 3 }
        px={ 4 }
        py={ 3 }
        mb={ 3 }
        borderRadius="lg"
        bgColor={{ _light: 'purple.50', _dark: 'purple.900/20' }}
        border="1px solid"
        borderColor={{ _light: 'purple.100', _dark: 'purple.800/40' }}
      >
        <Flex alignItems="center" gap={ 3 } minW={ 0 }>
          <Flex
            alignItems="center"
            justifyContent="center"
            w={ 8 }
            h={ 8 }
            borderRadius="lg"
            bgColor={{ _light: 'purple.100', _dark: 'purple.800/40' }}
            flexShrink={ 0 }
          >
            <IconSvg name="verified" boxSize={ 4 } color={{ _light: 'purple.600', _dark: 'purple.300' }}/>
          </Flex>
          <Box minW={ 0 }>
            <Text fontSize="xs" fontWeight={ 500 } color={{ _light: 'purple.500', _dark: 'purple.400' }} mb={ 0.5 }>
              From Walrus Blob
            </Text>
            <Text fontSize="sm" fontWeight={ 600 } color={{ _light: 'purple.700', _dark: 'purple.200' }}>
              Off-chain inference payload
            </Text>
          </Box>
        </Flex>
        <Flex alignItems="center" gap={ 3 } flexShrink={ 0 }>
          { renderVerifyBadge() }
          { publicClient && settlement && verifyStatus !== 'verified' && (
            <Button
              size="sm"
              variant="solid"
              colorPalette="purple"
              onClick={ handleVerify }
              loading={ verifyStatus === 'loading' }
              disabled={ verifyStatus === 'loading' }
              fontWeight={ 600 }
            >
              <IconSvg name="verified" boxSize={ 3.5 }/>
              Verify Signature
            </Button>
          ) }
        </Flex>
      </Flex>

      { /* Body */ }
      { loading && (
        <Flex direction="column" alignItems="center" py={ 8 } px={ 4 } gap={ 3 }>
          <Spinner size="md" color={{ _light: 'purple.500', _dark: 'purple.300' }}/>
          <Text fontSize="sm" fontWeight={ 500 } color={{ _light: 'gray.600', _dark: 'gray.300' }}>
            Downloading from Walrus...
          </Text>
        </Flex>
      ) }

      { !loading && fetchError && (
        <Alert status="error">
          Failed to load individual settlement: { fetchError }
        </Alert>
      ) }

      { !loading && !fetchError && settlement && (
        <Box
          borderRadius="lg"
          border="1px solid"
          borderColor={{ _light: 'gray.200', _dark: 'whiteAlpha.100' }}
          p={ 4 }
          display="flex"
          flexDirection="column"
          gap={ 4 }
        >
          { renderPayload('Input', settlement.input) }
          { renderPayload('Output', settlement.output) }
        </Box>
      ) }
    </Box>
  );
};

export default React.memo(IndividualSettlementView);
