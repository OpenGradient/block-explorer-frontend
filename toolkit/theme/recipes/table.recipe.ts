import { defineSlotRecipe } from '@chakra-ui/react';

export const recipe = defineSlotRecipe({
  slots: [ 'root', 'row', 'cell', 'columnHeader', 'caption', 'footer', 'body', 'header' ],
  base: {
    root: {
      tableLayout: 'fixed',
      fontVariant: 'normal',
      fontVariantLigatures: 'no-contextual',
      borderCollapse: 'collapse',
      width: 'full',
      textAlign: 'start',
      verticalAlign: 'top',
      overflow: 'unset',
      bg: 'transparent',
    },
    cell: {
      textAlign: 'start',
      alignItems: 'center',
      verticalAlign: 'top',
      fontWeight: 'medium',
      color: 'text.primary',
    },
    columnHeader: {
      fontFamily: 'mono',
      fontSize: 'xs',
      fontWeight: '700',
      letterSpacing: '0',
      textAlign: 'start',
      textTransform: 'uppercase',
    },
  },

  variants: {
    variant: {
      line: {
        columnHeader: {
          color: 'table.header.fg',
          backgroundColor: 'table.header.bg',
          _first: {
            borderTopLeftRadius: '8px',
          },
          _last: {
            borderTopRightRadius: '8px',
          },
        },
        cell: {
          borderBottomWidth: '1px',
          borderColor: 'border.divider',
        },
        row: {
          bg: 'transparent',
          transitionProperty: 'background-color,color',
          transitionDuration: 'fast',
          _hover: {
            bg: { _light: 'rgba(36, 188, 227, 0.045)', _dark: 'rgba(36, 188, 227, 0.055)' },
          },
        },
      },
    },

    size: {
      md: {
        root: {
          fontSize: 'sm',
        },
        columnHeader: {
          px: '6px',
          py: '10px',
          _first: {
            pl: 3,
          },
          _last: {
            pr: 3,
          },
        },
        cell: {
          px: '6px',
          py: 4,
          _first: {
            pl: 3,
          },
          _last: {
            pr: 3,
          },
        },
      },
    },
  },

  defaultVariants: {
    variant: 'line',
    size: 'md',
  },
});
