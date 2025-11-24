import { Box, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';

interface InjectedProps {
  content: React.ReactNode;
}

interface Props {
  type?: 'transaction' | 'token_transfer' | 'deposit' | 'block';
  children?: (props: InjectedProps) => React.JSX.Element;
  className?: string;
  url: string;
  alert?: string;
  num?: number;
  isLoading?: boolean;
}

const SocketNewItemsNotice = chakra(({ children, className, url, num, alert, type = 'transaction', isLoading }: Props) => {
  const alertContent = (() => {
    if (alert) {
      return alert;
    }

    let name;

    switch (type) {
      case 'token_transfer':
        name = 'token transfer';
        break;
      case 'deposit':
        name = 'deposit';
        break;
      case 'block':
        name = 'block';
        break;
      default:
        name = 'transaction';
        break;
    }

    if (!num) {
      return `🔍 Monitoring new ${ name }s...`;
    }

    return (
      <>
        <Link
          href={ url }
          fontWeight={ 500 }
          color={{ _light: 'rgba(0, 0, 0, 0.8)', _dark: 'rgba(255, 255, 255, 0.9)' }}
          _hover={{
            textDecoration: 'underline',
            color: { _light: 'rgba(0, 0, 0, 0.95)', _dark: 'rgba(255, 255, 255, 1)' },
          }}
          transition="color 0.2s ease"
        >
          { num.toLocaleString() } more { name }{ num > 1 ? 's' : '' }
        </Link>
        <Text whiteSpace="pre" as="span"> ha{ num > 1 ? 've' : 's' } come in</Text>
      </>
    );
  })();

  const content = !isLoading ? (
    <Box
      className={ className }
      bg={{ _light: 'rgba(59, 130, 246, 0.05)', _dark: 'rgba(59, 130, 246, 0.1)' }}
      borderBottom="1px solid"
      borderColor={{ _light: 'rgba(0, 0, 0, 0.06)', _dark: 'rgba(64, 209, 219, 0.1)' }}
      px={ 4 }
      py={ 3 }
      fontSize="12px"
      fontFamily="system-ui, -apple-system, sans-serif"
      color={{ _light: 'rgba(0, 0, 0, 0.6)', _dark: 'rgba(255, 255, 255, 0.7)' }}
      fontWeight={ 400 }
    >
      { alertContent }
    </Box>
  ) : <Skeleton className={ className } h="36px" loading/>;

  return children ? children({ content }) : content;
});

export default SocketNewItemsNotice;

export const Desktop = ({ ...props }: Props) => {
  return (
    <SocketNewItemsNotice
      borderRadius={ props.isLoading ? 'sm' : 0 }
      h={ props.isLoading ? 5 : 'auto' }
      maxW={ props.isLoading ? '215px' : undefined }
      w="100%"
      mx={ props.isLoading ? 4 : 0 }
      my={ props.isLoading ? '6px' : 0 }
      { ...props }
    >
      { ({ content }) => <TableRow><TableCell colSpan={ 100 } p={ 0 } _first={{ p: 0 }} _last={{ p: 0 }}>{ content }</TableCell></TableRow> }
    </SocketNewItemsNotice>
  );
};

export const Mobile = ({ ...props }: Props) => {
  return (
    <SocketNewItemsNotice
      borderBottomRadius={ 0 }
      { ...props }
    />
  );
};
