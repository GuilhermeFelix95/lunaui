import { createContext, useContext, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { blend, deriveColor } from './color';
import { useTheme } from './theme';

export type RadioGroupProps = {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  direction?: 'column' | 'row';
  variant?: 'plain' | 'card';
  color?: string;
  children: ReactNode;
};

export type RadioProps = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

type Ctx = { value: string; onValueChange: (v: string) => void; variant: 'plain' | 'card'; color?: string };
const GroupContext = createContext<Ctx | null>(null);

function Radio({ value, label, description, disabled = false }: RadioProps) {
  const theme = useTheme();
  const g = useContext(GroupContext);
  const c = deriveColor(g?.color ?? theme.color);
  const checked = g?.value === value;
  const card = g?.variant === 'card';

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={description ? `${label}, ${description}` : label}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => g?.onValueChange(value)}
      style={({ pressed }) => [
        {
          minHeight: 48,
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 12,
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: card ? (checked ? c.base : theme.cardLine) : 'transparent',
          backgroundColor: checked && card ? blend(c.base, theme.cardBg, 0.15) : pressed ? blend(c.base, theme.cardBg, 0.1) : 'transparent',
          opacity: disabled ? 0.45 : 1,
        },
      ]}
    >
      <View
        style={{
          width: 24,
          height: 24,
          marginTop: 1,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: checked ? c.dark : theme.moonOff,
          backgroundColor: checked ? c.base : theme.cardBg,
        }}
      >
        {checked ? <View style={{ position: 'absolute', top: 4, left: 7, width: 12, height: 12, borderRadius: 6, backgroundColor: c.on }} /> : null}
      </View>
      <View style={{ flexShrink: 1 }}>
        <Text style={{ color: theme.text, fontSize: 15.5, fontWeight: '600', fontFamily: theme.fontFamily }}>{label}</Text>
        {description ? (
          <Text style={{ color: theme.muted, fontSize: 13, marginTop: 2, fontFamily: theme.fontFamily }}>{description}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function RadioGroupRoot({ value, onValueChange, label, direction = 'column', variant = 'plain', color, children }: RadioGroupProps) {
  return (
    <GroupContext.Provider value={{ value, onValueChange, variant, color }}>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={label}
        style={{ flexDirection: direction, flexWrap: direction === 'row' ? 'wrap' : 'nowrap', gap: variant === 'card' ? 10 : 4 }}
      >
        {children}
      </View>
    </GroupContext.Provider>
  );
}

export const RadioGroup = Object.assign(RadioGroupRoot, { Radio });
