import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { deriveColor } from './color';
import { useTheme } from './theme';

export type BadgeProps = {
  /** Texto do selo, ou o elemento (ícone) que recebe o contador quando `count` é usado. */
  children?: ReactNode;
  variant?: 'solid' | 'soft' | 'outline' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  /** Ponto de status em fases da lua: cheia = ativo, meia = pendente, nova = inativo. */
  status?: 'active' | 'pending' | 'inactive';
  /** Modo contador: exibe o número sobre `children`. Use 0 ou omita `children` para só o ponto. */
  count?: number;
  max?: number;
  dot?: boolean;
  color?: string;
};

const SIZES = {
  sm: { h: 20, font: 11, padX: 7, radius: 7 },
  md: { h: 26, font: 13, padX: 10, radius: 9 },
  lg: { h: 32, font: 15, padX: 13, radius: 11 },
} as const;
const DOT = 10;

function StatusDot({ status, color }: { status: NonNullable<BadgeProps['status']>; color: string }) {
  const ring = { width: DOT, height: DOT, borderRadius: DOT / 2, borderWidth: 2, borderColor: color, overflow: 'hidden' as const };
  if (status === 'active') return <View style={{ width: DOT, height: DOT, borderRadius: DOT / 2, backgroundColor: color }} />;
  if (status === 'inactive') return <View style={ring} />;
  return (
    <View style={ring}>
      <View style={{ width: DOT / 2 - 1, height: DOT, backgroundColor: color }} />
    </View>
  );
}

export function Badge({
  children,
  variant = 'soft',
  size = 'md',
  status,
  count,
  max = 99,
  dot = false,
  color,
}: BadgeProps) {
  const theme = useTheme();
  const c = deriveColor(color ?? theme.color);

  if (count !== undefined || dot) {
    const label = count === undefined ? undefined : count > max ? `${max}+` : String(count);
    const small = dot || label === undefined;
    return (
      <View accessible accessibilityLabel={label ? `${label} notificações` : 'Novas notificações'} style={{ alignSelf: 'flex-start' }}>
        {children}
        <View
          style={{
            position: 'absolute',
            top: small ? -4 : -9,
            right: small ? -4 : -9,
            minWidth: small ? 12 : 22,
            height: small ? 12 : 22,
            paddingHorizontal: small ? 0 : 6,
            borderRadius: small ? 6 : 9,
            backgroundColor: c.base,
            borderWidth: 3,
            borderColor: theme.cardBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!small && <Text style={{ color: c.on, fontSize: 12, fontWeight: '600', marginVertical: -3 }}>{label}</Text>}
        </View>
      </View>
    );
  }

  const s = SIZES[size];
  const fg = variant === 'solid' ? c.on : variant === 'neutral' ? theme.muted : c.base;
  const bg = variant === 'solid' ? c.base : variant === 'soft' ? c.soft : variant === 'neutral' ? theme.cardLine : 'transparent';
  const edge = variant === 'solid';

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        borderRadius: s.radius,
        backgroundColor: edge ? c.dark : 'transparent',
        paddingBottom: edge ? 2 : 0,
      }}
    >
      <View
        style={{
          height: s.h,
          paddingHorizontal: s.padX,
          borderRadius: s.radius,
          backgroundColor: bg,
          borderWidth: variant === 'outline' ? 2 : 0,
          borderColor: c.base,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {status && <StatusDot status={status} color={fg} />}
        <Text style={{ color: fg, fontSize: s.font, fontWeight: '600' }}>{children}</Text>
      </View>
    </View>
  );
}
