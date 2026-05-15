import { Box, type BoxProps } from '@chakra-ui/react';
import React from 'react';

import { OPENGRADIENT_BRAND } from 'ui/opengradient/brand';

type Props = BoxProps & {
  children: React.ReactNode;
};

const ExplorerPageSurface = ({ children, ...props }: Props) => {
  return (
    <Box
      bg={ OPENGRADIENT_BRAND.panel.bg }
      borderWidth="1px"
      borderColor={ OPENGRADIENT_BRAND.panel.border }
      borderRadius="8px"
      boxShadow={ OPENGRADIENT_BRAND.panel.shadow }
      overflow="hidden"
      { ...props }
    >
      { children }
    </Box>
  );
};

export default ExplorerPageSurface;
