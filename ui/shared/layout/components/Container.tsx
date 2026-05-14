import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: Props) => {
  return (
    <Box
      className={ className }
      minWidth="100vw"
      w="100%"
      m="0 auto"
      bgColor={{ _light: '#f4fcfe', _dark: '#0a0f19' }}
    >
      { children }
    </Box>
  );
};

export default React.memo(chakra(Container));
