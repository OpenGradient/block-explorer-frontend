import React from 'react';

import type { TimeChartData } from 'ui/shared/chart/types';

import { useColorModeValue } from 'toolkit/chakra/color-mode';
import ChartArea from 'ui/shared/chart/ChartArea';
import ChartAxis from 'ui/shared/chart/ChartAxis';
import ChartGridLine from 'ui/shared/chart/ChartGridLine';
import ChartLine from 'ui/shared/chart/ChartLine';
import ChartOverlay from 'ui/shared/chart/ChartOverlay';
import ChartTooltip from 'ui/shared/chart/ChartTooltip';
import useTimeChartController from 'ui/shared/chart/useTimeChartController';

interface Props {
  data: TimeChartData;
  caption?: string;
  isEmpty?: boolean;
}

const CHART_MARGIN = { bottom: 0, left: 0, right: 0, top: 0 };

const ChainIndicatorChartContent = ({ data, isEmpty = false }: Props) => {
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

  const hasData = !isEmpty && data[0]?.items.length > 0;

  // For ghost chart, render a flat line at the baseline (0 or middle of domain)
  const ghostLineY = React.useMemo(() => {
    if (!isEmpty) return null;
    const domain = axes.y.scale.domain();
    const baseline = domain[0] || 0;
    return axes.y.scale(baseline);
  }, [ isEmpty, axes.y ]);

  return (
    <svg width="100%" height="100%" ref={ ref } style={{ overflow: 'visible' }}>
      <g transform={ `translate(${ chartMargin.left || 0 },${ chartMargin.top || 0 })` } opacity={ rect ? 1 : 0 }>
        { /* Always render grid lines and axes (ghost chart) */ }
        <ChartGridLine
          type="horizontal"
          scale={ axes.y.scale }
          ticks={ 3 }
          size={ innerWidth }
          noAnimation
        />
        <ChartAxis
          type="left"
          scale={ axes.y.scale }
          ticks={ 0 }
          noAnimation
        />
        <ChartAxis
          type="bottom"
          scale={ axes.x.scale }
          transform={ `translate(0, ${ innerHeight })` }
          ticks={ 0 }
          noAnimation
        />
        { /* Render flat line for ghost chart */ }
        { isEmpty && ghostLineY !== null && (
          <line
            x1={ 0 }
            y1={ ghostLineY }
            x2={ innerWidth }
            y2={ ghostLineY }
            stroke={ lineColor }
            strokeWidth={ 2 }
            opacity={ 0.5 }
          />
        ) }
        { /* Only render data visualization if there's actual data */ }
        { hasData && (
          <>
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
          </>
        ) }
      </g>
    </svg>
  );
};

export default React.memo(ChainIndicatorChartContent);
