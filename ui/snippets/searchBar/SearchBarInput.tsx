import type { HTMLChakraProps } from '@chakra-ui/react';
import { chakra, Center } from '@chakra-ui/react';
import { throttle } from 'es-toolkit';
import React from 'react';
import type { ChangeEvent, FormEvent, FocusEvent } from 'react';

import { useScrollDirection } from 'lib/contexts/scrollDirection';
import useIsMobile from 'lib/hooks/useIsMobile';
import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import ClearButton from 'ui/shared/ClearButton';
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
      return { _light: 'rgba(64, 209, 219, 0.5)', _dark: 'rgba(64, 209, 219, 0.6)' };
    }
    return { _light: 'rgba(0, 0, 0, 0.1)', _dark: 'rgba(255, 255, 255, 0.15)' };
  };

  const getInputBoxShadow = () => {
    if (!isHomepage) {
      return undefined;
    }
    if (isFocused) {
      return {
        _light: '0 4px 20px rgba(64, 209, 219, 0.12), 0 0 0 3px rgba(64, 209, 219, 0.08)',
        _dark: '0 4px 20px rgba(64, 209, 219, 0.2), 0 0 0 3px rgba(64, 209, 219, 0.12)',
      };
    }
    return {
      _light: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.08)',
      _dark: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
    };
  };

  const inputBorderColor = getInputBorderColor();
  const inputBoxShadow = getInputBoxShadow();

  const startElement = undefined;

  const endElement = (
    <>
      <ClearButton onClick={ onClear } isVisible={ value.length > 0 } mx={ isHomepage ? { base: 3, md: 4 } : 2 }/>
      { !isMobile && (
        <Center
          boxSize={ isHomepage ? '28px' : '20px' }
          mr={ isHomepage ? { base: 4, md: 5 } : 2 }
          borderWidth="1px"
          borderColor={ isHomepage ? { _light: 'rgba(0, 0, 0, 0.1)', _dark: 'rgba(255, 255, 255, 0.15)' } : 'gray.500' }
          color={ isHomepage ? { _light: 'rgba(0, 0, 0, 0.5)', _dark: 'rgba(255, 255, 255, 0.5)' } : 'gray.500' }
          borderRadius="6px"
          fontSize={ isHomepage ? '11px' : 'xs' }
          fontWeight={ isHomepage ? 500 : 400 }
          bg={ isHomepage ? { _light: 'rgba(0, 0, 0, 0.02)', _dark: 'rgba(255, 255, 255, 0.05)' } : 'transparent' }
        >
          /
        </Center>
      ) }
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
          borderColor={ inputBorderColor }
          color={{ _light: 'black', _dark: 'white' }}
          bg={ isHomepage ?
            { _light: 'rgba(255, 255, 255, 0.95)', _dark: 'rgba(255, 255, 255, 0.08)' } :
            undefined
          }
          backdropFilter={ isHomepage ? 'blur(16px) saturate(180%)' : 'none' }
          fontSize={{ base: 'xs', md: 'sm', lg: isHomepage ? 'sm' : 'sm' }}
          py={ isHomepage ? { base: 4, md: 4.5 } : undefined }
          px={ isHomepage ? { base: 4, md: 5 } : undefined }
          borderRadius={ isHomepage ? '12px' : undefined }
          boxShadow={ inputBoxShadow }
          _hover={ isHomepage && !isFocused ? {
            borderColor: { _light: 'rgba(0, 0, 0, 0.14)', _dark: 'rgba(255, 255, 255, 0.2)' },
            boxShadow: {
              _light: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)',
              _dark: '0 2px 8px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(0, 0, 0, 0.45)',
            },
          } : {} }
          _focus={{
            outline: 'none',
          }}
          _focusVisible={{
            outline: 'none',
          }}
          _autofill={{
            borderColor: isHomepage ? { _light: 'rgba(0, 0, 0, 0.1)', _dark: 'rgba(255, 255, 255, 0.15)' } : undefined,
            boxShadow: isHomepage ? {
              _light: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.08)',
              _dark: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
            } : undefined,
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
