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
  value: string;
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
      return { _light: 'rgba(64, 209, 219, 0.8)', _dark: 'rgba(64, 209, 219, 0.9)' };
    }
    return { _light: 'rgba(0, 0, 0, 0.1)', _dark: 'rgba(255, 255, 255, 0.15)' };
  };

  const getInputBoxShadow = () => {
    if (!isHomepage) {
      return undefined;
    }
    return 'none';
  };

  const inputBorderColor = getInputBorderColor();
  const inputBoxShadow = getInputBoxShadow();

  const startElement = undefined;

  const endElement = (
    <>
      <ClearButton onClick={ onClear } isVisible={ value.length > 0 } mx={ isHomepage ? { base: 3, md: 4 } : 2 }/>
      <IconButton
        aria-label="Search"
        onClick={ handleSearchButtonClick }
        type="submit"
        variant="plain"
        color={{ _light: 'rgba(64, 209, 219, 1)', _dark: 'rgba(64, 209, 219, 1)' }}
        _hover={{
          color: { _light: 'rgba(64, 209, 219, 0.8)', _dark: 'rgba(64, 209, 219, 0.8)' },
        }}
        mr={ isHomepage ? { base: 3, md: 4 } : 2 }
        boxSize={ isHomepage ? { base: 6, md: 7 } : 6 }
      >
        <IconSvg name="search" boxSize={ isHomepage ? { base: 5, md: 6 } : 5 }/>
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
          placeholder={ isMobile ? 'Search by address / ... ' : 'Search by address / txn hash / block / token... ' }
          value={ value }
          onChange={ handleChange }
          onFocus={ handleInputFocus }
          onBlur={ handleInputBlur }
          border={ isHomepage ? '1px solid' : '2px solid' }
          borderColor={ isHomepage ?
            { _light: 'rgba(0, 0, 0, 0.08)', _dark: 'rgba(255, 255, 255, 0.1)' } :
            inputBorderColor
          }
          color={{ _light: 'black', _dark: 'white' }}
          bg={ isHomepage ?
            { _light: '#ffffff', _dark: '#0a0a0a' } :
            undefined
          }
          backdropFilter="none"
          _focus={{
            outline: 'none',
            bg: isHomepage ? {
              _light: '#ffffff',
              _dark: '#0a0a0a',
            } : undefined,
            backdropFilter: 'none',
            borderColor: isHomepage ? {
              _light: 'rgba(0, 0, 0, 0.12)',
              _dark: 'rgba(255, 255, 255, 0.15)',
            } : undefined,
          }}
          fontSize={{ base: 'xs', md: 'sm', lg: isHomepage ? 'sm' : 'sm' }}
          h={ isHomepage ? { base: '50px', md: '56px' } : '50px' }
          py={ isHomepage ? { base: 4, md: 4.5 } : { base: 3, md: 3.5 } }
          px={ isHomepage ? { base: 4, md: 5 } : undefined }
          borderRadius={ isHomepage ? '12px' : undefined }
          boxShadow={ inputBoxShadow }
          _hover={ isHomepage && !isFocused ? {
            borderColor: { _light: 'rgba(0, 0, 0, 0.1)', _dark: 'rgba(255, 255, 255, 0.12)' },
            boxShadow: {
              _light: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)',
              _dark: '0 2px 8px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(0, 0, 0, 0.45)',
            },
          } : {} }
          _focusVisible={{
            outline: 'none',
          }}
          _autofill={{
            borderColor: isHomepage ? { _light: 'rgba(0, 0, 0, 0.1)', _dark: 'rgba(255, 255, 255, 0.15)' } : undefined,
            boxShadow: isHomepage ? 'none' : undefined,
          }}
          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          _placeholder={{
            color: isHomepage ? { _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' } : undefined,
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
