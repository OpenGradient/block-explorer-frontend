import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import dayjs from 'lib/date/dayjs';
import type { TEENodeWithStatus } from 'lib/opengradient/contracts/teeRegistry';
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerHeader, DrawerRoot, DrawerTitle } from 'toolkit/chakra/drawer';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as EntityBase from 'ui/shared/entities/base/components';

type Props = {
  node: TEENodeWithStatus;
  typeName: string;
  onClose: () => void;
};

const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Box
    py={ 3 }
    borderBottom="1px solid"
    borderColor={{ _light: 'rgba(0, 0, 0, 0.04)', _dark: 'rgba(255, 255, 255, 0.04)' }}
  >
    <Text
      fontSize="10px"
      fontWeight={ 600 }
      textTransform="uppercase"
      letterSpacing="0.08em"
      color={{ _light: 'rgba(0, 0, 0, 0.35)', _dark: 'rgba(255, 255, 255, 0.35)' }}
      fontFamily="system-ui, -apple-system, sans-serif"
      mb={ 1 }
    >
      { label }
    </Text>
    { children }
  </Box>
);

function getStatusBg(isActive: boolean, enabled: boolean) {
  if (isActive) return 'green.500';
  if (enabled) return 'orange.400';
  return 'gray.400';
}

function getStatusColor(isActive: boolean, enabled: boolean) {
  if (isActive) return { _light: 'rgba(22, 163, 74, 0.9)', _dark: 'rgba(34, 197, 94, 0.95)' };
  if (enabled) return { _light: 'rgba(217, 119, 6, 0.8)', _dark: 'rgba(245, 158, 11, 0.9)' };
  return { _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' };
}

function getStatusLabel(isActive: boolean, enabled: boolean) {
  if (isActive) return 'Active';
  if (enabled) return 'Enabled';
  return 'Disabled';
}

const TEENodeDetailDrawer = ({ node, typeName, onClose }: Props) => {
  const formatTimestamp = (timestamp: bigint) => {
    if (timestamp === BigInt(0)) return 'Never';
    const date = dayjs.unix(Number(timestamp));
    return `${ date.format('MMM DD, YYYY HH:mm:ss') } (${ date.fromNow() })`;
  };

  const truncateBytes = (hex: string, maxLen: number = 20) => {
    if (hex.length <= maxLen) return hex;
    return `${ hex.slice(0, maxLen + 2) }...${ hex.slice(-8) }`;
  };

  const handleOpenChange = React.useCallback((details: { open: boolean }) => {
    if (!details.open) {
      onClose();
    }
  }, [ onClose ]);

  return (
    <DrawerRoot open={ true } onOpenChange={ handleOpenChange } placement="end" size="lg">
      <DrawerBackdrop/>
      <DrawerContent>
        <DrawerCloseTrigger/>
        <DrawerHeader>
          <DrawerTitle>
            <Flex alignItems="center" gap={ 3 }>
              <Box>
                <Text
                  fontSize="lg"
                  fontWeight={ 600 }
                  fontFamily="system-ui, -apple-system, sans-serif"
                  color={{ _light: 'rgba(0, 0, 0, 0.9)', _dark: 'rgba(255, 255, 255, 0.95)' }}
                >
                  TEE Node Details
                </Text>
                <Flex alignItems="center" gap={ 2 } mt={ 1 }>
                  <Box
                    w="6px"
                    h="6px"
                    borderRadius="50%"
                    bg={ getStatusBg(node.isActive, node.enabled) }
                    boxShadow={ node.isActive ? '0 0 4px rgba(34, 197, 94, 0.5)' : 'none' }
                    animation={ node.isActive ? 'pulseOpacity 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none' }
                  />
                  <Text
                    fontSize="xs"
                    fontWeight={ 500 }
                    color={ getStatusColor(node.isActive, node.enabled) }
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    { getStatusLabel(node.isActive, node.enabled) }
                  </Text>
                  <Text
                    fontSize="xs"
                    fontWeight={ 500 }
                    px={ 2 }
                    py={ 0.5 }
                    borderRadius="sm"
                    bg={{ _light: 'rgba(124, 58, 237, 0.06)', _dark: 'rgba(139, 92, 246, 0.1)' }}
                    color={{ _light: 'rgba(124, 58, 237, 0.8)', _dark: 'rgba(139, 92, 246, 0.9)' }}
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    { typeName }
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <VStack align="stretch" gap={ 0 }>
            { /* TEE ID */ }
            <DetailRow label="TEE ID">
              <Flex alignItems="center" gap={ 2 }>
                <Text
                  fontSize="xs"
                  fontFamily="mono"
                  color={{ _light: 'rgba(0, 0, 0, 0.7)', _dark: 'rgba(255, 255, 255, 0.75)' }}
                  wordBreak="break-all"
                >
                  { node.teeId }
                </Text>
                <EntityBase.Copy text={ node.teeId }/>
              </Flex>
            </DetailRow>

            { /* Owner */ }
            <DetailRow label="Owner">
              <AddressEntity
                address={{ hash: node.owner, is_contract: false }}
                truncation="constant_long"
              />
            </DetailRow>

            { /* Payment Address */ }
            <DetailRow label="Payment Address">
              <AddressEntity
                address={{ hash: node.paymentAddress, is_contract: false }}
                truncation="constant_long"
              />
            </DetailRow>

            { /* Endpoint */ }
            <DetailRow label="Endpoint">
              <Text
                fontSize="sm"
                fontFamily="mono"
                color={{ _light: 'rgba(0, 0, 0, 0.7)', _dark: 'rgba(255, 255, 255, 0.75)' }}
                wordBreak="break-all"
              >
                { node.endpoint || 'N/A' }
              </Text>
            </DetailRow>

            { /* PCR Hash */ }
            <DetailRow label="PCR Hash (Enclave Identity)">
              <Flex alignItems="center" gap={ 2 }>
                <Text
                  fontSize="xs"
                  fontFamily="mono"
                  color={{ _light: 'rgba(0, 0, 0, 0.7)', _dark: 'rgba(255, 255, 255, 0.75)' }}
                  wordBreak="break-all"
                >
                  { node.pcrHash }
                </Text>
                <EntityBase.Copy text={ node.pcrHash }/>
              </Flex>
            </DetailRow>

            { /* Public Key */ }
            <DetailRow label="Signing Public Key">
              <Flex alignItems="center" gap={ 2 }>
                <Text
                  fontSize="xs"
                  fontFamily="mono"
                  color={{ _light: 'rgba(0, 0, 0, 0.7)', _dark: 'rgba(255, 255, 255, 0.75)' }}
                >
                  { truncateBytes(node.publicKey, 40) }
                </Text>
                <EntityBase.Copy text={ node.publicKey }/>
              </Flex>
            </DetailRow>

            { /* TLS Certificate */ }
            <DetailRow label="TLS Certificate">
              <Flex alignItems="center" gap={ 2 }>
                <Text
                  fontSize="xs"
                  fontFamily="mono"
                  color={{ _light: 'rgba(0, 0, 0, 0.7)', _dark: 'rgba(255, 255, 255, 0.75)' }}
                >
                  { truncateBytes(node.tlsCertificate, 40) }
                </Text>
                <EntityBase.Copy text={ node.tlsCertificate }/>
              </Flex>
            </DetailRow>

            { /* Timestamps */ }
            <DetailRow label="Registered">
              <Text
                fontSize="sm"
                color={{ _light: 'rgba(0, 0, 0, 0.7)', _dark: 'rgba(255, 255, 255, 0.75)' }}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                { formatTimestamp(node.registeredAt) }
              </Text>
            </DetailRow>

            <DetailRow label="Last Heartbeat">
              <Flex alignItems="center" gap={ 2 }>
                <Text
                  fontSize="sm"
                  color={{ _light: 'rgba(0, 0, 0, 0.7)', _dark: 'rgba(255, 255, 255, 0.75)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  { formatTimestamp(node.lastHeartbeatAt) }
                </Text>
                { node.isActive && (
                  <Box
                    w="6px"
                    h="6px"
                    borderRadius="50%"
                    bg="green.500"
                    boxShadow="0 0 4px rgba(34, 197, 94, 0.5)"
                  />
                ) }
              </Flex>
            </DetailRow>

            { /* Chain of Trust Visualization */ }
            <Box mt={ 6 } mb={ 2 }>
              <Text
                fontSize="10px"
                fontWeight={ 600 }
                textTransform="uppercase"
                letterSpacing="0.08em"
                color={{ _light: 'rgba(0, 0, 0, 0.35)', _dark: 'rgba(255, 255, 255, 0.35)' }}
                fontFamily="system-ui, -apple-system, sans-serif"
                mb={ 3 }
              >
                Chain of Trust
              </Text>
              <VStack
                align="stretch"
                gap={ 0 }
                bg={{ _light: 'rgba(0, 0, 0, 0.01)', _dark: 'rgba(255, 255, 255, 0.01)' }}
                border="1px solid"
                borderColor={{ _light: 'rgba(0, 0, 0, 0.04)', _dark: 'rgba(255, 255, 255, 0.04)' }}
                p={ 4 }
              >
                { [
                  { label: 'AWS Nitro Hardware', desc: 'Root of trust', color: 'rgba(124, 58, 237' },
                  { label: 'Attestation Document', desc: 'Hardware-signed proof', color: 'rgba(6, 182, 212' },
                  { label: 'PCR Verification', desc: 'Enclave code identity check', color: 'rgba(22, 163, 74' },
                  { label: 'Key Binding', desc: 'Signing key + TLS cert bound to enclave', color: 'rgba(30, 58, 138' },
                  { label: 'On-Chain Record', desc: 'Immutable registration', color: 'rgba(217, 119, 6' },
                  { label: 'Heartbeat Liveness', desc: 'Ongoing cryptographic proof', color: 'rgba(22, 163, 74' },
                ].map((step, i) => (
                  <Flex key={ i } alignItems="center" gap={ 3 } py={ 2 }>
                    <Flex
                      direction="column"
                      alignItems="center"
                      flexShrink={ 0 }
                    >
                      <Box
                        w="8px"
                        h="8px"
                        borderRadius="50%"
                        bg={{ _light: `${ step.color }, 0.3)`, _dark: `${ step.color }, 0.5)` }}
                        border="1.5px solid"
                        borderColor={{ _light: `${ step.color }, 0.5)`, _dark: `${ step.color }, 0.7)` }}
                      />
                      { i < 5 && (
                        <Box
                          w="1px"
                          h="20px"
                          bg={{ _light: 'rgba(0, 0, 0, 0.08)', _dark: 'rgba(255, 255, 255, 0.08)' }}
                        />
                      ) }
                    </Flex>
                    <Box>
                      <Text
                        fontSize="xs"
                        fontWeight={ 600 }
                        color={{ _light: `${ step.color }, 0.8)`, _dark: `${ step.color }, 0.9)` }}
                        fontFamily="system-ui, -apple-system, sans-serif"
                      >
                        { step.label }
                      </Text>
                      <Text
                        fontSize="11px"
                        color={{ _light: 'rgba(0, 0, 0, 0.4)', _dark: 'rgba(255, 255, 255, 0.4)' }}
                        fontFamily="system-ui, -apple-system, sans-serif"
                      >
                        { step.desc }
                      </Text>
                    </Box>
                  </Flex>
                )) }
              </VStack>
            </Box>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default TEENodeDetailDrawer;
