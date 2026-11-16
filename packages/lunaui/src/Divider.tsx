import { Text, View } from 'react-native';
import { deriveColor } from './color';
import { useTheme } from './theme';

export type DividerProps = {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  /** Pequena lua no centro. */
  moon?: boolean;
  /** Recuo à esquerda, em dp (horizontal). */
  inset?: number;
  color?: string;
};

export function Divider({ orientation = 'horizontal', label, moon = false, inset = 0, color }: DividerProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const line = { backgroundColor: theme.cardLine, borderRadius: 2 };

  if (orientation === 'vertical') {
    return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 2, alignSelf: 'stretch', ...line }} />;
  }
  if (!label && !moon) {
    return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ height: 2, alignSelf: 'stretch', marginLeft: inset, ...line }} />;
  }
  return (
    <View
      accessibilityElementsHidden={!label}
      importantForAccessibility={label ? 'auto' : 'no-hide-descendants'}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, alignSelf: 'stretch', marginLeft: inset }}
    >
      <View style={{ flex: 1, height: 2, ...line }} />
      {label ? (
        <Text style={{ color: theme.muted, fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', fontFamily: theme.fontFamily }}>{label}</Text>
      ) : (
        <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: c.base, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', left: 5, width: 14, height: 14, borderRadius: 7, backgroundColor: theme.cardBg }} />
        </View>
      )}
      <View style={{ flex: 1, height: 2, ...line }} />
    </View>
  );
}
