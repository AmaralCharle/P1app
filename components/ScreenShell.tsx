import type { PropsWithChildren } from 'react';
import {
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

type ScreenShellStyles = {
  card: StyleProp<ViewStyle>;
  titulo: StyleProp<TextStyle>;
  sectionTitle: StyleProp<TextStyle>;
  subtitulo: StyleProp<TextStyle>;
  subtitleText: StyleProp<TextStyle>;
};

export function ScreenShell({
  title,
  subtitle,
  styles,
  children,
}: PropsWithChildren<{
  title: string;
  subtitle: string;
  styles: ScreenShellStyles;
}>) {
  return (
    <View style={styles.card}>
      <Text style={[styles.titulo, styles.sectionTitle]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitulo, styles.subtitleText]}>{subtitle}</Text>
      ) : null}
      {children}
    </View>
  );
}
