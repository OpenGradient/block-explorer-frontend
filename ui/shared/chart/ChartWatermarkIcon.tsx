import { chakra, type BoxProps } from '@chakra-ui/react';
import React from 'react';

const ChartWatermarkIcon = (props: BoxProps) => {
  return (
    <chakra.img
      src="/static/opengradient/opengradient-logo-dark.svg"
      alt=""
      aria-hidden
      { ...props }
      position="absolute"
      opacity={{ _light: 0.08, _dark: 0.1 }}
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      pointerEvents="none"
      objectFit="contain"
    />
  );
};

export default ChartWatermarkIcon;
