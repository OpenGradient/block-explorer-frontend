import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import dayjs from 'lib/date/dayjs';
import type { TEENodeWithStatus } from 'lib/opengradient/contracts/teeRegistry';
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerHeader, DrawerRoot, DrawerTitle } from 'toolkit/chakra/drawer';
import { OPENGRADIENT_BRAND } from 'ui/opengradient/brand';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as EntityBase from 'ui/shared/entities/base/components';

type Props = {
  node: TEENodeWithStatus;
  typeName: string;
  onClose: () => void;
};

const { colors, fonts, panel, text } = OPENGRADIENT_BRAND;

const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Box
    py={ 3 }
    borderBottom="1px solid"
    borderColor={ panel.border }
  >
    <Text
      fontSize="10px"
      fontWeight={ 500 }
      textTransform="uppercase"
      letterSpacing="0.08em"
      color={ text.muted }
      fontFamily={ fonts.mono }
      mb={ 1 }
    >
      { label }
    </Text>
    { children }
  </Box>
);

function getStatusBg(isActive: boolean, enabled: boolean) {
  if (isActive) return '#61d199';
  if (enabled) return '#d6a33d';
  return '#708195';
}

function getStatusColor(isActive: boolean, enabled: boolean) {
  if (isActive) return { _light: '#23824f', _dark: '#61d199' };
  if (enabled) return { _light: '#9d6d10', _dark: '#d6a33d' };
  return text.muted;
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
      <DrawerContent
        bg={{ _light: '#ffffff', _dark: '#0a0f19' }}
        borderLeft="1px solid"
        borderColor={ panel.border }
      >
        <DrawerCloseTrigger/>
        <DrawerHeader>
          <DrawerTitle>
            <Flex alignItems="center" gap={ 3 }>
              <Box>
                <Text
                  fontSize="lg"
                  fontWeight={ 600 }
                  fontFamily={ fonts.sans }
                  color={ text.primary }
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
                    fontFamily={ fonts.mono }
                  >
                    { getStatusLabel(node.isActive, node.enabled) }
                  </Text>
                  <Text
                    fontSize="xs"
                    fontWeight={ 500 }
                    px={ 2 }
                    py={ 0.5 }
                    borderRadius="6px"
                    bg={{ _light: 'rgba(36, 188, 227, 0.10)', _dark: 'rgba(36, 188, 227, 0.13)' }}
                    color={ text.accent }
                    fontFamily={ fonts.mono }
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
                  fontFamily={ fonts.mono }
                  color={ text.secondary }
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
                fontFamily={ fonts.mono }
                color={ text.secondary }
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
                  fontFamily={ fonts.mono }
                  color={ text.secondary }
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
                  fontFamily={ fonts.mono }
                  color={ text.secondary }
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
                  fontFamily={ fonts.mono }
                  color={ text.secondary }
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
                color={ text.secondary }
                fontFamily={ fonts.sans }
              >
                { formatTimestamp(node.registeredAt) }
              </Text>
            </DetailRow>

            <DetailRow label="Last Heartbeat">
              <Flex alignItems="center" gap={ 2 }>
                <Text
                  fontSize="sm"
                  color={ text.secondary }
                  fontFamily={ fonts.sans }
                >
                  { formatTimestamp(node.lastHeartbeatAt) }
                </Text>
                { node.isActive && (
                  <Box
                    w="6px"
                    h="6px"
                    borderRadius="50%"
                    bgColor={ colors.cyan }
                    boxShadow="0 0 4px rgba(34, 197, 94, 0.5)"
                  />
                ) }
              </Flex>
            </DetailRow>

            { /* Chain of Trust Visualization */ }
            <Box mt={ 6 } mb={ 2 }>
              <Text
                fontSize="10px"
                fontWeight={ 500 }
                textTransform="uppercase"
                letterSpacing="0.08em"
                color={ text.muted }
                fontFamily={ fonts.mono }
                mb={ 3 }
              >
                Chain of Trust
              </Text>
              <VStack
                align="stretch"
                gap={ 0 }
                bg={ panel.bg }
                border="1px solid"
                borderColor={ panel.border }
                borderRadius="8px"
                p={ 4 }
              >
                { [
                  { label: 'AWS Nitro Hardware', desc: 'Root of trust', color: '#50c9e9' },
                  { label: 'Attestation Document', desc: 'Hardware-signed proof', color: '#24bce3' },
                  { label: 'PCR Verification', desc: 'Enclave code identity check', color: '#61d199' },
                  { label: 'Key Binding', desc: 'Signing key + TLS cert bound to enclave', color: '#1d96b6' },
                  { label: 'On-Chain Record', desc: 'Immutable registration', color: '#d6a33d' },
                  { label: 'Heartbeat Liveness', desc: 'Ongoing cryptographic proof', color: '#61d199' },
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
                        bg={ step.color }
                        border="1.5px solid"
                        borderColor={ step.color }
                        opacity={ 0.8 }
                      />
                      { i < 5 && (
                        <Box
                          w="1px"
                          h="20px"
                          bg={ panel.border }
                        />
                      ) }
                    </Flex>
                    <Box>
                      <Text
                        fontSize="xs"
                        fontWeight={ 600 }
                        color={ text.primary }
                        fontFamily={ fonts.sans }
                      >
                        { step.label }
                      </Text>
                      <Text
                        fontSize="11px"
                        color={ text.muted }
                        fontFamily={ fonts.sans }
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
