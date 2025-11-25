import { Box, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';
import { type Log } from 'types/api/log';
import type { EntityTag as TEntityTag } from 'ui/shared/EntityTags/types';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import { SUPPORTED_INFERENCE_ADDRESSES } from 'lib/inferences/address';
import getQueryParamString from 'lib/router/getQueryParamString';
import { publicClient } from 'lib/web3/client';
import { Skeleton } from 'toolkit/chakra/skeleton';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import RoutedTabsSkeleton from 'toolkit/components/RoutedTabs/RoutedTabsSkeleton';
import useActiveTabFromQuery from 'toolkit/components/RoutedTabs/useActiveTabFromQuery';
import TextAd from 'ui/shared/ad/TextAd';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import ButtonBackTo from 'ui/shared/buttons/ButtonBackTo';
import EntityTags from 'ui/shared/EntityTags/EntityTags';
import TxAssetFlows from 'ui/tx/TxAssetFlows';
import TxAuthorizations from 'ui/tx/TxAuthorizations';
import TxBlobs from 'ui/tx/TxBlobs';
import TxDetails from 'ui/tx/TxDetails';
import TxDetailsDegraded from 'ui/tx/TxDetailsDegraded';
import TxDetailsWrapped from 'ui/tx/TxDetailsWrapped';
import TxInferences from 'ui/tx/TxInferences';
import TxInternals from 'ui/tx/TxInternals';
import TxLogs from 'ui/tx/TxLogs';
import TxRawTrace from 'ui/tx/TxRawTrace';
import TxState from 'ui/tx/TxState';
import TxSubHeading from 'ui/tx/TxSubHeading';
import TxTokenTransfer from 'ui/tx/TxTokenTransfer';
import TxUserOps from 'ui/tx/TxUserOps';
import useTxQuery from 'ui/tx/useTxQuery';

const txInterpretation = config.features.txInterpretation;
const rollupFeature = config.features.rollup;

const TransactionPageContent = () => {
  const router = useRouter();
  const appProps = useAppContext();

  const hash = getQueryParamString(router.query.hash);
  const txQuery = useTxQuery();
  const { data, isPlaceholderData, isError, error, errorUpdateCount } = txQuery;

  const showDegradedView = publicClient && ((isError && error.status !== 422) || isPlaceholderData) && errorUpdateCount > 0;

  /** Used to filter logs for the inferences tab. */
  const filterLogsByAddressHash = React.useCallback((log: Log): boolean => {
    return Boolean(Object.values(SUPPORTED_INFERENCE_ADDRESSES).find((hash) => hash === log.address.hash));
  }, []);

  const tabs: Array<TabItemRegular> = (() => {
    const detailsComponent = showDegradedView ?
      <TxDetailsDegraded hash={ hash } txQuery={ txQuery }/> :
      <TxDetails txQuery={ txQuery }/>;

    return [
      {
        id: 'index',
        title: config.features.suave.isEnabled && data?.wrapped ? 'Confidential compute tx details' : 'Details',
        component: detailsComponent,
      },
      { id: 'inferences', title: 'Inferences', component: <TxInferences txQuery={ txQuery } logsFilter={ filterLogsByAddressHash }/> },
      txInterpretation.isEnabled && txInterpretation.provider === 'noves' ?
        { id: 'asset_flows', title: 'Asset Flows', component: <TxAssetFlows hash={ hash }/> } :
        undefined,
      config.features.suave.isEnabled && data?.wrapped ?
        { id: 'wrapped', title: 'Regular tx details', component: <TxDetailsWrapped data={ data.wrapped }/> } :
        undefined,
      { id: 'token_transfers', title: 'Token transfers', component: <TxTokenTransfer txQuery={ txQuery }/> },
      config.features.userOps.isEnabled ?
        { id: 'user_ops', title: 'User operations', component: <TxUserOps txQuery={ txQuery }/> } :
        undefined,
      { id: 'internal', title: 'Internal txns', component: <TxInternals txQuery={ txQuery }/> },
      config.features.dataAvailability.isEnabled && txQuery.data?.blob_versioned_hashes?.length ?
        { id: 'blobs', title: 'Blobs', component: <TxBlobs txQuery={ txQuery }/> } :
        undefined,
      { id: 'logs', title: 'Logs', component: <TxLogs txQuery={ txQuery }/> },
      { id: 'state', title: 'State', component: <TxState txQuery={ txQuery }/> },
      { id: 'raw_trace', title: 'Raw trace', component: <TxRawTrace txQuery={ txQuery }/> },
      txQuery.data?.authorization_list?.length ?
        { id: 'authorizations', title: 'Authorizations', component: <TxAuthorizations txQuery={ txQuery }/> } :
        undefined,
    ].filter(Boolean);
  })();

  const activeTab = useActiveTabFromQuery(tabs);

  const txTags: Array<TEntityTag> = data?.transaction_tag ?
    [ { slug: data.transaction_tag, name: data.transaction_tag, tagType: 'private_tag' as const, ordinal: 1 } ] : [];
  if (rollupFeature.isEnabled && rollupFeature.interopEnabled && data?.op_interop) {
    if (data.op_interop.init_chain !== undefined) {
      txTags.push({ slug: 'relay_tx', name: 'Relay tx', tagType: 'custom' as const, ordinal: 0 });
    }
    if (data.op_interop.relay_chain !== undefined) {
      txTags.push({ slug: 'init_tx', name: 'Source tx', tagType: 'custom' as const, ordinal: 0 });
    }
  }

  const tags = (
    <EntityTags
      isLoading={ isPlaceholderData }
      tags={ txTags }
    />
  );

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/txs');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to transactions list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const content = (() => {
    if (isPlaceholderData && !showDegradedView) {
      return (
        <>
          <RoutedTabsSkeleton tabs={ tabs } mt={ 6 }/>
          { activeTab?.component }
        </>
      );
    }

    return <RoutedTabs tabs={ tabs }/>;
  })();

  if (isError && !showDegradedView) {
    if (isCustomAppError(error)) {
      throwOnResourceLoadError({ resource: 'tx', error, isError: true });
    }
  }

  return (
    <Box
      as="main"
      position="relative"
      bg={{ _light: '#ffffff', _dark: '#0a0a0a' }}
      minH="100vh"
    >
      <Box
        position="relative"
        zIndex={ 1 }
        maxW={{ base: '100%', xl: '1600px' }}
        mx="auto"
        px={{ base: 4, lg: 8, xl: 12 }}
        pt={{ base: 6, lg: 8 }}
        pb={{ base: 4, lg: 6 }}
      >
        <TextAd mb={ 6 }/>
        { /* Custom Header matching HeroBanner style */ }
        <Box mb={ 6 }>
          <Flex
            flexDir="row"
            flexWrap="wrap"
            rowGap={ 3 }
            columnGap={ 3 }
            alignItems="flex-start"
            mb={ 4 }
          >
            { backLink && (
              <ButtonBackTo
                hint={ backLink.label }
                href={ backLink.url }
                mr={ 3 }
              />
            ) }
            <Box flex="1" minW={ 0 }>
              <Text
                fontSize={{ base: '30px', md: '44px', lg: '50px', xl: '56px' }}
                fontWeight={ 200 }
                letterSpacing="-0.04em"
                lineHeight="0.95"
                color={{ _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 0.98)' }}
                fontFamily="system-ui, -apple-system, sans-serif"
                mb={ 6 }
              >
                Transaction details
              </Text>
              <Skeleton loading={ isPlaceholderData }>
                <Box
                  fontSize={{ base: '14px', md: '16px' }}
                  fontWeight={ 400 }
                  letterSpacing="0.02em"
                  color={{ _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' }}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  <TxSubHeading hash={ hash } hasTag={ Boolean(data?.transaction_tag) } txQuery={ txQuery }/>
                </Box>
              </Skeleton>
            </Box>
            { tags && (
              <Box flexShrink={ 0 }>
                { tags }
              </Box>
            ) }
          </Flex>
        </Box>
        { content }
      </Box>
    </Box>
  );
};

export default TransactionPageContent;
