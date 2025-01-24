import type { GridProps, HTMLChakraProps } from '@chakra-ui/react';
import { Box, Grid, Flex, Text, Link, VStack, useColorModeValue, Image } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';
import Skeleton from 'ui/shared/chakra/Skeleton';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

import { LogoFallback } from '../networkMenu/NetworkLogo';
import FooterLinkItem, { type FooterLinkItemProps } from './FooterLinkItem';
import IntTxsIndexingStatus from './IntTxsIndexingStatus';

const MAX_LINKS_COLUMNS = 4;

const Footer = () => {
  const logoColor = useColorModeValue('blue.600', 'white');
  const logoSrc = useColorModeValue(config.UI.navigation.logo.default, config.UI.navigation.logo.dark || config.UI.navigation.logo.default);
  const darkModeFilter = { filter: 'brightness(0) invert(1)' };
  const logoStyle = useColorModeValue({}, !config.UI.navigation.logo.dark ? darkModeFilter : {});

  const BLOCKSCOUT_LINKS: Array<FooterLinkItemProps> = [
    {
      icon: 'social/git' as const,
      iconSize: '18px',
      text: 'GitHub',
      url: 'https://github.com/OpenGradient',
    },
    {
      icon: 'social/twitter' as const,
      iconSize: '18px',
      text: 'X (ex-Twitter)',
      url: 'https://x.com/OpenGradient',
    },
    {
      icon: 'social/discord' as const,
      iconSize: '24px',
      text: 'Discord',
      url: 'https://discord.gg/opengradient',
    },
    {
      icon: 'ABI',
      iconSize: '24px',
      text: 'Docs',
      url: 'https://docs.opengradient.ai/',
    },
    {
      icon: 'block' as const,
      iconSize: '22px',
      text: 'Model Hub',
      url: 'https://hub.opengradient.ai/',
    },
    {
      icon: 'token' as const,
      iconSize: '22px',
      text: 'Faucet',
      url: 'https://faucet.opengradient.ai/',
    },
  ];

  const fetch = useFetch();

  const { isPlaceholderData, data: linksData } = useQuery<unknown, ResourceError<unknown>, Array<CustomLinksGroup>>({
    queryKey: [ 'footer-links' ],
    queryFn: async() => fetch(config.UI.footer.links || '', undefined, { resource: 'footer-links' }),
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
    placeholderData: [],
  });

  const colNum = isPlaceholderData ? 1 : Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;

  const renderNetworkInfo = React.useCallback((gridArea?: GridProps['gridArea']) => {
    return (
      <Flex
        gridArea={ gridArea }
        flexWrap="wrap"
        columnGap={ 8 }
        rowGap={ 6 }
        mb={{ base: 5, lg: 10 }}
        _empty={{ display: 'none' }}
      >
        { !config.UI.indexingAlert.intTxs.isHidden && <IntTxsIndexingStatus/> }
        <NetworkAddToWallet/>
      </Flex>
    );
  }, []);

  const renderProjectInfo = React.useCallback((gridArea?: GridProps['gridArea']) => {
    return (
      <Box gridArea={ gridArea }>
        <Flex columnGap={ 2 } fontSize="xs" lineHeight={ 5 } alignItems="center" color="text">
          <span>Powered by</span>
          <Link href="https://www.opengradient.ai" isExternal display="inline-flex" color={ logoColor } _hover={{ color: logoColor }}>
            { /* Using NetworkLogo does not work because it's already a link - nested links are not possible */ }
            <Image
              w="80px"
              h={ 4 }
              src={ logoSrc }
              alt={ `${ config.chain.name } network logo` }
              fallback={ <LogoFallback isCollapsed={ false }/> }
              style={ logoStyle }
            />
          </Link>
        </Flex>
        <Text mt={ 3 } fontSize="xs">
          OpenGradient is an end-to-end decentralized infrastructure network
          for AI model hosting, secure execution, agentic reasoning, and application deployment.
        </Text>
        { /* <Box mt={ 6 } alignItems="start" fontSize="xs" lineHeight={ 5 }>
          { apiVersionUrl && (
            <Text>
              Backend: <Link href={ apiVersionUrl } target="_blank">{ backendVersionData?.backend_version }</Link>
            </Text>
          ) }
          { frontendLink && (
            <Text>
              Frontend: { frontendLink }
            </Text>
          ) }
          <Text>
            Copyright { copy } Blockscout Limited 2023-{ (new Date()).getFullYear() }
          </Text>
        </Box> */ }
      </Box>
    );
  }, [ logoColor, logoSrc, logoStyle ]);

  const containerProps: HTMLChakraProps<'div'> = {
    as: 'footer',
    borderTopWidth: '1px',
    borderTopColor: 'solid',
  };

  const contentProps: GridProps = {
    px: { base: 4, lg: config.UI.navigation.layout === 'horizontal' ? 6 : 12, '2xl': 6 },
    py: { base: 4, lg: 8 },
    gridTemplateColumns: { base: '1fr', lg: 'minmax(auto, 470px) 1fr' },
    columnGap: { lg: '32px', xl: '100px' },
    maxW: `${ CONTENT_MAX_WIDTH }px`,
    m: '0 auto',
  };

  const renderRecaptcha = (gridArea?: GridProps['gridArea']) => {
    if (!config.services.reCaptchaV2.siteKey) {
      return <Box gridArea={ gridArea }/>;
    }

    return (
      <Box gridArea={ gridArea } fontSize="xs" lineHeight={ 5 } mt={ 6 } color="text">
        <span>This site is protected by reCAPTCHA and the Google </span>
        <Link href="https://policies.google.com/privacy" isExternal>Privacy Policy</Link>
        <span> and </span>
        <Link href="https://policies.google.com/terms" isExternal>Terms of Service</Link>
        <span> apply.</span>
      </Box>
    );
  };

  if (config.UI.footer.links) {
    return (
      <Box { ...containerProps }>
        <Grid { ...contentProps }>
          <div>
            { renderNetworkInfo() }
            { renderProjectInfo() }
            { renderRecaptcha() }
          </div>

          <Grid
            gap={{ base: 6, lg: colNum === MAX_LINKS_COLUMNS + 1 ? 2 : 8, xl: 12 }}
            gridTemplateColumns={{
              base: 'repeat(auto-fill, 160px)',
              lg: `repeat(${ colNum }, 135px)`,
              xl: `repeat(${ colNum }, 160px)`,
            }}
            justifyContent={{ lg: 'flex-end' }}
            mt={{ base: 8, lg: 0 }}
          >
            {
              ([
                { title: 'Blockscout', links: BLOCKSCOUT_LINKS },
                ...(linksData || []),
              ])
                .slice(0, colNum)
                .map(linkGroup => (
                  <Box key={ linkGroup.title }>
                    <Skeleton fontWeight={ 500 } mb={ 3 } display="inline-block" isLoaded={ !isPlaceholderData }>{ linkGroup.title }</Skeleton>
                    <VStack spacing={ 1 } alignItems="start">
                      { linkGroup.links.map(link => <FooterLinkItem { ...link } key={ link.text } isLoading={ isPlaceholderData }/>) }
                    </VStack>
                  </Box>
                ))
            }
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box { ...containerProps } paddingBottom={{ lg: 20 }}>
      <Grid
        { ...contentProps }
        gridTemplateAreas={{
          lg: `
          "network links-top"
          "info links-bottom"
          "recaptcha links-bottom"
        `,
        }}
      >

        { renderNetworkInfo({ lg: 'network' }) }
        { renderProjectInfo({ lg: 'info' }) }
        { renderRecaptcha({ lg: 'recaptcha' }) }

        <Grid
          gridArea={{ lg: 'links-bottom' }}
          gap={ 1 }
          gridTemplateColumns={{
            base: 'repeat(auto-fill, 160px)',
            lg: 'repeat(2, 160px)',
            xl: 'repeat(3, 160px)',
          }}
          gridTemplateRows={{
            base: 'auto',
            lg: 'repeat(3, auto)',
            xl: 'repeat(2, auto)',
          }}
          gridAutoFlow={{ base: 'row', lg: 'column' }}
          alignContent="start"
          justifyContent={{ lg: 'flex-end' }}
          mt={{ base: 8, lg: 0 }}
        >
          { BLOCKSCOUT_LINKS.map(link => <FooterLinkItem { ...link } key={ link.text }/>) }
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(Footer);
