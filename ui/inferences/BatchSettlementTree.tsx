import { Box, Flex, Text, Spinner } from '@chakra-ui/react';
import type { WalrusBatchTreeItem, WalrusBatchTreeDump, LoadedWalrusBatchTree, WalrusSignatureVerificationClient } from 'og-fe-tee-verification';
import { fetchWalrusBlob, parseWalrusBatchTree, verifyWalrusBatchTreeItemSignature } from 'og-fe-tee-verification';
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
            variant="ghost"
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
      variant="ghost"
      colorPalette="purple"
      onClick={ handleClick }
      fontWeight={ 500 }
      px={ 3 }
      py={ 1 }
    >
      <IconSvg name="verified" boxSize={ 3 }/>
      Verify
    </Button>
  ) : null;
};

interface Props {
  walrusBlobId: string;
}

const BatchSettlementTree = ({ walrusBlobId }: Props) => {
  const [ tree, setTree ] = React.useState<LoadedWalrusBatchTree | null>(null);
  const [ loading, setLoading ] = React.useState(false);
  const [ loadingStep, setLoadingStep ] = React.useState<string>('');
  const [ downloadProgress, setDownloadProgress ] = React.useState<number>(0);
  const [ downloadedBytes, setDownloadedBytes ] = React.useState<number>(0);
  const [ fetchError, setFetchError ] = React.useState<string | null>(null);
  const [ verifications, setVerifications ] = React.useState<Record<number, ItemVerification>>({});

  const handleStartVerification = React.useCallback(async() => {
    if (tree || loading) return;

    setLoading(true);
    setFetchError(null);
    setDownloadProgress(0);
    setDownloadedBytes(0);
    setLoadingStep('Downloading batch data from Walrus...');

    try {
      const response = await fetchWalrusBlob(walrusBlobId);
      const contentLength = Number(response.headers.get('content-length') || 0);
      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const chunks: Array<Uint8Array> = [];
      let received = 0;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        received += value.length;
        setDownloadedBytes(received);

        if (contentLength > 0) {
          setDownloadProgress(Math.min(received / contentLength, 1));
        }
      }

      setDownloadProgress(1);
      setLoadingStep('Parsing Merkle tree...');

      // Yield to browser so the 100% / "Parsing" state renders before heavy sync work
      await new Promise((resolve) => setTimeout(resolve, 0));

      const blob = new Blob(chunks);
      const text = await blob.text();

      const dump = JSON.parse(text) as WalrusBatchTreeDump;
      const result = parseWalrusBatchTree(walrusBlobId, dump);

      setTree(result);
      setLoading(false);
      setLoadingStep('');
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to fetch batch tree');
      setLoading(false);
      setLoadingStep('');
    }
  }, [ walrusBlobId, tree, loading ]);

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
            <IconSvg name="check" boxSize={ 3.5 }/>
            <Text fontSize="xs" fontWeight={ 600 }>Verified</Text>
          </Flex>
        </Tooltip>
      );
    }

    if (v.status === 'failed') {
      return (
        <Tooltip content="Signature verification failed">
          <Flex alignItems="center" gap={ 1 } color="red.500">
            <IconSvg name="cross" boxSize={ 3.5 }/>
            <Text fontSize="xs" fontWeight={ 600 }>Failed</Text>
          </Flex>
        </Tooltip>
      );
    }

    if (v.status === 'error') {
      return (
        <Tooltip content={ v.error || 'Verification error' }>
          <Flex alignItems="center" gap={ 1 } color="orange.500">
            <IconSvg name="info" boxSize={ 3.5 }/>
            <Text fontSize="xs" fontWeight={ 600 }>Error</Text>
          </Flex>
        </Tooltip>
      );
    }

    return null;
  }, [ verifications ]);

  const renderContent = () => {
    if (loading) {
      const pct = Math.round(downloadProgress * 100);
      const hasProgress = downloadProgress > 0;
      let formattedBytes = '';
      if (downloadedBytes >= 1_048_576) {
        formattedBytes = `${ (downloadedBytes / 1_048_576).toFixed(1) } MB`;
      } else if (downloadedBytes >= 1024) {
        formattedBytes = `${ Math.round(downloadedBytes / 1024) } KB`;
      } else if (downloadedBytes > 0) {
        formattedBytes = `${ downloadedBytes } B`;
      }
      let progressText = '';
      if (hasProgress && downloadProgress < 1) {
        progressText = pct > 0 ? ` (${ formattedBytes } · ${ pct }%)` : ` (${ formattedBytes })`;
      } else if (formattedBytes) {
        progressText = ` (${ formattedBytes })`;
      }

      return (
        <Flex
          direction="column"
          alignItems="center"
          py={ 8 }
          px={ 4 }
          gap={ 4 }
        >
          <Spinner size="md" color={{ _light: 'purple.500', _dark: 'purple.300' }}/>
          <Text fontSize="sm" fontWeight={ 500 } color={{ _light: 'gray.600', _dark: 'gray.300' }}>
            { loadingStep || 'Loading...' }{ progressText }
          </Text>
          <Box w="200px">
            <Box
              h="3px"
              borderRadius="full"
              bg={{ _light: 'gray.100', _dark: 'whiteAlpha.100' }}
              overflow="hidden"
            >
              <Box
                h="100%"
                borderRadius="full"
                bg={{ _light: 'purple.500', _dark: 'purple.400' }}
                w={ hasProgress ? `${ Math.max(pct, 5) }%` : '5%' }
                transition="width 0.3s ease"
                { ...(!hasProgress ? { animation: 'pulse 1.5s ease-in-out infinite' } : {}) }
              />
            </Box>
          </Box>
        </Flex>
      );
    }

    if (fetchError) {
      return (
        <Alert status="error">
          Failed to load batch tree: { fetchError }
        </Alert>
      );
    }

    if (!tree) {
      return (
        <Flex
          alignItems="center"
          justifyContent="center"
          py={ 6 }
        >
          <Button
            size="lg"
            variant="solid"
            colorPalette="purple"
            onClick={ handleStartVerification }
            fontWeight={ 600 }
            px={ 6 }
          >
            <IconSvg name="verified" boxSize={ 5 }/>
            Download & Verify Batch
          </Button>
        </Flex>
      );
    }

    if (tree.items.length === 0) {
      return (
        <Text fontSize="sm" color={{ _light: 'gray.500', _dark: 'gray.400' }} py={ 4 }>
          No items found in batch tree.
        </Text>
      );
    }

    return (
      <Box>
        { /* Merkle Root Header */ }
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
                Merkle Root
              </Text>
              <Flex alignItems="center" gap={ 1 }>
                <Tooltip content={ tree.merkleRoot }>
                  <Text
                    fontSize="sm"
                    fontFamily="mono"
                    fontWeight={ 600 }
                    color={{ _light: 'purple.700', _dark: 'purple.200' }}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    { shortenHash(tree.merkleRoot, 12) }
                  </Text>
                </Tooltip>
                <CopyToClipboard text={ tree.merkleRoot } boxSize={ 3.5 }/>
              </Flex>
            </Box>
          </Flex>
          <Flex alignItems="center" gap={ 3 } flexShrink={ 0 }>
            <Text fontSize="sm" color={{ _light: 'purple.600', _dark: 'purple.300' }} fontWeight={ 500 }>
              { tree.items.length } { tree.items.length === 1 ? 'inference' : 'inferences' }
            </Text>
            { publicClient && (
              <Button
                size="sm"
                variant="solid"
                colorPalette="purple"
                onClick={ handleVerifyAll }
                loading={ verifyingAll }
                loadingText={ `${ verifiedCount }/${ tree.items.length }` }
                fontWeight={ 600 }
              >
                <IconSvg name="verified" boxSize={ 3.5 }/>
                Verify All
              </Button>
            ) }
          </Flex>
        </Flex>

        { /* Verification progress */ }
        { verifyingAll && (
          <Flex alignItems="center" gap={ 3 } mb={ 3 } px={ 1 }>
            <Box flex={ 1 }>
              <Box
                h="3px"
                borderRadius="full"
                bg={{ _light: 'gray.100', _dark: 'whiteAlpha.100' }}
                overflow="hidden"
              >
                <Box
                  h="100%"
                  borderRadius="full"
                  bg={{ _light: 'purple.500', _dark: 'purple.400' }}
                  w={ `${ tree.items.length > 0 ? (verifiedCount / tree.items.length) * 100 : 0 }%` }
                  transition="width 0.3s ease"
                />
              </Box>
            </Box>
            <Text fontSize="xs" fontWeight={ 500 } color={{ _light: 'gray.500', _dark: 'gray.400' }} flexShrink={ 0 }>
              { verifiedCount }/{ tree.items.length }
            </Text>
          </Flex>
        ) }

        { /* Table */ }
        <Box
          borderRadius="lg"
          border="1px solid"
          borderColor={{ _light: 'gray.200', _dark: 'whiteAlpha.100' }}
          overflow="hidden"
        >
          <Box overflowX="auto">
            <TableRoot size="sm" whiteSpace="nowrap">
              <TableHeader>
                <TableRow>
                  { [ '#', 'TEE ID', 'Input Hash', 'Output Hash', 'Signature', 'Verify' ].map((header, i) => (
                    <TableColumnHeader
                      key={ header }
                      px={ 3 }
                      py={ 2.5 }
                      fontSize="11px"
                      fontWeight={ 600 }
                      textTransform="uppercase"
                      letterSpacing="0.06em"
                      color={{ _light: 'gray.500', _dark: 'gray.400' }}
                      bgColor={{ _light: 'gray.50', _dark: 'whiteAlpha.50' }}
                      borderBottom="1px solid"
                      borderColor={{ _light: 'gray.200', _dark: 'whiteAlpha.100' }}
                      { ...(i === 0 || i === 5 ? { w: '1px' } : {}) }
                    >
                      { header }
                    </TableColumnHeader>
                  )) }
                </TableRow>
              </TableHeader>
              <TableBody>
                { tree.items.map((item, idx) => (
                  <TableRow
                    key={ item.index }
                    bgColor={ idx % 2 === 0 ?
                      { _light: 'white', _dark: 'transparent' } :
                      { _light: 'gray.50/50', _dark: 'whiteAlpha.50/20' }
                    }
                    _hover={{ bgColor: { _light: 'purple.50/50', _dark: 'purple.900/10' } }}
                    transition="background 0.15s ease"
                  >
                    <TableCell px={ 3 } py={ 2.5 } fontSize="xs" fontFamily="mono" color={{ _light: 'gray.400', _dark: 'gray.500' }}>
                      { item.index + 1 }
                    </TableCell>
                    <TableCell px={ 3 } py={ 2.5 } fontSize="xs" fontFamily="mono">
                      <Flex alignItems="center" gap={ 1 }>
                        <Tooltip content={ item.tee_id }>
                          <Text>{ shortenHash(item.tee_id, 4) }</Text>
                        </Tooltip>
                        <CopyToClipboard text={ item.tee_id } boxSize={ 3 }/>
                      </Flex>
                    </TableCell>
                    <TableCell px={ 3 } py={ 2.5 } fontSize="xs" fontFamily="mono">
                      <Flex alignItems="center" gap={ 1 }>
                        <Tooltip content={ item.input_hash }>
                          <Text>{ shortenHash(item.input_hash, 4) }</Text>
                        </Tooltip>
                        <CopyToClipboard text={ item.input_hash } boxSize={ 3 }/>
                      </Flex>
                    </TableCell>
                    <TableCell px={ 3 } py={ 2.5 } fontSize="xs" fontFamily="mono">
                      <Flex alignItems="center" gap={ 1 }>
                        <Tooltip content={ item.output_hash }>
                          <Text>{ shortenHash(item.output_hash, 4) }</Text>
                        </Tooltip>
                        <CopyToClipboard text={ item.output_hash } boxSize={ 3 }/>
                      </Flex>
                    </TableCell>
                    <TableCell px={ 3 } py={ 2.5 } fontSize="xs" fontFamily="mono">
                      <Flex alignItems="center" gap={ 1 }>
                        <Tooltip content={ item.tee_signature }>
                          <Text>{ shortenHash(item.tee_signature, 4) }</Text>
                        </Tooltip>
                        <CopyToClipboard text={ item.tee_signature } boxSize={ 3 }/>
                      </Flex>
                    </TableCell>
                    <TableCell px={ 3 } py={ 2.5 }>
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
        </Box>
      </Box>
    );
  };

  return (
    <Box mt={ 4 }>
      { renderContent() }
    </Box>
  );
};

export default React.memo(BatchSettlementTree);
