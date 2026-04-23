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

const shortenHash = (hash: string, chars = 8): string => {
  if (hash.length <= chars * 2 + 2) return hash;
  return `${ hash.slice(0, chars + 2) }...${ hash.slice(-chars) }`;
};

const formatPayload = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const formatTimestamp = (raw: string): string => {
  const num = Number(raw);
  if (!Number.isFinite(num) || num <= 0) return raw;
  // Heuristic: treat 10-digit values as seconds, longer as ms
  const ms = raw.length >= 13 ? num : num * 1000;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return raw;
  return `${ date.toUTCString() } (${ raw })`;
};

type VerifyStatus = 'idle' | 'loading' | 'verified' | 'failed' | 'error';

interface Props {
  walrusBlobId: string;
}

const IndividualSettlementView = ({ walrusBlobId }: Props) => {
  const [ settlement, setSettlement ] = React.useState<LoadedWalrusIndividualSettlement | null>(null);
  const [ loading, setLoading ] = React.useState(false);
  const [ fetchError, setFetchError ] = React.useState<string | null>(null);
  const [ verifyStatus, setVerifyStatus ] = React.useState<VerifyStatus>('idle');
  const [ verifyError, setVerifyError ] = React.useState<string | null>(null);

  const handleDownload = React.useCallback(async() => {
    if (settlement || loading) return;

    setLoading(true);
    setFetchError(null);

    try {
      const result = await fetchWalrusIndividualSettlement(walrusBlobId);
      setSettlement(result);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to fetch settlement');
    } finally {
      setLoading(false);
    }
  }, [ walrusBlobId, settlement, loading ]);

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
          <Text fontSize="xs" fontWeight={ 600 }>Verified</Text>
        </Flex>
      );
    }
    if (verifyStatus === 'failed') {
      return (
        <Flex alignItems="center" gap={ 1 } color="red.500">
          <IconSvg name="cross" boxSize={ 3.5 }/>
          <Text fontSize="xs" fontWeight={ 600 }>Failed</Text>
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

  const renderField = (
    label: string,
    value: string | undefined | null,
    opts?: { mono?: boolean; shorten?: boolean; copy?: boolean },
  ) => {
    if (!value) return null;
    const mono = opts?.mono !== false;
    const shorten = opts?.shorten ?? false;
    const copy = opts?.copy ?? true;
    return (
      <Flex
        alignItems={{ base: 'flex-start', lg: 'center' }}
        gap={{ base: 1, lg: 4 }}
        flexDir={{ base: 'column', lg: 'row' }}
        py={ 2 }
        borderBottom="1px solid"
        borderColor={{ _light: 'gray.100', _dark: 'whiteAlpha.100' }}
        _last={{ borderBottom: 'none' }}
      >
        <Text
          fontSize="xs"
          fontWeight={ 600 }
          textTransform="uppercase"
          letterSpacing="0.06em"
          color={{ _light: 'gray.500', _dark: 'gray.400' }}
          w={{ base: 'auto', lg: '140px' }}
          flexShrink={ 0 }
        >
          { label }
        </Text>
        <Flex alignItems="center" gap={ 2 } minW={ 0 } flex={ 1 }>
          <Tooltip content={ shorten ? value : undefined }>
            <Text
              fontSize="sm"
              fontFamily={ mono ? 'mono' : undefined }
              color={{ _light: 'gray.800', _dark: 'gray.100' }}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              { shorten ? shortenHash(value, 10) : value }
            </Text>
          </Tooltip>
          { copy && <CopyToClipboard text={ value } boxSize={ 3.5 }/> }
        </Flex>
      </Flex>
    );
  };

  const renderPayload = (label: string, value: unknown) => {
    const text = formatPayload(value);
    if (!text) return null;
    return (
      <Box
        py={ 3 }
        borderBottom="1px solid"
        borderColor={{ _light: 'gray.100', _dark: 'whiteAlpha.100' }}
        _last={{ borderBottom: 'none' }}
      >
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
          <CopyToClipboard text={ text } boxSize={ 3.5 }/>
        </Flex>
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
      </Box>
    );
  };

  if (loading) {
    return (
      <Box mt={ 4 }>
        <Flex direction="column" alignItems="center" py={ 8 } px={ 4 } gap={ 3 }>
          <Spinner size="md" color={{ _light: 'purple.500', _dark: 'purple.300' }}/>
          <Text fontSize="sm" fontWeight={ 500 } color={{ _light: 'gray.600', _dark: 'gray.300' }}>
            Downloading settlement data from Walrus...
          </Text>
        </Flex>
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box mt={ 4 }>
        <Alert status="error">
          Failed to load individual settlement: { fetchError }
        </Alert>
      </Box>
    );
  }

  if (!settlement) {
    return (
      <Box mt={ 4 }>
        <Flex alignItems="center" justifyContent="center" py={ 6 }>
          <Button
            size="lg"
            variant="solid"
            colorPalette="purple"
            onClick={ handleDownload }
            fontWeight={ 600 }
            px={ 6 }
          >
            <IconSvg name="verified" boxSize={ 5 }/>
            Download Settlement
          </Button>
        </Flex>
      </Box>
    );
  }

  return (
    <Box mt={ 4 }>
      { /* Header card */ }
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
              Walrus Blob
            </Text>
            <Flex alignItems="center" gap={ 1 }>
              <Tooltip content={ settlement.blobId }>
                <Text
                  fontSize="sm"
                  fontFamily="mono"
                  fontWeight={ 600 }
                  color={{ _light: 'purple.700', _dark: 'purple.200' }}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  { shortenHash(settlement.blobId, 12) }
                </Text>
              </Tooltip>
              <CopyToClipboard text={ settlement.blobId } boxSize={ 3.5 }/>
            </Flex>
          </Box>
        </Flex>
        <Flex alignItems="center" gap={ 3 } flexShrink={ 0 }>
          { renderVerifyBadge() }
          { publicClient && (
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

      { /* Fields */ }
      <Box
        borderRadius="lg"
        border="1px solid"
        borderColor={{ _light: 'gray.200', _dark: 'whiteAlpha.100' }}
        px={ 4 }
        py={ 2 }
      >
        { renderField('TEE ID', settlement.tee_id, { shorten: true }) }
        { renderField('ETH Address', settlement.eth_address, { shorten: true }) }
        { renderField('Timestamp', formatTimestamp(settlement.tee_timestamp), { mono: true, copy: false }) }
        { renderField('Input Hash', settlement.input_hash, { shorten: true }) }
        { renderField('Output Hash', settlement.output_hash, { shorten: true }) }
        { renderField('Signature', settlement.tee_signature_bytes, { shorten: true }) }
        { renderPayload('Input', settlement.input) }
        { renderPayload('Output', settlement.output) }
      </Box>
    </Box>
  );
};

export default React.memo(IndividualSettlementView);
