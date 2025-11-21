import React from 'react';

import type { TimeChartData } from 'ui/shared/chart/types';

import { useColorModeValue } from 'toolkit/chakra/color-mode';
import ChartArea from 'ui/shared/chart/ChartArea';
import ChartLine from 'ui/shared/chart/ChartLine';
import ChartOverlay from 'ui/shared/chart/ChartOverlay';
import ChartTooltip from 'ui/shared/chart/ChartTooltip';
import useTimeChartController from 'ui/shared/chart/useTimeChartController';

interface Props {
  data: TimeChartData;
  caption?: string;
}

const CHART_MARGIN = { bottom: 0, left: 0, right: 0, top: 0 };

const ChainIndicatorChartContent = ({ data }: Props) => {
  const overlayRef = React.useRef<SVGRectElement>(null);

  // Use subtle colors matching the design system
  const lineColor = useColorModeValue(
    'rgba(79, 172, 254, 0.5)',
    'rgba(96, 165, 250, 0.5)',
  );
  const areaColor = useColorModeValue(
    'rgba(79, 172, 254, 0.15)',
    'rgba(96, 165, 250, 0.15)',
  );

  const axesConfig = React.useMemo(() => {
    return {
      x: { ticks: 0, noLabel: true },
      y: { ticks: 0, nice: true, noLabel: true },
    };
  }, [ ]);

  const { rect, ref, axes, innerWidth, innerHeight, chartMargin } = useTimeChartController({
    data,
    margin: CHART_MARGIN,
    axesConfig,
  });

  return (
    <svg width="100%" height="100%" ref={ ref } style={{ overflow: 'visible' }}>
      <g transform={ `translate(${ chartMargin.left || 0 },${ chartMargin.top || 0 })` } opacity={ rect ? 1 : 0 }>
        <ChartArea
          data={ data[0].items }
          xScale={ axes.x.scale }
          yScale={ axes.y.scale }
          color={ areaColor }
          noAnimation
        />
        <ChartLine
          data={ data[0].items }
          xScale={ axes.x.scale }
          yScale={ axes.y.scale }
          stroke={ lineColor }
          animation="left"
          strokeWidth={ 2 }
        />
        <ChartOverlay ref={ overlayRef } width={ innerWidth } height={ innerHeight }>
          <ChartTooltip
            anchorEl={ overlayRef.current }
            width={ innerWidth }
            height={ innerHeight }
            xScale={ axes.x.scale }
            yScale={ axes.y.scale }
            data={ data }
          />
        </ChartOverlay>
      </g>
    </svg>
  );
};

export default React.memo(ChainIndicatorChartContent);
