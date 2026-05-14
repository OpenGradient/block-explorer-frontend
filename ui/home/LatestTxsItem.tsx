import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { route } from 'nextjs-routes';

import { SUPPORTED_INFERENCE_ADDRESSES } from 'lib/inferences/address';
import { LinkBox, LinkOverlay, Link } from 'toolkit/chakra/link';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

import { HOME_BRAND } from './brand';
import useInferenceType from './useInferenceType';

const { colors, fonts, text } = HOME_BRAND;

type Props = {
  tx: Transaction;
  isLoading?: boolean;
};

const formatHash = (hash: string) => `${ hash.slice(0, 10) }...${ hash.slice(-4) }`;

const LatestTxsItem = ({ tx, isLoading }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;
  const hasInference = tx.to?.hash === SUPPORTED_INFERENCE_ADDRESSES.InferenceHub ||
                       tx.to?.hash === SUPPORTED_INFERENCE_ADDRESSES.LLMInference;
  const inferenceInfo = useInferenceType(tx, isLoading || false);
  const txUrl = route({ pathname: '/tx/[hash]', query: { hash: tx.hash } });

  const isContractCreation = !tx.to && tx.created_contract;
  const txKind = (() => {
    if (isContractCreation) {
      return 'Deploy';
    }

    return tx.to?.is_contract ? 'Call' : 'Send';
  })();

  return (
    <LinkBox
      py={{ base: 4, lg: 3 }}
      px={{ base: 4, lg: 4 }}
      width="100%"
      display={{ base: 'none', lg: 'block' }}
      position="relative"
      borderRadius="6px"
      transition="background-color 0.18s ease"
      _hover={{
        bg: { _light: 'rgba(36, 188, 227, 0.04)', _dark: 'rgba(36, 188, 227, 0.05)' },
      }}
    >
      <LinkOverlay href={ txUrl } noIcon/>
      <Flex alignItems="center" gap={ 3 }>
        <Box
          flexShrink={ 0 }
          minW="56px"
          px={ 2 }
          py={ 0.5 }
          borderRadius="6px"
          textAlign="center"
          border="1px solid"
          borderColor={{ _light: 'rgba(36, 188, 227, 0.5)', _dark: 'rgba(36, 188, 227, 0.45)' }}
          color={ text.accent }
          fontFamily={ fonts.mono }
          fontSize="9px"
          fontWeight={ 500 }
          letterSpacing="0.10em"
          textTransform="uppercase"
        >
          { txKind }
        </Box>

        <Box minW={ 0 } flex="1.4">
          <Text
            fontFamily={ fonts.mono }
            fontSize="13px"
            fontWeight={ 500 }
            color={ text.primary }
            lineHeight="1.2"
            mb={ 0.5 }
            truncate
          >
            { isLoading ? '0x000000...0000' : formatHash(tx.hash) }
          </Text>
          <TimeAgoWithTooltip
            timestamp={ tx.timestamp }
            enableIncrement
            isLoading={ isLoading }
            color={ text.muted }
            fontSize="10px"
            fontWeight={ 400 }
            fontFamily={ fonts.mono }
          />
        </Box>

        <Flex flex="2" minW={ 0 } alignItems="center" gap={ 2 } fontFamily={ fonts.mono } fontSize="12px">
          <Box minW={ 0 } flex={ 1 }>
            <AddressEntity address={ tx.from } isLoading={ isLoading } noIcon noCopy truncation="constant"/>
          </Box>
          <Box flexShrink={ 0 } color={ colors.cyan } opacity={ 0.7 }>
            <IconSvg name="arrows/east" boxSize={ 3.5 }/>
          </Box>
          <Box minW={ 0 } flex={ 1 }>
            { dataTo ? (
              <AddressEntity address={ dataTo } isLoading={ isLoading } noIcon noCopy truncation="constant"/>
            ) : (
              <Text fontFamily={ fonts.sans } fontSize="11px" color={ text.muted }>-</Text>
            ) }
          </Box>
        </Flex>

        <Box flex="0.9" minW={ 0 }>
          { hasInference && inferenceInfo && !inferenceInfo.isLoading ? (
            <HStack gap={ 1.5 } align="center">
              <Box
                px={ 2 }
                py={ 0.5 }
                borderRadius="999px"
                bg={{ _light: 'rgba(36, 188, 227, 0.12)', _dark: 'rgba(36, 188, 227, 0.15)' }}
                border="1px solid"
                borderColor={{ _light: 'rgba(36, 188, 227, 0.35)', _dark: 'rgba(36, 188, 227, 0.4)' }}
                color={ text.accent }
                fontFamily={ fonts.mono }
                fontSize="8px"
                fontWeight={ 500 }
                letterSpacing="0.08em"
                textTransform="uppercase"
              >
                { inferenceInfo.type || 'AI' }
              </Box>
              { inferenceInfo.modelCID && (
                <Link
                  href={ `https://walruscan.com/mainnet/blob/${ inferenceInfo.modelCID }` }
                  external
                  fontFamily={ fonts.mono }
                  fontSize="11px"
                  color={ text.secondary }
                  _hover={{ color: colors.cyan }}
                >
                  { inferenceInfo.modelCID.slice(0, 6) }...
                </Link>
              ) }
            </HStack>
          ) : (
            <Text
              fontFamily={ fonts.sans }
              fontSize="11px"
              color={ text.muted }
            >
              -
            </Text>
          ) }
        </Box>
      </Flex>
    </LinkBox>
  );
};

export default React.memo(LatestTxsItem);
