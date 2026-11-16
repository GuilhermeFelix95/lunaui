import { Pressable, View, type AccessibilityActionEvent } from 'react-native';
import { deriveColor } from './color';
import { useTheme } from './theme';

export type RatingProps = {
  /** 0 a `max`; aceita meio ponto. */
  value: number;
  onValueChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  size?: 'sm' | 'md';
  color?: string;
};

function Moon({ fill, d, base, track, line }: { fill: number; d: number; base: string; track: string; line: string }) {
  return (
    <View style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: track, borderWidth: 2, borderColor: line, overflow: 'hidden' }}>
      <View style={{ position: 'absolute', left: -2 - d + fill * d, top: -2, width: d, height: d, borderRadius: d / 2, backgroundColor: base }} />
    </View>
  );
}

export function Rating({ value, onValueChange, max = 5, readOnly = false, size = 'md', color }: RatingProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const d = size === 'sm' ? 20 : 28;
  const box = size === 'sm' ? 28 : 40;
  const editable = !readOnly && !!onValueChange;

  const moons = Array.from({ length: max }, (_, i) => {
    const fill = Math.max(0, Math.min(1, value - i));
    const m = <Moon fill={fill} d={d} base={c.base} track={theme.trackOff} line={theme.cardLine} />;
    if (!editable) return <View key={i} style={{ width: box, height: box, alignItems: 'center', justifyContent: 'center' }}>{m}</View>;
    return (
      <Pressable
        key={i}
        accessibilityRole="radio"
        accessibilityLabel={`${i + 1} de ${max}`}
        accessibilityState={{ checked: value === i + 1 }}
        onPress={() => onValueChange!(i + 1)}
        style={{ width: box, height: box, alignItems: 'center', justifyContent: 'center' }}
      >
        {m}
      </Pressable>
    );
  });

  if (!editable) {
    return (
      <View accessible accessibilityRole="image" accessibilityLabel={`Nota ${String(value).replace('.', ',')} de ${max}`} style={{ flexDirection: 'row', gap: 6 }}>
        {moons}
      </View>
    );
  }

  const nudge = (e: AccessibilityActionEvent) => {
    const dir = e.nativeEvent.actionName === 'increment' ? 1 : -1;
    onValueChange!(Math.min(max, Math.max(0, Math.round(value) + dir)));
  };
  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Nota"
      accessibilityValue={{ min: 0, max, now: Math.round(value) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={nudge}
      style={{ flexDirection: 'row', gap: 6 }}
    >
      {moons}
    </View>
  );
}
