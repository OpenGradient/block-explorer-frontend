import { chakra } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { OPENGRADIENT_BRAND } from 'ui/opengradient/brand';

interface Props {
  percentage: number;
  isLoading: boolean;
}

const GasTrackerNetworkUtilization = ({ percentage, isLoading }: Props) => {
  return (
    <Skeleton loading={ isLoading } whiteSpace="pre-wrap">
      <span>Network utilization </span>
      <chakra.span color={ OPENGRADIENT_BRAND.text.accent }>{ percentage.toFixed(2) }%</chakra.span>
    </Skeleton>
  );
};

export default React.memo(GasTrackerNetworkUtilization);
