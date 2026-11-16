import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { blend, deriveColor } from './color';
import { useTheme } from './theme';

export type AlertProps = {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  children?: ReactNode;
  action?: { label: string; onPress: () => void };
  onClose?: () => void;
  /** Cor do tom `info`. */
  color?: string;
};

const EDGE = 3;
const MOON = 26;
// fase da lua por tom: deslocamento do disco que recorta
const PHASE = { info: 0.35, success: 0, warning: 0.5, danger: -1 } as const;

export function Alert({ tone = 'info', title, children, action, onClose, color }: AlertProps) {
  const theme = useTheme();
  const t = tone === 'success' ? theme.online : tone === 'warning' ? theme.away : tone === 'danger' ? theme.error : deriveColor(color ?? theme.color).base;
  const face = blend(t, theme.cardBg, 0.12);
  const urgent = tone === 'danger' || tone === 'warning';
  const kind = { info: 'Informação', success: 'Sucesso', warning: 'Aviso', danger: 'Erro' }[tone];

  return (
    <View accessibilityRole={urgent ? 'alert' : undefined} accessibilityLabel={`${kind}: ${title}`} style={{ borderRadius: 20, backgroundColor: t, paddingBottom: EDGE }}>
      <View style={{ borderRadius: 20, borderWidth: 2, borderColor: t, backgroundColor: face, padding: 14, paddingRight: onClose ? 8 : 14, flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
        <View style={{ width: MOON, height: MOON, borderRadius: MOON / 2, backgroundColor: t, overflow: 'hidden', marginTop: 1 }}>
          <View style={{ position: 'absolute', left: PHASE[tone] * MOON, width: MOON, height: MOON, borderRadius: MOON / 2, backgroundColor: face }} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ color: theme.text, fontSize: 15.5, fontWeight: '600', fontFamily: theme.fontFamily }}>{title}</Text>
          {typeof children === 'string' ? (
            <Text style={{ color: theme.muted, fontSize: 14, lineHeight: 21, marginTop: 2, fontFamily: theme.fontFamily }}>{children}</Text>
          ) : (
            children
          )}
          {action ? (
            <Pressable accessibilityRole="button" onPress={action.onPress} hitSlop={8} style={{ minHeight: 32, justifyContent: 'center', marginTop: 6, alignSelf: 'flex-start' }}>
              <Text style={{ color: t, fontSize: 14, fontWeight: '600', textDecorationLine: 'underline', fontFamily: theme.fontFamily }}>{action.label}</Text>
            </Pressable>
          ) : null}
        </View>
        {onClose ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar aviso"
            onPress={onClose}
            hitSlop={6}
            style={{ width: 32, height: 32, marginTop: -4, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: theme.muted, fontSize: 20, lineHeight: 22 }}>×</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
