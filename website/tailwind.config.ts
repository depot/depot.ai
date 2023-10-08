import * as radixColors from '@radix-ui/colors'
import type {Config} from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx,astro}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Red Hat Text Variable"', ...defaultTheme.fontFamily.sans],
        mono: ['"Red Hat Mono Variable"', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        radix: {
          ...radixColors.amberDark,
          ...radixColors.blueDark,
          ...radixColors.crimsonDark,
          ...radixColors.grassDark,
          ...radixColors.grayDark,
          ...radixColors.indigoDark,
          ...radixColors.mauveDark,
          ...radixColors.pinkDark,
          ...radixColors.purpleDark,
          ...radixColors.redDark,
          ...radixColors.grayDark,
          ...radixColors.violetDark,
          ...radixColors.yellowDark,
          ...radixColors.orangeDark,

          'mauve-black': '#0e0e11',
        },

        'radix-light': {
          ...radixColors.mauve,
        },
      },

      typography: ({theme}: any) => ({
        DEFAULT: {
          css: {
            a: {
              fontWeight: null,
              textDecoration: 'none',
            },
            code: {
              backgroundColor: theme('colors.radix.mauve4'),
              borderRadius: '0.25rem',
              color: theme('colors.radix.mauve12'),
              fontWeight: null,
              padding: '0.2rem 0.25rem',
            },
            'code::before': {content: null},
            'code::after': {content: null},
          },
        },
        mauve: {
          css: {
            '--tw-prose-body': theme('colors.radix.mauve11'),
            '--tw-prose-headings': theme('colors.radix.mauve12'),
            '--tw-prose-lead': theme('colors.radix.mauve12'),
            '--tw-prose-links': theme('colors.radix.indigo11'),
            '--tw-prose-bold': theme('colors.radix.mauve12'),
            '--tw-prose-counters': theme('colors.radix.mauve11'),
            '--tw-prose-bullets': theme('colors.radix.mauve8'),
            '--tw-prose-hr': theme('colors.radix.mauve6'),
            '--tw-prose-quotes': theme('colors.radix.mauve12'),
            '--tw-prose-quote-borders': theme('colors.radix.mauve6'),
            '--tw-prose-captions': theme('colors.radix.mauve11'),
            '--tw-prose-code': theme('colors.radix.mauve12'),
            '--tw-prose-pre-code': theme('colors.radix.mauve12'),
            '--tw-prose-pre-bg': theme('colors.radix.mauve12'),
            '--tw-prose-th-borders': theme('colors.radix.mauve6'),
            '--tw-prose-td-borders': theme('colors.radix.mauve6'),
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
} satisfies Config
