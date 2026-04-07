import { Box, Flex, Text, Spinner } from '@chakra-ui/react';
import type { WalrusBatchTreeItem, LoadedWalrusBatchTree, WalrusSignatureVerificationClient } from 'og-fe-tee-verification';
import { fetchWalrusBatchTree, verifyWalrusBatchTreeItemSignature } from 'og-fe-tee-verification';
import React from 'react';

import { publicClient } from 'lib/web3/client';
import { Alert } from 'toolkit/chakra/alert';
import { Button } from 'toolkit/chakra/button';
import { TableBody, TableCell, TableColumnHeader, TableHeader, TableRoot, TableRow } from 'toolkit/chakra/table';
import { Tooltip } from 'toolkit/chakra/tooltip';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import IconSvg from 'ui/shared/IconSvg';

const shortenHash = (hash: string, chars = 8): string => {
  if (hash.length <= chars * 2 + 2) return hash;
  return `${ hash.slice(0, chars + 2) }...${ hash.slice(-chars) }`;
};

const formatTimestamp = (timestamp: string): string => {
  const seconds = Number(timestamp);
  if (Number.isNaN(seconds) || seconds === 0) return timestamp;
  return new Date(seconds * 1000).toLocaleString();
};

type VerifyStatus = 'idle' | 'loading' | 'verified' | 'failed' | 'error';

interface ItemVerification {
  status: VerifyStatus;
  error?: string;
}

interface VerifyCellProps {
  item: WalrusBatchTreeItem;
  verification: ItemVerification | undefined;
  onVerify: (item: WalrusBatchTreeItem) => void;
  renderStatus: (index: number) => React.ReactNode;
}

const VerifyCell = ({ item, verification, onVerify, renderStatus }: VerifyCellProps) => {
  const handleClick = React.useCallback(() => {
    onVerify(item);
  }, [ onVerify, item ]);

  const status = verification?.status;

  if (status === 'loading' || status === 'verified') {
    return <>{ renderStatus(item.index) }</>;
  }

  if (status === 'failed' || status === 'error') {
    return (
      <Flex alignItems="center" gap={ 2 }>
        { renderStatus(item.index) }
        { publicClient && (
          <Button
            size="xs"
            variant="outline"
            colorPalette="purple"
            onClick={ handleClick }
          >
            Retry
          </Button>
        ) }
      </Flex>
    );
  }

  return publicClient ? (
    <Button
      size="xs"
      variant="outline"
      colorPalette="purple"
      onClick={ handleClick }
    >
      Verify
    </Button>
  ) : null;
};

interface Props {
  walrusBlobId: string;
}

const BatchSettlementTree = ({ walrusBlobId }: Props) => {
  const [ expanded, setExpanded ] = React.useState(true);
  const [ tree, setTree ] = React.useState<LoadedWalrusBatchTree | null>(null);
  const [ loading, setLoading ] = React.useState(false);
  const [ loadingStep, setLoadingStep ] = React.useState<string>('');
  const [ fetchError, setFetchError ] = React.useState<string | null>(null);
  const [ verifications, setVerifications ] = React.useState<Record<number, ItemVerification>>({});

  const handleExpand = React.useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  React.useEffect(() => {
    if (!expanded || tree || loading) return;

    let cancelled = false;

    setLoading(true);
    setFetchError(null);
    setLoadingStep('Downloading batch data from Walrus...');

    fetchWalrusBatchTree(walrusBlobId)
      .then((result) => {
        if (!cancelled) {
          setLoadingStep('Parsing Merkle tree...');
          setTree(result);
          setLoading(false);
          setLoadingStep('');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setFetchError(err instanceof Error ? err.message : 'Failed to fetch batch tree');
          setLoading(false);
          setLoadingStep('');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [ expanded, walrusBlobId, tree, loading ]);

  const handleVerifyItem = React.useCallback(async(item: WalrusBatchTreeItem) => {
    if (!publicClient) return;

    setVerifications((prev) => ({
      ...prev,
      [item.index]: { status: 'loading' },
    }));

    try {
      const verified = await verifyWalrusBatchTreeItemSignature({
        item,
        publicClient: publicClient as unknown as WalrusSignatureVerificationClient,
      });

      setVerifications((prev) => ({
        ...prev,
        [item.index]: { status: verified ? 'verified' : 'failed' },
      }));
    } catch (err) {
      setVerifications((prev) => ({
        ...prev,
        [item.index]: {
          status: 'error',
          error: err instanceof Error ? err.message : 'Verification failed',
        },
      }));
    }
  }, []);

  const verifiedCount = React.useMemo(() => {
    if (!tree) return 0;
    return tree.items.filter((item) => {
      const s = verifications[item.index]?.status;
      return s === 'verified' || s === 'failed' || s === 'error';
    }).length;
  }, [ tree, verifications ]);

  const verifyingAll = React.useMemo(() => {
    if (!tree) return false;
    return tree.items.some((item) => verifications[item.index]?.status === 'loading');
  }, [ tree, verifications ]);

  const handleVerifyAll = React.useCallback(async() => {
    if (!tree || !publicClient) return;

    setVerifications((prev) => {
      const next = { ...prev };
      for (const item of tree.items) {
        next[item.index] = { status: 'loading' };
      }
      return next;
    });

    await Promise.all(tree.items.map((item) => handleVerifyItem(item)));
  }, [ tree, handleVerifyItem ]);

  const renderVerifyStatus = React.useCallback((index: number) => {
    const v = verifications[index];
    if (!v || v.status === 'idle') return null;

    if (v.status === 'loading') {
      return <Spinner size="xs"/>;
    }

    if (v.status === 'verified') {
      return (
        <Tooltip content="Signature verified on-chain">
          <Flex alignItems="center" gap={ 1 } color="green.500">
            <IconSvg name="check" boxSize={ 4 }/>
            <Text fontSize="xs" fontWeight={ 600 }>Verified</Text>
          </Flex>
        </Tooltip>
      );
    }

    if (v.status === 'failed') {
      return (
        <Tooltip content="Signature verification failed">
          <Flex alignItems="center" gap={ 1 } color="red.500">
            <IconSvg name="cross" boxSize={ 4 }/>
            <Text fontSize="xs" fontWeight={ 600 }>Failed</Text>
          </Flex>
        </Tooltip>
      );
    }

    if (v.status === 'error') {
      return (
        <Tooltip content={ v.error || 'Verification error' }>
          <Flex alignItems="center" gap={ 1 } color="orange.500">
            <IconSvg name="info" boxSize={ 4 }/>
            <Text fontSize="xs" fontWeight={ 600 }>Error</Text>
          </Flex>
        </Tooltip>
      );
    }

    return null;
  }, [ verifications ]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box py={ 6 }>
          <Flex alignItems="center" justifyContent="center" gap={ 3 } mb={ 3 }>
            <Spinner size="sm"/>
            <Text fontSize="sm" color={{ _light: 'gray.500', _dark: 'gray.400' }}>
              { loadingStep || 'Loading...' }
            </Text>
          </Flex>
          <Box
            h="4px"
            borderRadius="full"
            bg={{ _light: 'gray.100', _dark: 'whiteAlpha.100' }}
            overflow="hidden"
          >
            <Box
              h="100%"
              borderRadius="full"
              bg={{ _light: 'purple.400', _dark: 'purple.300' }}
              w="60%"
              animation="pulse 1.5s ease-in-out infinite"
            />
          </Box>
        </Box>
      );
    }

    if (fetchError) {
      return (
        <Alert status="error">
          Failed to load batch tree: { fetchError }
        </Alert>
      );
    }

    if (!tree || tree.items.length === 0) {
      return (
        <Text fontSize="sm" color={{ _light: 'gray.500', _dark: 'gray.400' }} py={ 4 }>
          No items found in batch tree.
        </Text>
      );
    }

    return (
      <>
        <Flex alignItems="center" justifyContent="space-between" mb={ 3 }>
          <Text fontSize="xs" color={{ _light: 'gray.500', _dark: 'gray.400' }} fontFamily="mono">
            Merkle Root: { shortenHash(tree.merkleRoot) }
          </Text>
          { publicClient && (
            <Button
              size="sm"
              variant="outline"
              colorPalette="purple"
              onClick={ handleVerifyAll }
              loading={ verifyingAll }
              loadingText={ `Verifying ${ verifiedCount }/${ tree.items.length }...` }
            >
              Verify All
            </Button>
          ) }
        </Flex>

        { verifyingAll && (
          <Box mb={ 3 }>
            <Text fontSize="xs" color={{ _light: 'gray.500', _dark: 'gray.400' }} mb={ 1 }>
              Verifying signatures on-chain... { verifiedCount }/{ tree.items.length }
            </Text>
            <Box
              h="4px"
              borderRadius="full"
              bg={{ _light: 'gray.100', _dark: 'whiteAlpha.100' }}
              overflow="hidden"
            >
              <Box
                h="100%"
                borderRadius="full"
                bg={{ _light: 'purple.400', _dark: 'purple.300' }}
                w={ `${ tree.items.length > 0 ? (verifiedCount / tree.items.length) * 100 : 0 }%` }
                transition="width 0.3s ease"
              />
            </Box>
          </Box>
        ) }

        <Box
          borderRadius="lg"
          border="1px solid"
          borderColor={{ _light: 'gray.100', _dark: 'whiteAlpha.100' }}
          overflowX="auto"
        >
          <TableRoot size="sm">
            <TableHeader>
              <TableRow>
                <TableColumnHeader px={ 3 } py={ 2 } fontSize="xs" textTransform="uppercase" letterSpacing="0.05em">#</TableColumnHeader>
                <TableColumnHeader px={ 3 } py={ 2 } fontSize="xs" textTransform="uppercase" letterSpacing="0.05em">TEE ID</TableColumnHeader>
                <TableColumnHeader px={ 3 } py={ 2 } fontSize="xs" textTransform="uppercase" letterSpacing="0.05em">Input Hash</TableColumnHeader>
                <TableColumnHeader px={ 3 } py={ 2 } fontSize="xs" textTransform="uppercase" letterSpacing="0.05em">Output Hash</TableColumnHeader>
                <TableColumnHeader px={ 3 } py={ 2 } fontSize="xs" textTransform="uppercase" letterSpacing="0.05em">Timestamp</TableColumnHeader>
                <TableColumnHeader px={ 3 } py={ 2 } fontSize="xs" textTransform="uppercase" letterSpacing="0.05em">Verify</TableColumnHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              { tree.items.map((item) => (
                <TableRow key={ item.index }>
                  <TableCell px={ 3 } py={ 2 } fontSize="sm" fontFamily="mono">
                    { item.index + 1 }
                  </TableCell>
                  <TableCell px={ 3 } py={ 2 } fontSize="sm" fontFamily="mono">
                    <Flex alignItems="center" gap={ 1 }>
                      <Tooltip content={ item.tee_id }>
                        <Text>{ shortenHash(item.tee_id, 6) }</Text>
                      </Tooltip>
                      <CopyToClipboard text={ item.tee_id } boxSize={ 3 }/>
                    </Flex>
                  </TableCell>
                  <TableCell px={ 3 } py={ 2 } fontSize="sm" fontFamily="mono">
                    <Flex alignItems="center" gap={ 1 }>
                      <Tooltip content={ item.input_hash }>
                        <Text>{ shortenHash(item.input_hash, 6) }</Text>
                      </Tooltip>
                      <CopyToClipboard text={ item.input_hash } boxSize={ 3 }/>
                    </Flex>
                  </TableCell>
                  <TableCell px={ 3 } py={ 2 } fontSize="sm" fontFamily="mono">
                    <Flex alignItems="center" gap={ 1 }>
                      <Tooltip content={ item.output_hash }>
                        <Text>{ shortenHash(item.output_hash, 6) }</Text>
                      </Tooltip>
                      <CopyToClipboard text={ item.output_hash } boxSize={ 3 }/>
                    </Flex>
                  </TableCell>
                  <TableCell px={ 3 } py={ 2 } fontSize="sm" fontFamily="mono">
                    <Tooltip content={ item.tee_timestamp }>
                      <Text>{ formatTimestamp(item.tee_timestamp) }</Text>
                    </Tooltip>
                  </TableCell>
                  <TableCell px={ 3 } py={ 2 }>
                    <VerifyCell
                      item={ item }
                      verification={ verifications[item.index] }
                      onVerify={ handleVerifyItem }
                      renderStatus={ renderVerifyStatus }
                    />
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </TableRoot>
        </Box>
      </>
    );
  };

  return (
    <Box mt={ 4 }>
      <Box
        as="button"
        onClick={ handleExpand }
        display="flex"
        alignItems="center"
        gap={ 2 }
        px={ 3 }
        py={ 2 }
        borderRadius="md"
        cursor="pointer"
        transition="all 0.2s ease"
        bgColor={{ _light: 'purple.50', _dark: 'purple.900' }}
        _hover={{ bgColor: { _light: 'purple.100', _dark: 'purple.800' } }}
        w="fit-content"
      >
        <IconSvg
          name="arrows/east"
          boxSize={ 3.5 }
          color={{ _light: 'purple.500', _dark: 'purple.300' }}
          transform={ expanded ? 'rotate(90deg)' : 'rotate(0deg)' }
          transition="transform 0.2s ease"
        />
        <Text fontSize="sm" fontWeight={ 600 } color={{ _light: 'purple.700', _dark: 'purple.200' }}>
          Verify Batch Signatures{ tree ? ` (${ tree.items.length })` : '' }
        </Text>
      </Box>

      { expanded && (
        <Box mt={ 3 }>
          { renderContent() }
        </Box>
      ) }
    </Box>
  );
};

export default React.memo(BatchSettlementTree);
