import type { HTMLChakraProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import { throttle } from 'es-toolkit';
import React from 'react';
import type { ChangeEvent, FormEvent, FocusEvent, MouseEvent } from 'react';

import { useScrollDirection } from 'lib/contexts/scrollDirection';
import useIsMobile from 'lib/hooks/useIsMobile';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import ClearButton from 'ui/shared/ClearButton';
import IconSvg from 'ui/shared/IconSvg';
interface Props extends Omit<HTMLChakraProps<'form'>, 'onChange'> {
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBlur?: (event: FocusEvent<HTMLFormElement>) => void;
  onFocus?: () => void;
  onHide?: () => void;
  onClear: () => void;
  isHomepage?: boolean;
  isSuggestOpen?: boolean;
  value?: string;
}

const SearchBarInput = (
  { onChange, onSubmit, isHomepage, isSuggestOpen, onFocus, onBlur, onHide, onClear, value, ...rest }: Props,
  ref: React.ForwardedRef<HTMLFormElement>,
) => {
  const innerRef = React.useRef<HTMLFormElement>(null);
  React.useImperativeHandle(ref, () => innerRef.current as HTMLFormElement, []);
  const [ isSticky, setIsSticky ] = React.useState(false);
  const [ isFocused, setIsFocused ] = React.useState(false);
  const scrollDirection = useScrollDirection();
  const isMobile = useIsMobile();

  const handleScroll = React.useCallback(() => {
    const TOP_BAR_HEIGHT = 36;
    if (!isHomepage) {
      if (window.scrollY >= TOP_BAR_HEIGHT) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    }
    const clientRect = isMobile && innerRef?.current?.getBoundingClientRect();
    if (clientRect && clientRect.y < TOP_BAR_HEIGHT) {
      onHide?.();
    }
  }, [ isMobile, onHide, isHomepage ]);

  const handleChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  }, [ onChange ]);

  const handleInputFocus = React.useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [ onFocus ]);

  const handleInputBlur = React.useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleSearchButtonClick = React.useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (innerRef.current) {
      const syntheticEvent = {
        preventDefault: () => {},
        stopPropagation: () => {},
        isDefaultPrevented: () => false,
        isPropagationStopped: () => false,
        persist: () => {},
        nativeEvent: event.nativeEvent,
        currentTarget: innerRef.current,
        target: innerRef.current,
        bubbles: true,
        cancelable: true,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: false,
        timeStamp: Date.now(),
        type: 'submit',
      } as FormEvent<HTMLFormElement>;
      onSubmit(syntheticEvent);
    }
  }, [ onSubmit ]);

  React.useEffect(() => {
    if (!isMobile) {
      return;
    }
    const throttledHandleScroll = throttle(handleScroll, 300);

    window.addEventListener('scroll', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [ isMobile, handleScroll ]);

  const handleKeyPress = React.useCallback((event: KeyboardEvent) => {
    if (isMobile) {
      return;
    }

    switch (event.key) {
      case '/': {
        if ([ 'INPUT', 'TEXTAREA' ].includes((event.target as HTMLElement).tagName)) {
          break;
        }

        if (!isSuggestOpen) {
          event.preventDefault();
          innerRef.current?.querySelector('input')?.focus();
          onFocus?.();
        }
        break;
      }
      case 'Escape': {
        if (isSuggestOpen) {
          innerRef.current?.querySelector('input')?.blur();
          onHide?.();
        }
        break;
      }
    }
  }, [ isMobile, isSuggestOpen, onFocus, onHide ]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [ handleKeyPress ]);

  const transformMobile = scrollDirection !== 'down' ? 'translateY(0)' : 'translateY(-100%)';

  const getInputBorderColor = () => {
    if (!isHomepage) {
      return { _light: 'blackAlpha.100', _dark: 'whiteAlpha.200' };
    }
    if (isFocused) {
      return { _light: 'rgba(36, 188, 227, 0.75)', _dark: 'rgba(80, 201, 233, 0.82)' };
    }
    return { _light: 'rgba(36, 188, 227, 0.20)', _dark: 'rgba(189, 235, 247, 0.16)' };
  };

  const getInputBoxShadow = () => {
    if (!isHomepage) {
      return undefined;
    }
    return isFocused ?
      { _light: '0 0 0 3px rgba(36, 188, 227, 0.12)', _dark: '0 0 0 3px rgba(80, 201, 233, 0.14)' } :
      { _light: '0 10px 26px rgba(14, 75, 91, 0.06)', _dark: '0 12px 30px rgba(0, 0, 0, 0.20)' };
  };

  const inputBorderColor = getInputBorderColor();
  const inputBoxShadow = getInputBoxShadow();
  const safeValue = value ?? '';

  const startElement = undefined;

  const endElement = (
    <>
      <ClearButton onClick={ onClear } isVisible={ safeValue.length > 0 } mx={ isHomepage ? { base: 3, md: 4 } : 2 }/>
      <IconButton
        aria-label="Search"
        onClick={ handleSearchButtonClick }
        type="submit"
        variant="plain"
        borderRadius="8px"
        color={{ _light: '#0e4b5b', _dark: '#bdebf7' }}
        bg={ isHomepage ? { _light: 'rgba(36, 188, 227, 0.10)', _dark: 'rgba(36, 188, 227, 0.14)' } : undefined }
        _hover={{
          color: { _light: '#167188', _dark: '#ffffff' },
          bg: isHomepage ? { _light: 'rgba(36, 188, 227, 0.18)', _dark: 'rgba(36, 188, 227, 0.22)' } : undefined,
        }}
        mr={ isHomepage ? { base: 3, md: 4 } : 2 }
        boxSize={ isHomepage ? { base: 8, md: 9 } : 6 }
      >
        <IconSvg name="search" boxSize={ isHomepage ? { base: 4, md: '18px' } : 5 }/>
      </IconButton>
    </>
  );

  return (
    <chakra.form
      ref={ innerRef }
      noValidate
      onSubmit={ onSubmit }
      onBlur={ onBlur }
      w="100%"
      backgroundColor={ isHomepage ? 'transparent' : { _light: 'white', _dark: 'black' } }
      position={{ base: isHomepage ? 'static' : 'absolute', lg: 'relative' }}
      top={{ base: isHomepage ? 0 : 55, lg: 0 }}
      left="0"
      zIndex={{ base: isHomepage ? 'auto' : '0', lg: isSuggestOpen ? 'popover' : 'auto' }}
      paddingX={{ base: isHomepage ? 0 : 3, lg: 0 }}
      paddingTop={{ base: isHomepage ? 0 : 1, lg: 0 }}
      paddingBottom={{ base: isHomepage ? 0 : 2, lg: 0 }}
      boxShadow={ scrollDirection !== 'down' && isSticky ? 'md' : 'none' }
      transform={{ base: isHomepage ? 'none' : transformMobile, lg: 'none' }}
      transitionProperty="transform,box-shadow,background-color,color,border-color"
      transitionDuration="normal"
      transitionTimingFunction="ease"
      { ...rest }
    >
      <InputGroup
        startElement={ startElement }
        endElement={ endElement }
      >
        <Input
          size={ isHomepage ? 'md' : 'md' }
          placeholder={ isMobile ? 'Search by address / ...' : 'Search by address / txn hash / block / token...' }
          value={ safeValue }
          onChange={ handleChange }
          onFocus={ handleInputFocus }
          onBlur={ handleInputBlur }
          border={ isHomepage ? '1px solid' : '2px solid' }
          borderColor={ inputBorderColor }
          color={{ _light: '#0e4b5b', _dark: 'rgba(255, 255, 255, 0.94)' }}
          bg={ isHomepage ?
            { _light: 'rgba(255, 255, 255, 0.88)', _dark: 'rgba(10, 15, 25, 0.82)' } :
            undefined
          }
          backdropFilter={ isHomepage ? 'blur(18px)' : 'none' }
          _focus={{
            outline: 'none',
            bg: isHomepage ? {
              _light: 'rgba(255, 255, 255, 0.94)',
              _dark: 'rgba(10, 15, 25, 0.90)',
            } : undefined,
            backdropFilter: isHomepage ? 'blur(18px)' : 'none',
            borderColor: isHomepage ? inputBorderColor : undefined,
          }}
          fontFamily={ isHomepage ? '"Geist", system-ui, -apple-system, sans-serif' : undefined }
          fontSize={{ base: 'xs', md: 'sm', lg: isHomepage ? 'sm' : 'sm' }}
          h={ isHomepage ? { base: '46px', md: '50px' } : '50px' }
          py={ isHomepage ? { base: 3, md: 3.5 } : { base: 3, md: 3.5 } }
          px={ isHomepage ? { base: 4, md: 5 } : undefined }
          borderRadius={ isHomepage ? '8px' : undefined }
          boxShadow={ inputBoxShadow }
          _hover={ isHomepage && !isFocused ? {
            borderColor: { _light: 'rgba(36, 188, 227, 0.36)', _dark: 'rgba(80, 201, 233, 0.32)' },
            boxShadow: {
              _light: '0 12px 30px rgba(14, 75, 91, 0.08)',
              _dark: '0 14px 34px rgba(0, 0, 0, 0.24)',
            },
          } : {} }
          _focusVisible={{
            outline: 'none',
          }}
          _autofill={{
            borderColor: isHomepage ? { _light: 'rgba(36, 188, 227, 0.28)', _dark: 'rgba(80, 201, 233, 0.26)' } : undefined,
            boxShadow: isHomepage ? 'none' : undefined,
          }}
          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          _placeholder={{
            color: isHomepage ? { _light: 'rgba(14, 75, 91, 0.48)', _dark: 'rgba(189, 235, 247, 0.46)' } : undefined,
            opacity: isHomepage ? 1 : undefined,
            fontSize: isHomepage ? { base: 'sm', md: 'sm' } : undefined,
            fontWeight: isHomepage ? 400 : undefined,
          }}
        />
      </InputGroup>
    </chakra.form>
  );
};

export default React.memo(React.forwardRef(SearchBarInput));
