import { chakra } from '@chakra-ui/react';
import React from 'react';

import { Alert } from 'toolkit/chakra/alert';

const DataFetchAlert = ({ className }: { className?: string }) => {
  return (
    <Alert status="error" width="fit-content" className={ className }>
      Something went wrong. Try refreshing the page or come back later.
    </Alert>
  );
};

export default chakra(DataFetchAlert);
