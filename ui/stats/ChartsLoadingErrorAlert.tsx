import { Text } from '@chakra-ui/react';
import React from 'react';

import { apos } from 'lib/html-entities';
import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';

function ChartsLoadingErrorAlert() {
  return (
    <Alert status="warning" mb={ 4 } closable>
      <Text mr={ 2 }>
        { `Some of the charts did not load because the server didn${ apos }t respond. To reload charts ` }
        <Link href={ window.document.location.href }>click once again.</Link>
      </Text>
    </Alert>
  );
}

export default ChartsLoadingErrorAlert;
