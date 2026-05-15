import { Text } from '@chakra-ui/react';
import React from 'react';

import * as cookies from 'lib/cookies';
import { COLOR_THEMES } from 'lib/settings/colorTheme';
import { Button } from 'toolkit/chakra/button';
import { useColorMode } from 'toolkit/chakra/color-mode';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  variant?: 'icon' | 'full';
};

const getTheme = (mode: 'light' | 'dark') => {
  if (mode === 'light') {
    return COLOR_THEMES.find((theme) => theme.id === 'light') ?? COLOR_THEMES[0];
  }

  return COLOR_THEMES.find((theme) => theme.id === 'dark') ?? COLOR_THEMES.filter((theme) => theme.colorMode === 'dark').slice(-1)[0];
};

const persistColorMode = (mode: 'light' | 'dark') => {
  const theme = getTheme(mode);
  const varName = theme.colorMode === 'light' ? '--chakra-colors-white' : '--chakra-colors-black';

  window.document.documentElement.style.setProperty(varName, theme.hex);
  cookies.set(cookies.NAMES.COLOR_MODE_HEX, theme.hex);
  cookies.set(cookies.NAMES.COLOR_MODE, theme.colorMode);
  window.localStorage.setItem(cookies.NAMES.COLOR_MODE, theme.colorMode);
};

const ColorModeToggle = ({ variant = 'icon' }: Props) => {
  const { colorMode, setColorMode } = useColorMode();
  const nextMode = colorMode === 'light' ? 'dark' : 'light';
  const label = colorMode === 'light' ? 'Dark mode' : 'Light mode';
  const iconName = colorMode === 'light' ? 'moon' : 'sun';

  const handleClick = React.useCallback(() => {
    setColorMode(nextMode);
    persistColorMode(nextMode);
  }, [ nextMode, setColorMode ]);

  if (variant === 'full') {
    return (
      <Button
        type="button"
        variant="plain"
        size="sm"
        w="100%"
        justifyContent="flex-start"
        gap={ 3 }
        px={ 3 }
        py={ 2.5 }
        h="auto"
        borderRadius="8px"
        color={{ _light: '#0e4b5b', _dark: '#bdebf7' }}
        bg={{ _light: 'rgba(36, 188, 227, 0.07)', _dark: 'rgba(36, 188, 227, 0.08)' }}
        _hover={{
          bg: { _light: 'rgba(36, 188, 227, 0.12)', _dark: 'rgba(36, 188, 227, 0.14)' },
        }}
        onClick={ handleClick }
      >
        <IconSvg name={ iconName } boxSize={ 4 }/>
        <Text
          fontSize="11px"
          fontWeight={ 500 }
          letterSpacing="0.08em"
          textTransform="uppercase"
        >
          { label }
        </Text>
      </Button>
    );
  }

  return (
    <Tooltip content={ label }>
      <IconButton
        aria-label={ label }
        onClick={ handleClick }
        variant="header"
        size="md"
        boxSize={ 10 }
        borderRadius="8px"
        color={{ _light: '#0e4b5b', _dark: '#bdebf7' }}
        borderColor={{ _light: 'rgba(36, 188, 227, 0.22)', _dark: 'rgba(189, 235, 247, 0.18)' }}
        bg={{ _light: 'rgba(255, 255, 255, 0.72)', _dark: 'rgba(15, 22, 38, 0.62)' }}
        _hover={{
          bg: { _light: 'rgba(36, 188, 227, 0.10)', _dark: 'rgba(36, 188, 227, 0.12)' },
          borderColor: { _light: 'rgba(36, 188, 227, 0.36)', _dark: 'rgba(80, 201, 233, 0.34)' },
        }}
      >
        <IconSvg name={ iconName } boxSize={ 4 }/>
      </IconButton>
    </Tooltip>
  );
};

export default React.memo(ColorModeToggle);
