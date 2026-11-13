import type { ThemeColors } from '../theme';
import { useTheme } from '../ThemeContext';
import type { ComponentProps, PropsWithChildren } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { radius, spacing } from '../theme';

export function AcademicScreen({
  title,
  subtitle,
  children,
}: PropsWithChildren<{ title: string; subtitle: string }>) {
  const ui = useAcademicStyles();
  const { width } = useWindowDimensions();
  return (
    <KeyboardAvoidingView
      style={ui.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={ui.screen}
        contentContainerStyle={[ui.container, width < 600 && { padding: 16 }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Text style={ui.eyebrow}>ACADEMY NOTES / ACADÊMICO</Text>
        <Text style={ui.title}>{title}</Text>
        <Text style={ui.subtitle}>{subtitle}</Text>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function Card({ children }: PropsWithChildren) {
  const ui = useAcademicStyles();
  return <View style={ui.card}>{children}</View>;
}

export function Action({
  label,
  onPress,
  icon = 'arrow-right',
  secondary = false,
}: {
  label: string;
  onPress: () => void;
  icon?: ComponentProps<typeof Feather>['name'];
  secondary?: boolean;
}) {
  const { colors } = useTheme();
  const ui = useAcademicStyles();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        ui.button,
        secondary && ui.secondaryButton,
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text
        style={[
          ui.buttonText,
          { color: secondary ? colors.text : colors.textInverse },
        ]}
      >
        {label}
      </Text>
      <Feather
        name={icon}
        size={17}
        color={secondary ? colors.text : colors.textInverse}
      />
    </Pressable>
  );
}

const createAcademicStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    container: {
      padding: spacing.lg,
      paddingBottom: spacing.bottom,
      gap: spacing.md,
    },
    eyebrow: {
      color: colors.info,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.4,
    },
    title: { color: colors.text, fontSize: 28, fontWeight: '800' },
    subtitle: {
      color: colors.textSoft,
      fontSize: 14,
      lineHeight: 22,
      marginBottom: spacing.sm,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    column: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 280,
      minWidth: 0,
      maxWidth: '100%',
      gap: spacing.md,
    },
    card: {
      backgroundColor: colors.backgroundCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.xl,
      padding: spacing.card,
      gap: spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: spacing.mdCompact,
    },
    spread: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    heading: { color: colors.text, fontSize: 18, fontWeight: '700' },
    text: { color: colors.textSoft, fontSize: 14, lineHeight: 22 },
    muted: { color: colors.textMuted, fontSize: 12, lineHeight: 19 },
    metric: { color: colors.text, fontSize: 32, fontWeight: '800' },
    badge: {
      color: colors.info,
      backgroundColor: colors.backgroundPill,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: radius.full,
      overflow: 'hidden',
      fontSize: 12,
      fontWeight: '700',
    },
    input: {
      backgroundColor: colors.backgroundSoft,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.borderInput,
      borderRadius: radius.md,
      padding: spacing.input,
      fontSize: 15,
      minHeight: 48,
    },
    button: {
      backgroundColor: colors.primaryDark,
      padding: spacing.input,
      borderRadius: radius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      minHeight: 48,
    },
    secondaryButton: {
      backgroundColor: colors.backgroundPill,
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '700',
      flexShrink: 1,
      textAlign: 'center',
    },
    chip: {
      borderWidth: 1,
      borderColor: colors.borderInput,
      borderRadius: radius.full,
      paddingHorizontal: 14,
      paddingVertical: 10,
      minHeight: 44,
      justifyContent: 'center',
    },
    chipActive: {
      backgroundColor: colors.backgroundPill,
      borderColor: colors.primary,
    },
    error: { color: colors.danger, fontSize: 14, lineHeight: 22 },
    success: { color: colors.success },
    divider: {
      borderTopWidth: 1,
      borderColor: colors.border,
      paddingTop: spacing.md,
    },
  });

export function useAcademicStyles() {
  const { colors } = useTheme();
  return createAcademicStyles(colors);
}
