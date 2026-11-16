import { useRef, useState } from 'react';
import { PanResponder, Text, View, type AccessibilityActionEvent } from 'react-native';
import { deriveColor } from './color';
import { useTheme } from './theme';

export type SliderProps = {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  showValue?: boolean;
  disabled?: boolean;
  color?: string;
};

const THUMB = 32;

export function Slider({ value, onValueChange, min = 0, max = 100, step = 1, label, showValue = false, disabled = false, color }: SliderProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);
  const latest = useRef({ value, onValueChange, min, max, step, disabled });
  latest.current = { value, onValueChange, min, max, step, disabled };

  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const p = max === min ? 0 : (clamp(value) - min) / (max - min);

  const setFromX = (x: number) => {
    const l = latest.current;
    if (l.disabled || widthRef.current <= 0) return;
    const raw = l.min + (Math.min(Math.max(x, 0), widthRef.current) / widthRef.current) * (l.max - l.min);
    const snapped = Math.min(l.max, Math.max(l.min, l.min + Math.round((raw - l.min) / l.step) * l.step));
    if (snapped !== l.value) l.onValueChange(snapped);
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => setFromX(e.nativeEvent.locationX),
      onPanResponderMove: (e) => setFromX(e.nativeEvent.locationX),
    }),
  ).current;

  const nudge = (e: AccessibilityActionEvent) => {
    const dir = e.nativeEvent.actionName === 'increment' ? 1 : -1;
    onValueChange(clamp(value + dir * step));
  };

  const steps = Math.round((max - min) / step);
  const ticks = steps > 1 && steps <= 10 ? Array.from({ length: steps + 1 }, (_, i) => i / steps) : [];

  return (
    <View style={{ gap: 4, opacity: disabled ? 0.45 : 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text style={{ color: theme.text, fontSize: 15, fontFamily: theme.fontFamily }}>{label}</Text>
        {showValue ? <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600', fontFamily: theme.fontFamily }}>{value}</Text> : null}
      </View>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min, max, now: value }}
        accessibilityState={{ disabled }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={nudge}
        onLayout={(e) => {
          widthRef.current = e.nativeEvent.layout.width;
          setWidth(e.nativeEvent.layout.width);
        }}
        style={{ height: 44, justifyContent: 'center' }}
        {...pan.panHandlers}
      >
        <View pointerEvents="none" style={{ height: 10, borderRadius: 6, backgroundColor: theme.trackOff, borderBottomWidth: 2, borderBottomColor: theme.trackOffEdge }} />
        <View
          pointerEvents="none"
          style={{ position: 'absolute', left: 0, height: 10, width: p * width, borderRadius: 6, backgroundColor: c.base, borderBottomWidth: 2, borderBottomColor: c.dark }}
        />
        {ticks.map((t, i) => (
          <View key={i} pointerEvents="none" style={{ position: 'absolute', left: t * width - 1, top: 19, width: 2, height: 6, backgroundColor: theme.cardLine }} />
        ))}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: p * width - THUMB / 2,
            width: THUMB,
            height: THUMB,
            borderRadius: THUMB / 2,
            borderWidth: 2,
            borderColor: c.base,
            backgroundColor: theme.cardBg,
            overflow: 'hidden',
          }}
        >
          <View style={{ position: 'absolute', width: THUMB, height: THUMB, borderRadius: THUMB / 2, backgroundColor: c.base, left: -THUMB + p * THUMB }} />
        </View>
      </View>
    </View>
  );
}
