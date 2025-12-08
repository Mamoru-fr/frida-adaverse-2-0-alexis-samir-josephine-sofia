/**
 * Color Palette for AdaVerse
 * Centralized color definitions for consistent theming across the application
 */

export const Colors = {
  // Background Colors
  background: {
    light: 'bg-white',
    dark: 'bg-neutral-950',
    card: {
      light: 'bg-neutral-100',
      dark: 'bg-neutral-900',
    },
    cardAlt: {
      light: 'bg-neutral-200',
      dark: 'bg-neutral-800',
    },
    hover: {
      light: 'hover:bg-neutral-100',
      dark: 'hover:bg-neutral-800',
    },
  },

  // Text Colors
  text: {
    primary: {
      light: 'text-neutral-900',
      dark: 'text-white',
    },
    secondary: {
      light: 'text-neutral-600',
      dark: 'text-neutral-400',
    },
    tertiary: {
      light: 'text-neutral-500',
      dark: 'text-neutral-400',
    },
    inverse: {
      light: 'text-white',
      dark: 'text-black',
    },
  },

  // Border Colors
  border: {
    default: {
      light: 'border-neutral-200',
      dark: 'border-neutral-800',
    },
    card: {
      light: 'border-neutral-300',
      dark: 'border-white/10',
    },
    subtle: {
      light: 'border-neutral-200',
      dark: 'border-neutral-700',
    },
  },

  // Button Colors
  button: {
    primary: {
      bg: {
        light: 'bg-neutral-900',
        dark: 'bg-white',
      },
      text: {
        light: 'text-white',
        dark: 'text-black',
      },
      hover: {
        light: 'hover:bg-neutral-800',
        dark: 'hover:bg-neutral-200',
      },
    },
    secondary: {
      bg: {
        light: 'bg-neutral-200',
        dark: 'bg-neutral-800',
      },
      text: {
        light: 'text-black',
        dark: 'text-white',
      },
      hover: {
        light: 'hover:bg-neutral-300',
        dark: 'hover:bg-neutral-700',
      },
    },
  },

  // Navigation Colors
  nav: {
    bg: {
      light: 'bg-white/95',
      dark: 'bg-neutral-900/95',
    },
    border: {
      light: 'border-neutral-200',
      dark: 'border-neutral-800',
    },
  },

  // Badge/Tag Colors
  badge: {
    bg: {
      light: 'bg-neutral-100',
      dark: 'bg-neutral-800',
    },
    text: {
      light: 'text-neutral-700',
      dark: 'text-neutral-300',
    },
    border: {
      light: 'border-neutral-300',
      dark: 'border-white/10',
    },
  },

  // Error Colors
  error: {
    bg: {
      light: 'bg-red-100',
      dark: 'bg-red-900/20',
    },
    text: {
      light: 'text-red-700',
      dark: 'text-red-400',
    },
    border: {
      light: 'border-red-300',
      dark: 'border-red-800',
    },
  },

  // Icon Colors
  icon: {
    default: {
      light: 'text-neutral-400',
      dark: 'text-neutral-700',
    },
    active: {
      light: 'text-neutral-800',
      dark: 'text-neutral-200',
    },
  },
} as const;

/**
 * Helper function to combine light and dark mode classes
 * @param lightClass - Tailwind class for light mode
 * @param darkClass - Tailwind class for dark mode
 * @returns Combined class string with dark: variant
 */
export function colorClass(lightClass: string, darkClass: string): string {
  return `${lightClass} dark:${darkClass}`;
}

/**
 * Pre-combined color classes for common use cases
 * These are written as literal strings so Tailwind can detect them during build
 */
export const CombinedColors = {
  background: {
    main: 'bg-white dark:bg-neutral-950',
    card: 'bg-neutral-100 dark:bg-neutral-900',
    cardAlt: 'bg-neutral-200 dark:bg-neutral-800',
  },
  text: {
    primary: 'text-neutral-900 dark:text-white',
    secondary: 'text-neutral-600 dark:text-neutral-400',
    inverse: 'text-white dark:text-black',
  },
  border: {
    default: 'border-neutral-200 dark:border-neutral-800',
    card: 'border-neutral-300 dark:border-white/10',
  },
  button: {
    primary: {
      bg: 'bg-neutral-900 dark:bg-white',
      text: 'text-white dark:text-black',
      hover: 'hover:bg-neutral-800 dark:hover:bg-neutral-200',
    },
    secondary: {
      bg: 'bg-neutral-200 dark:bg-neutral-800',
      text: 'text-black dark:text-white',
      hover: 'hover:bg-neutral-300 dark:hover:bg-neutral-700',
    },
    exit: {
      bg: 'bg-red-600 dark:bg-red-700',
      text: 'text-white dark:text-white',
      hover: 'hover:bg-red-700 dark:hover:bg-red-800',
    }
  },
  nav: {
    bg: 'bg-white/95 dark:bg-neutral-900/95',
    border: 'border-neutral-200 dark:border-neutral-800',
  },
  badge: {
    bg: 'bg-neutral-100 dark:bg-neutral-800',
    text: 'text-neutral-700 dark:text-neutral-300',
    border: 'border-neutral-300 dark:border-white/10',
  },
  error: {
    bg: 'bg-red-100 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
  },
  icon: {
    default: 'text-neutral-400 dark:text-neutral-700',
    active: 'text-neutral-800 dark:text-neutral-200',
  },
} as const;
