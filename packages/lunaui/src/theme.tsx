import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export type LunaTheme = {
  color: string;
  disabledBg: string;
  disabledFg: string;
  focus: string;
  text: string;
  muted: string;
  placeholder: string;
  error: string;
  fieldBg: string;
  fieldLine: string;
  online: string;
  away: string;
  offline: string;
  boxLine: string;
  cardBg: string;
  cardLine: string;
  cardEdge: string;
  trackOff: string;
  trackOffEdge: string;
  moonOff: string;
  radius: { sm: number; md: number; lg: number };
};

type ThemeInput = Pick<LunaTheme, 'color'>;

export function createTheme(overrides: Partial<ThemeInput> = {}): ThemeInput {
  return { color: '#7c6cf0', ...overrides };
}

const ThemeContext = createContext<ThemeInput>(createTheme());

export function LunaProvider({ theme, children }: { theme?: ThemeInput; children: ReactNode }) {
  return <ThemeContext.Provider value={theme ?? createTheme()}>{children}</ThemeContext.Provider>;
}

export function useTheme(): LunaTheme {
  const { color } = useContext(ThemeContext);
  const dark = useColorScheme() === 'dark';
  return {
    color,
    disabledBg: dark ? '#201e3a' : '#e6e4f0',
    disabledFg: dark ? '#6c688f' : '#9b97b5',
    focus: dark ? '#74b0ff' : '#1c7ed6',
    text: dark ? '#eeecfb' : '#17142b',
    muted: dark ? '#a6a2c6' : '#625e7d',
    placeholder: dark ? '#7d79a0' : '#8b87a8',
    error: dark ? '#ff7b9c' : '#c92a55',
    fieldBg: dark ? '#0e0c22' : '#faf9fe',
    fieldLine: dark ? '#3a3566' : '#cfcae6',
    cardBg: dark ? '#13112a' : '#ffffff',
    cardLine: dark ? '#2f2a58' : '#d9d5ee',
    cardEdge: dark ? '#1d1a3a' : '#cfcae6',
    online: dark ? '#3ddc9d' : '#12a373',
    away: dark ? '#ffb23d' : '#d98a06',
    offline: dark ? '#8f8bb0' : '#7d7a99',
    boxLine: dark ? '#4a4580' : '#bdb8d8',
    trackOff: dark ? '#2c2850' : '#d8d4ec',
    trackOffEdge: dark ? '#1d1a3a' : '#bdb8d8',
    moonOff: dark ? '#6c688f' : '#8d88ad',
    radius: { sm: 12, md: 16, lg: 20 },
  };
}
