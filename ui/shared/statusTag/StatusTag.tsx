import { chakra } from '@chakra-ui/react';
import React from 'react';

import capitalizeFirstLetter from 'lib/capitalizeFirstLetter';
import type { BadgeProps } from 'toolkit/chakra/badge';
import { Badge } from 'toolkit/chakra/badge';
import { Tooltip } from 'toolkit/chakra/tooltip';

export type StatusTagType = 'ok' | 'error' | 'pending';

export interface Props {
  type: 'ok' | 'error' | 'pending';
  text: string;
  errorText?: string | null;
  isLoading?: boolean;
  className?: string;
}

const StatusTag = ({ type, text, errorText, isLoading, className }: Props) => {
  let colorPalette: BadgeProps['colorPalette'];

  const capitalizedText = capitalizeFirstLetter(text);

  switch (type) {
    case 'ok':
      colorPalette = 'green';
      break;
    case 'error':
      colorPalette = 'gray';
      break;
    case 'pending':
      colorPalette = 'gray';
      break;
  }

  return (
    <Tooltip content={ errorText } disabled={ !errorText }>
      <Badge
        colorPalette={ colorPalette }
        loading={ isLoading }
        className={ className }
        textStyle="xs"
        px={ 1.5 }
        py={ 0.5 }
        minH="5"
      >
        { capitalizedText }
      </Badge>
    </Tooltip>
  );
};

export default chakra(StatusTag);
