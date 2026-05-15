import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { OPENGRADIENT_BRAND } from 'ui/opengradient/brand';

import PageTitle from './PageTitle';

type Props = {
  title: string;
  eyebrow?: string;
  description?: React.ReactNode;
  secondRow?: React.ReactNode;
  withTextAd?: boolean;
};

const ExplorerPageTitle = ({ title, eyebrow, description, secondRow, withTextAd }: Props) => {
  const composedSecondRow = description || secondRow ? (
    <Flex
      flexDir="column"
      gap={ secondRow && description ? 3 : 0 }
      maxW="100%"
      w="100%"
    >
      { description && (
        <Text
          color={ OPENGRADIENT_BRAND.text.secondary }
          fontSize={{ base: 'sm', lg: 'md' }}
          lineHeight="1.65"
          maxW="760px"
        >
          { description }
        </Text>
      ) }
      { secondRow }
    </Flex>
  ) : undefined;

  return (
    <Box>
      { eyebrow && (
        <Text
          color={ OPENGRADIENT_BRAND.text.accent }
          fontFamily={ OPENGRADIENT_BRAND.fonts.mono }
          fontSize="xs"
          fontWeight={ 700 }
          lineHeight="1"
          mb={ 3 }
          textTransform="uppercase"
        >
          / { eyebrow }
        </Text>
      ) }
      <PageTitle
        title={ title }
        secondRow={ composedSecondRow }
        withTextAd={ withTextAd }
      />
    </Box>
  );
};

export default React.memo(ExplorerPageTitle);
