import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TextInput, View } from 'react-native';
import { deriveColor } from './color';
import { useTheme } from './theme';

export type InputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  color?: string;
};

const EDGE = 3;
const MOON = 20;

/** Contador em fases da lua: enche conforme o texto se aproxima de maxLength. */
function MoonCounter({ ratio, color, shade }: { ratio: number; color: string; shade: string }) {
  const x = useRef(new Animated.Value(-MOON)).current;
  useEffect(() => {
    Animated.timing(x, { toValue: -MOON + Math.min(ratio, 1) * MOON, duration: 250, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, [ratio, x]);
  return (
    <View style={{ width: MOON, height: MOON, borderRadius: MOON / 2, backgroundColor: ratio === 0 ? shade : color, overflow: 'hidden' }}>
      {ratio > 0 && (
        <Animated.View style={{ width: MOON, height: MOON, borderRadius: MOON / 2, backgroundColor: shade, transform: [{ translateX: x }] }} />
      )}
    </View>
  );
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  helper,
  error,
  disabled = false,
  maxLength,
  color,
}: InputProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const [focused, setFocused] = useState(false);
  const active = (focused || !!error) && !disabled;
  const accent = error ? theme.error : c.base;
  const message = error ?? helper;

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View style={{ borderRadius: theme.radius.md, backgroundColor: active ? (error ? theme.error : c.dark) : 'transparent', paddingBottom: active ? EDGE : 0, marginBottom: active ? 0 : EDGE }}>
        <View
          style={[
            styles.box,
            {
              borderRadius: theme.radius.md,
              backgroundColor: disabled ? theme.disabledBg : theme.fieldBg,
              borderColor: disabled ? 'transparent' : active ? accent : theme.fieldLine,
            },
          ]}
        >
          <TextInput
            accessibilityLabel={label}
            accessibilityState={{ disabled }}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.placeholder}
            editable={!disabled}
            maxLength={maxLength}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            selectionColor={c.base}
            style={[styles.input, { color: disabled ? theme.disabledFg : theme.text }]}
          />
          {maxLength !== undefined && !disabled && (
            <MoonCounter ratio={value.length / maxLength} color={c.base} shade={theme.fieldLine} />
          )}
        </View>
      </View>
      {(message || maxLength !== undefined) && (
        <View style={styles.help}>
          <Text accessibilityLiveRegion="polite" style={{ flex: 1, fontSize: 13, color: error ? theme.error : theme.muted }}>
            {message}
          </Text>
          {maxLength !== undefined && (
            <Text style={{ fontSize: 13, color: theme.muted, fontVariant: ['tabular-nums'] }}>
              {value.length}/{maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { alignSelf: 'stretch', gap: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  box: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 52, paddingHorizontal: 16, borderWidth: 2 },
  input: { flex: 1, fontSize: 16, minHeight: 48, padding: 0 },
  help: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
});
