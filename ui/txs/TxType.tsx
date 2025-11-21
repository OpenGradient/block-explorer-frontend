import React from 'react';

import type { TransactionType } from 'types/api/transaction';

import type { BadgeProps } from 'toolkit/chakra/badge';
import { Badge } from 'toolkit/chakra/badge';

export interface Props {
  types: Array<TransactionType>;
  isLoading?: boolean;
}

const TYPES_ORDER: Array<TransactionType> = [
  'blob_transaction',
  'rootstock_remasc',
  'rootstock_bridge',
  'token_creation',
  'contract_creation',
  'token_transfer',
  'contract_call',
  'coin_transfer',
];

const TxType = ({ types, isLoading }: Props) => {
  const typeToShow = types.sort((t1, t2) => TYPES_ORDER.indexOf(t1) - TYPES_ORDER.indexOf(t2))[0];

  let label;
  let colorPalette: BadgeProps['colorPalette'];

  switch (typeToShow) {
    case 'contract_call':
      label = 'Contract Call';
      colorPalette = 'blue';
      break;
    case 'blob_transaction':
      label = 'Blob';
      colorPalette = 'yellow';
      break;
    case 'contract_creation':
      label = 'Create';
      colorPalette = 'blue';
      break;
    case 'token_transfer':
      label = 'Transfer';
      colorPalette = 'orange';
      break;
    case 'token_creation':
      label = 'Token';
      colorPalette = 'orange';
      break;
    case 'coin_transfer':
      label = 'Transfer';
      colorPalette = 'orange';
      break;
    case 'rootstock_remasc':
      label = 'REMASC';
      colorPalette = 'blue';
      break;
    case 'rootstock_bridge':
      label = 'Bridge';
      colorPalette = 'blue';
      break;
    default:
      label = 'Txn';
      colorPalette = 'purple';

  }

  return (
    <Badge
      colorPalette={ colorPalette }
      loading={ isLoading }
      textStyle="xs"
      px={ 1.5 }
      py={ 0.5 }
      minH="5"
    >
      { label }
    </Badge>
  );
};

export default TxType;
