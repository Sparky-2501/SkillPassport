import { useEffect } from 'react';

export type Theme = 'theme1' | 'theme2' | 'theme3' | 'theme4';

export const themes = {
  theme1: {
    name: 'Ocean Blue',
    background: 'from-[#0a0f2c] via-[#1c1f40] to-[#2d1b69]',
    card: 'bg-[#11152e]',
    cardHover: 'hover:bg-[#1a1d3a]',
    button: 'from-blue-600 to-purple-600',
    buttonHover: 'hover:from-blue-700 hover:to-purple-700',
    accent: 'text-blue-400',
    border: 'border-gray-800'
  },
  theme2: {
    name: 'Rose Garden',
    background: 'from-[#2d1b2e] via-[#4a1e3d] to-[#6b2c5c]',
    card: 'bg-[#1a0d1a]',
    cardHover: 'hover:bg-[#2d1b2e]',
    button: 'from-pink-600 to-rose-600',
    buttonHover: 'hover:from-pink-700 hover:to-rose-700',
    accent: 'text-pink-400',
    border: 'border-pink-800'
  },
  theme3: {
    name: 'Forest Night',
    background: 'from-[#0f2027] via-[#203a43] to-[#2c5530]',
    card: 'bg-[#0d1b0f]',
    cardHover: 'hover:bg-[#1a2e1d]',
    button: 'from-green-600 to-lime-600',
    buttonHover: 'hover:from-green-700 hover:to-lime-700',
    accent: 'text-green-400',
    border: 'border-green-800'
  },
  theme4: {
    name: 'Sunset Fire',
    background: 'from-[#2d1b0f] via-[#4a2c1a] to-[#6b3e07]',
    card: 'bg-[#1a0f0a]',
    cardHover: 'hover:bg-[#2d1b0f]',
    button: 'from-orange-600 to-yellow-600',
    buttonHover: 'hover:from-orange-700 hover:to-yellow-700',
    accent: 'text-orange-400',
    border: 'border-orange-800'
  }
};

export function useTheme(currentTheme: Theme = 'theme1') {
  useEffect(() => {
    const theme = themes[currentTheme];
    document.documentElement.style.setProperty('--theme-background', theme.background);
    document.documentElement.style.setProperty('--theme-card', theme.card);
    document.documentElement.style.setProperty('--theme-button', theme.button);
    document.documentElement.style.setProperty('--theme-accent', theme.accent);
  }, [currentTheme]);

  return themes[currentTheme];
}