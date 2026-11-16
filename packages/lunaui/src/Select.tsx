import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal as RNModal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { Button } from './Button';
import { deriveColor } from './color';
import { useTheme } from './theme';

export type SelectOption = {
  value: string;
  label: string;
  /** Texto auxiliar ao lado do rótulo. */
  hint?: string;
  disabled?: boolean;
};

type Common = {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  color?: string;
};

export type SelectProps = Common &
  (
    | { multiple?: false; value?: string; onValueChange: (value: string) => void }
    | { multiple: true; value: string[]; onValueChange: (value: string[]) => void }
  );

const EDGE = 3;
const RADIUS = 28;

export function Select(props: SelectProps) {
  const { label, options, placeholder = 'Selecione', helper, error, disabled = false, searchable = false, color } = props;
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);
  const { height } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) setMounted(true);
    Animated.timing(t, {
      toValue: open ? 1 : 0,
      duration: open ? 220 : 160,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !open) setMounted(false);
    });
  }, [open, t]);

  const selected: string[] = props.multiple ? props.value : props.value ? [props.value] : [];
  const byValue = (v: string) => options.find((o) => o.value === v)?.label ?? v;
  const summary =
    selected.length === 0
      ? undefined
      : props.multiple && selected.length > 1
        ? `${selected.length} selecionados`
        : byValue(selected[0]!);

  const close = () => {
    setOpen(false);
    setQuery('');
  };
  const toggle = (o: SelectOption) => {
    if (o.disabled) return;
    if (props.multiple) {
      const next = selected.includes(o.value) ? selected.filter((v) => v !== o.value) : [...selected, o.value];
      props.onValueChange(next);
    } else {
      props.onValueChange(o.value);
      close();
    }
  };

  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()));
  const active = (open || !!error) && !disabled;
  const accent = error ? theme.error : c.base;
  const message = error ?? helper;

  return (
    <View style={styles.field}>
      <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>{label}</Text>
      <View
        style={{
          borderRadius: theme.radius.md,
          backgroundColor: active ? (error ? theme.error : c.dark) : 'transparent',
          paddingBottom: active ? EDGE : 0,
          marginBottom: active ? 0 : EDGE,
        }}
      >
        <Pressable
          accessibilityRole="combobox"
          accessibilityLabel={label}
          accessibilityValue={{ text: summary ?? placeholder }}
          accessibilityState={{ disabled, expanded: open }}
          disabled={disabled}
          onPress={() => setOpen(true)}
          style={[
            styles.box,
            {
              borderRadius: theme.radius.md,
              backgroundColor: disabled ? theme.disabledBg : theme.fieldBg,
              borderColor: disabled ? 'transparent' : active ? accent : theme.fieldLine,
            },
          ]}
        >
          <Text
            numberOfLines={1}
            style={{ flex: 1, fontSize: 16, color: disabled ? theme.disabledFg : summary ? theme.text : theme.placeholder }}
          >
            {summary ?? placeholder}
          </Text>
          <View
            style={{
              width: 10,
              height: 10,
              borderRightWidth: 2,
              borderBottomWidth: 2,
              borderColor: theme.muted,
              transform: [{ rotate: '45deg' }, { translateY: -3 }],
            }}
          />
        </Pressable>
      </View>
      {message ? (
        <Text accessibilityLiveRegion="polite" style={{ fontSize: 13, color: error ? theme.error : theme.muted }}>
          {message}
        </Text>
      ) : null}

      <RNModal visible={mounted} transparent animationType="none" statusBarTranslucent onRequestClose={close}>
        <Animated.View style={[styles.scrim, { backgroundColor: theme.scrim, opacity: t }]}>
          <Pressable style={StyleSheet.absoluteFill} accessibilityLabel="Fechar" accessibilityRole="button" onPress={close} />
          <Animated.View
            accessibilityViewIsModal
            style={{
              maxHeight: height * 0.78,
              borderTopLeftRadius: RADIUS,
              borderTopRightRadius: RADIUS,
              borderWidth: 2,
              borderBottomWidth: 0,
              borderColor: theme.cardLine,
              backgroundColor: theme.cardBg,
              paddingTop: 18,
              paddingHorizontal: 16,
              paddingBottom: 24,
              gap: 6,
              transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
            }}
          >
            <Text accessibilityRole="header" style={{ color: theme.text, fontSize: 17, fontWeight: '600', marginHorizontal: 6, marginBottom: 8 }}>
              {label}
            </Text>
            {searchable && (
              <TextInput
                accessibilityLabel="Buscar opção"
                placeholder="Buscar"
                placeholderTextColor={theme.placeholder}
                value={query}
                onChangeText={setQuery}
                selectionColor={c.base}
                style={{
                  height: 44,
                  marginHorizontal: 6,
                  marginBottom: 8,
                  paddingHorizontal: 14,
                  fontSize: 15,
                  color: theme.text,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: theme.fieldLine,
                  backgroundColor: theme.fieldBg,
                }}
              />
            )}
            <ScrollView keyboardShouldPersistTaps="handled" style={{ flexGrow: 0 }}>
              {filtered.map((o) => {
                const isSel = selected.includes(o.value);
                return (
                  <Pressable
                    key={o.value}
                    accessibilityRole={props.multiple ? 'checkbox' : 'radio'}
                    accessibilityState={{ checked: isSel, disabled: o.disabled }}
                    onPress={() => toggle(o)}
                    style={[styles.opt, isSel && { backgroundColor: c.soft }]}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: isSel ? '600' : '400',
                        color: o.disabled ? theme.disabledFg : isSel ? c.base : theme.text,
                      }}
                    >
                      {o.label}
                    </Text>
                    {o.hint ? <Text style={{ color: theme.muted, fontSize: 12 }}>{o.hint}</Text> : null}
                    <View
                      style={{
                        marginLeft: 'auto',
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: isSel ? c.base : theme.fieldLine,
                        backgroundColor: isSel ? c.base : 'transparent',
                      }}
                    />
                  </Pressable>
                );
              })}
            </ScrollView>
            {props.multiple && (
              <View style={{ marginTop: 10, marginHorizontal: 6 }}>
                <Button fullWidth color={color} onPress={close}>
                  Concluir
                </Button>
              </View>
            )}
          </Animated.View>
        </Animated.View>
      </RNModal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { alignSelf: 'stretch', gap: 6 },
  box: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 52, paddingHorizontal: 16, borderWidth: 2 },
  scrim: { flex: 1, justifyContent: 'flex-end' },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 50, paddingHorizontal: 12, borderRadius: 14 },
});
