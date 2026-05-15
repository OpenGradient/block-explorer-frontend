import type { ThemingConfig } from '@chakra-ui/react';

import config from 'configs/app';

const heroBannerButton = config.UI.homepage.heroBanner?.button;

const semanticTokens: ThemingConfig['semanticTokens'] = {
  colors: {
    button: {
      outline: {
        fg: {
          DEFAULT: { value: { _light: '{colors.blue.600}', _dark: '{colors.blue.600}' } },
        },
      },
      subtle: {
        fg: {
          DEFAULT: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
        },
        bg: {
          DEFAULT: { value: { _light: '{colors.blackAlpha.200}', _dark: '{colors.whiteAlpha.200}' } },
        },
      },
      dropdown: {
        fg: {
          DEFAULT: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
          selected: { value: { _light: '{colors.blue.700}', _dark: '{colors.whiteAlpha.800}' } },
        },
        bg: {
          selected: { value: { _light: '{colors.blue.50}', _dark: '{colors.whiteAlpha.100}' } },
        },
        border: {
          DEFAULT: { value: { _light: '{colors.gray.200}', _dark: '{colors.gray.600}' } },
        },
      },
      header: {
        fg: {
          DEFAULT: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.gray.400}' } },
          selected: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
          highlighted: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
        },
        bg: {
          selected: { value: { _light: '{colors.blackAlpha.50}', _dark: '{colors.whiteAlpha.100}' } },
          highlighted: { value: { _light: '{colors.orange.100}', _dark: '{colors.orange.900}' } },
        },
        border: {
          DEFAULT: { value: { _light: '{colors.gray.300}', _dark: '{colors.gray.600}' } },
        },
      },
      segmented: {
        fg: {
          DEFAULT: { value: { _light: '{colors.blue.600}', _dark: '{colors.blue.300}' } },
          selected: { value: { _light: '{colors.blue.700}', _dark: '{colors.gray.50}' } },
        },
        border: {
          DEFAULT: { value: { _light: '{colors.blue.50}', _dark: '{colors.gray.800}' } },
        },
      },
      icon_secondary: {
        fg: {
          DEFAULT: { value: { _light: '{colors.gray.400}', _dark: '{colors.gray.500}' } },
          selected: { value: { _light: '{colors.blue.700}', _dark: '{colors.whiteAlpha.800}' } },
        },
        bg: {
          selected: { value: { _light: '{colors.blue.50}', _dark: '{colors.whiteAlpha.100}' } },
        },
      },
      hero: {
        bg: {
          DEFAULT: {
            value: {
              _light: heroBannerButton?._default?.background?.[0] || '{colors.blue.600}',
              _dark: heroBannerButton?._default?.background?.[1] || heroBannerButton?._default?.background?.[0] || '{colors.blue.600}',
            },
          },
          hover: {
            value: {
              _light: heroBannerButton?._hover?.background?.[0] || '{colors.blue.400}',
              _dark: heroBannerButton?._hover?.background?.[1] || heroBannerButton?._hover?.background?.[0] || '{colors.blue.400}',
            },
          },
          selected: {
            value: {
              _light: heroBannerButton?._selected?.background?.[0] || '{colors.blue.50}',
              _dark: heroBannerButton?._selected?.background?.[1] || heroBannerButton?._selected?.background?.[0] || '{colors.blue.50}',
            },
          },
        },
        fg: {
          DEFAULT: {
            value: {
              _light: heroBannerButton?._default?.text_color?.[0] || '{colors.white}',
              _dark: heroBannerButton?._default?.text_color?.[1] || heroBannerButton?._default?.text_color?.[0] || '{colors.white}',
            },
          },
          hover: {
            value: {
              _light: heroBannerButton?._hover?.text_color?.[0] || '{colors.white}',
              _dark: heroBannerButton?._hover?.text_color?.[1] || heroBannerButton?._hover?.text_color?.[0] || '{colors.white}',
            },
          },
          selected: {
            value: {
              _light: heroBannerButton?._selected?.text_color?.[0] || '{colors.blackAlpha.800}',
              _dark: heroBannerButton?._selected?.text_color?.[1] || heroBannerButton?._selected?.text_color?.[0] || '{colors.blackAlpha.800}',
            },
          },
        },
      },
    },
    closeButton: {
      fg: {
        DEFAULT: { value: { _light: '{colors.blackAlpha.500}', _dark: '{colors.whiteAlpha.500}' } },
      },
    },
    link: {
      primary: {
        DEFAULT: { value: { _light: '{colors.cyan.600}', _dark: '{colors.cyan.300}' } },
        hover: { value: { _light: '{colors.cyan.500}', _dark: '{colors.cyan.400}' } },
      },
      secondary: {
        DEFAULT: { value: { _light: '{colors.gray.500}', _dark: '{colors.gray.400}' } },
      },
      underlaid: {
        bg: { value: { _light: '{colors.gray.100}', _dark: '{colors.gray.800}' } },
      },
      subtle: {
        DEFAULT: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.gray.400}' } },
        hover: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.gray.400}' } },
      },
      navigation: {
        fg: {
          DEFAULT: { value: { _light: '{colors.gray.600}', _dark: '{colors.gray.400}' } },
          selected: { value: { _light: '{colors.blue.700}', _dark: '{colors.gray.50}' } },
          hover: { value: { _light: '{colors.link.primary.hover}' } },
          active: { value: { _light: '{colors.link.primary.hover}' } },
        },
        bg: {
          DEFAULT: { value: { _light: '{colors.white}', _dark: '{colors.black}' } },
          selected: { value: { _light: '{colors.blue.50}', _dark: '{colors.gray.800}' } },
        },
        border: {
          DEFAULT: { value: '{colors.border.divider}' },
          selected: { value: { _light: '{colors.blue.50}', _dark: '{colors.gray.800}' } },
        },
      },
      menu: {
        DEFAULT: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
      },
    },
    tooltip: {
      DEFAULT: {
        bg: { value: '{colors.gray.900}' },
        fg: { value: '{colors.white}' },
      },
      navigation: {
        bg: { value: { _light: '{colors.blue.50}', _dark: '{colors.gray.800}' } },
        fg: {
          DEFAULT: { value: '{colors.blue.400}' },
          selected: { value: { _light: '{colors.blue.700}', _dark: '{colors.gray.50}' } },
        },
      },
    },
    popover: {
      DEFAULT: {
        bg: { value: { _light: '#fcfdfe', _dark: '#0f1626' } },
        shadow: { value: { _light: 'rgba(36, 188, 227, 0.25)', _dark: 'rgba(36, 188, 227, 0.35)' } },
      },
    },
    progressCircle: {
      trackColor: {
        DEFAULT: { value: { _light: '{colors.gray.100}', _dark: '{colors.whiteAlpha.100}' } },
      },
    },
    skeleton: {
      bg: {
        start: { value: { _light: '{colors.blackAlpha.50}', _dark: '{colors.whiteAlpha.50}' } },
        end: { value: { _light: '{colors.blackAlpha.100}', _dark: '{colors.whiteAlpha.100}' } },
      },
    },
    tabs: {
      solid: {
        fg: {
          DEFAULT: { value: { _light: '#314a7d', _dark: 'rgba(189, 235, 247, 0.66)' } },
          selected: { value: { _light: '#0e4b5b', _dark: '#bdebf7' } },
        },
        bg: {
          selected: { value: { _light: 'rgba(36, 188, 227, 0.12)', _dark: 'rgba(36, 188, 227, 0.12)' } },
        },
      },
      secondary: {
        fg: {
          DEFAULT: { value: { _light: '#0e4b5b', _dark: '#bdebf7' } },
        },
        bg: {
          selected: { value: { _light: 'rgba(36, 188, 227, 0.12)', _dark: 'rgba(36, 188, 227, 0.12)' } },
        },
        border: {
          DEFAULT: { value: { _light: 'rgba(36, 188, 227, 0.22)', _dark: 'rgba(189, 235, 247, 0.16)' } },
        },
      },
      segmented: {
        fg: {
          DEFAULT: { value: { _light: '#1d96b6', _dark: '#50c9e9' } },
          selected: { value: { _light: '#0e4b5b', _dark: '#bdebf7' } },
        },
        border: {
          DEFAULT: { value: { _light: 'rgba(36, 188, 227, 0.18)', _dark: 'rgba(36, 188, 227, 0.18)' } },
        },
      },
    },
    'switch': {
      primary: {
        bg: {
          DEFAULT: { value: { _light: '{colors.gray.300}', _dark: '{colors.whiteAlpha.400}' } },
          checked: { value: { _light: '{colors.blue.500}', _dark: '{colors.blue.300}' } },
          hover: { value: { _light: '{colors.blue.600}', _dark: '{colors.blue.400}' } },
        },
      },
    },
    alert: {
      fg: {
        DEFAULT: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
      },
      bg: {
        info: { value: { _light: '{colors.blackAlpha.50}', _dark: '{colors.whiteAlpha.100}' } },
        warning: { value: { _light: '{colors.orange.100}', _dark: '{colors.orange.800/60}' } },
        warning_table: { value: { _light: '{colors.orange.50}', _dark: '{colors.orange.800/60}' } },
        success: { value: { _light: '{colors.green.100}', _dark: '{colors.green.900}' } },
        error: { value: { _light: '{colors.red.100}', _dark: '{colors.red.900}' } },
      },
    },
    toast: {
      fg: {
        DEFAULT: { value: '{colors.alert.fg}' },
      },
      bg: {
        DEFAULT: { value: '{colors.alert.bg.info}' },
        info: { value: { _light: '{colors.blue.100}', _dark: '{colors.blue.900}' } },
        warning: { value: '{colors.alert.bg.warning}' },
        success: { value: '{colors.alert.bg.success}' },
        error: { value: '{colors.alert.bg.error}' },
        loading: { value: { _light: '{colors.blue.100}', _dark: '{colors.blue.900}' } },
      },
    },
    input: {
      fg: {
        DEFAULT: { value: { _light: '#0e4b5b', _dark: '#bdebf7' } },
        error: { value: '{colors.text.error}' },
      },
      bg: {
        DEFAULT: { value: { _light: '#ffffff', _dark: 'rgba(15, 22, 38, 0.6)' } },
        readOnly: { value: { _light: '#e9f8fc', _dark: 'rgba(15, 22, 38, 0.4)' } },
      },
      border: {
        DEFAULT: { value: { _light: 'rgba(36, 188, 227, 0.18)', _dark: 'rgba(36, 188, 227, 0.18)' } },
        hover: { value: { _light: 'rgba(36, 188, 227, 0.45)', _dark: 'rgba(36, 188, 227, 0.45)' } },
        focus: { value: '#24bce3' },
        filled: { value: { _light: 'rgba(36, 188, 227, 0.25)', _dark: 'rgba(36, 188, 227, 0.22)' } },
        readOnly: { value: { _light: 'rgba(36, 188, 227, 0.10)', _dark: 'rgba(36, 188, 227, 0.12)' } },
        error: { value: '{colors.red.500}' },
      },
      placeholder: {
        DEFAULT: { value: { _light: 'rgba(14, 75, 91, 0.4)', _dark: 'rgba(189, 235, 247, 0.35)' } },
        error: { value: '{colors.red.500}' },
      },
    },
    field: {
      placeholder: {
        DEFAULT: { value: '{colors.gray.500}' },
        disabled: { value: '{colors.gray.500/20}' },
        error: { value: '{colors.red.500}' },
      },
    },
    dialog: {
      bg: {
        DEFAULT: { value: { _light: '#fcfdfe', _dark: '#0f1626' } },
      },
      fg: {
        DEFAULT: { value: { _light: '#0e4b5b', _dark: '#bdebf7' } },
      },
    },
    drawer: {
      bg: {
        DEFAULT: { value: { _light: '#fcfdfe', _dark: '#0f1626' } },
      },
    },
    select: {
      trigger: {
        outline: {
          fg: { value: { _light: '#0e4b5b', _dark: '#bdebf7' } },
        },
      },
      item: {
        bg: {
          highlighted: { value: { _light: 'rgba(36, 188, 227, 0.10)', _dark: 'rgba(36, 188, 227, 0.10)' } },
        },
      },
      indicator: {
        fg: {
          DEFAULT: { value: '{colors.gray.500}' },
        },
      },
      placeholder: {
        fg: {
          DEFAULT: { value: '{colors.gray.500}' },
          error: { value: '{colors.red.500}' },
        },
      },
    },
    menu: {
      item: {
        bg: {
          highlighted: { value: { _light: 'rgba(36, 188, 227, 0.10)', _dark: 'rgba(36, 188, 227, 0.12)' } },
        },
      },
    },
    spinner: {
      track: {
        DEFAULT: { value: { _light: '{colors.blackAlpha.200}', _dark: '{colors.whiteAlpha.200}' } },
      },
    },
    badge: {
      gray: {
        bg: { value: { _light: '{colors.blackAlpha.50}', _dark: '{colors.whiteAlpha.100}' } },
        fg: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
      },
      green: {
        bg: { value: { _light: '{colors.green.50}', _dark: '{colors.green.800}' } },
        fg: { value: { _light: '{colors.green.500}', _dark: '{colors.green.200}' } },
      },
      red: {
        bg: { value: { _light: '{colors.red.50}', _dark: '{colors.red.800}' } },
        fg: { value: { _light: '{colors.red.500}', _dark: '{colors.red.200}' } },
      },
      purple: {
        bg: { value: { _light: 'rgba(36, 188, 227, 0.10)', _dark: 'rgba(36, 188, 227, 0.15)' } },
        fg: { value: { _light: '#1d96b6', _dark: '#50c9e9' } },
      },
      purple_alt: {
        bg: { value: { _light: 'rgba(36, 188, 227, 0.14)', _dark: 'rgba(36, 188, 227, 0.18)' } },
        fg: { value: { _light: '#0e4b5b', _dark: '#bdebf7' } },
      },
      orange: {
        bg: { value: { _light: '{colors.orange.50}', _dark: '{colors.orange.800}' } },
        fg: { value: { _light: '{colors.orange.500}', _dark: '{colors.orange.100}' } },
      },
      blue: {
        bg: { value: { _light: '{colors.blue.50}', _dark: '{colors.blue.800}' } },
        fg: { value: { _light: '{colors.blue.500}', _dark: '{colors.blue.100}' } },
      },
      blue_alt: {
        bg: { value: { _light: '{colors.blue.50}', _dark: '{colors.blue.800}' } },
        fg: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
      },
      yellow: {
        bg: { value: { _light: '{colors.yellow.50}', _dark: '{colors.yellow.800}' } },
        fg: { value: { _light: '{colors.yellow.500}', _dark: '{colors.yellow.100}' } },
      },
      teal: {
        bg: { value: { _light: '{colors.teal.50}', _dark: '{colors.teal.800}' } },
        fg: { value: { _light: '{colors.teal.500}', _dark: '{colors.teal.100}' } },
      },
      cyan: {
        bg: { value: { _light: '{colors.cyan.50}', _dark: '{colors.cyan.800}' } },
        fg: { value: { _light: '{colors.cyan.500}', _dark: '{colors.cyan.100}' } },
      },
    },
    tag: {
      root: {
        subtle: {
          bg: { value: { _light: '{colors.blackAlpha.50}', _dark: '{colors.whiteAlpha.100}' } },
          fg: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
        },
        clickable: {
          bg: { value: { _light: '{colors.gray.100}', _dark: '{colors.gray.800}' } },
          fg: { value: { _light: '{colors.blackAlpha.800}', _dark: '{colors.whiteAlpha.800}' } },
        },
        filter: {
          bg: { value: { _light: '{colors.blue.50}', _dark: '{colors.blue.800}' } },
        },
        select: {
          bg: {
            DEFAULT: { value: { _light: '{colors.gray.100}', _dark: '{colors.gray.800}' } },
            selected: { value: { _light: '{colors.blue.500}', _dark: '{colors.blue.900}' } },
          },
          fg: { value: { _light: '{colors.gray.500}', _dark: '{colors.whiteAlpha.800}' } },
        },
      },
    },
    table: {
      header: {
        bg: { value: { _light: 'rgba(233, 248, 252, 0.78)', _dark: 'rgba(36, 188, 227, 0.08)' } },
        fg: { value: { _light: '#314a7d', _dark: 'rgba(189, 235, 247, 0.72)' } },
      },
    },
    checkbox: {
      control: {
        border: {
          DEFAULT: { value: { _light: '{colors.gray.100}', _dark: '{colors.gray.700}' } },
          hover: { value: { _light: '{colors.gray.200}', _dark: '{colors.gray.500}' } },
          readOnly: { value: { _light: '{colors.gray.200}', _dark: '{colors.gray.800}' } },
        },
      },
    },
    radio: {
      control: {
        border: {
          DEFAULT: { value: { _light: '{colors.gray.100}', _dark: '{colors.gray.700}' } },
          hover: { value: { _light: '{colors.gray.200}', _dark: '{colors.gray.500}' } },
          readOnly: { value: { _light: '{colors.gray.200}', _dark: '{colors.gray.800}' } },
        },
      },
    },
    stat: {
      indicator: {
        up: { value: { _light: '{colors.green.500}', _dark: '{colors.green.400}' } },
        down: { value: { _light: '{colors.red.600}', _dark: '{colors.red.400}' } },
      },
    },
    rating: {
      DEFAULT: { value: { _light: '{colors.gray.200}', _dark: '{colors.gray.700}' } },
      highlighted: { value: '{colors.yellow.400}' },
    },
    heading: {
      DEFAULT: { value: { _light: '#0e4b5b', _dark: '#bdebf7' } },
    },
    text: {
      primary: { value: { _light: '#0e4b5b', _dark: 'rgba(189, 235, 247, 0.92)' } },
      secondary: { value: { _light: '#314a7d', _dark: 'rgba(189, 235, 247, 0.55)' } },
      error: { value: '{colors.red.500}' },
    },
    border: {
      divider: { value: { _light: 'rgba(36, 188, 227, 0.14)', _dark: 'rgba(189, 235, 247, 0.10)' } },
      error: { value: '{colors.red.500}' },
    },
    icon: {
      backTo: { value: '{colors.gray.400}' },
      externalLink: { value: { _light: '{colors.gray.400}', _dark: '{colors.gray.500}' } },
      info: { value: { _light: '{colors.gray.400}', _dark: '{colors.gray.500}' } },
    },
    address: {
      highlighted: {
        bg: { value: { _light: '{colors.blue.50}', _dark: '{colors.blue.900}' } },
        border: { value: { _light: '{colors.blue.200}', _dark: '{colors.blue.600}' } },
      },
    },
    global: {
      body: {
        bg: { value: { _light: '#f4fcfe', _dark: '#0a0f19' } },
        fg: { value: '{colors.text.primary}' },
      },
      mark: {
        bg: { value: { _light: '{colors.green.100}', _dark: '{colors.green.800}' } },
      },
      scrollbar: {
        thumb: { value: { _light: '{colors.blackAlpha.300}', _dark: '{colors.whiteAlpha.300}' } },
      },
    },
  },
  shadows: {
    popover: {
      DEFAULT: { value: { _light: '{shadows.size.2xl}', _dark: '{shadows.dark-lg}' } },
    },
    drawer: {
      DEFAULT: { value: { _light: '{shadows.size.lg}', _dark: '{shadows.dark-lg}' } },
    },
  },
  opacity: {
    control: {
      disabled: { value: '0.2' },
    },
  },
};

export default semanticTokens;
