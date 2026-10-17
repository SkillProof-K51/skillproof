import { colors, radius, space } from "@skillproof/tokens";
import { Pressable, StyleSheet, View, type PressableProps, type ViewProps, type ViewStyle } from "react-native";

type Props = ViewProps & {
  /** surface = white card (default); butter = energy, e.g. today's challenge. */
  tone?: "surface" | "butter";
  /** Makes the card tappable (list rows). */
  onPress?: PressableProps["onPress"];
  style?: ViewStyle;
};

/** Flat card: radius 16, padding 16, no border, no shadow. */
export function Card({ tone = "surface", onPress, style, children, ...rest }: Props) {
  const toneStyle = tone === "butter" ? styles.butter : styles.surface;
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.card, toneStyle, pressed && styles.pressed, style]}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View {...rest} style={[styles.card, toneStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: space.lg,
    alignSelf: "stretch",
  },
  surface: { backgroundColor: colors.bg.surface },
  butter: { backgroundColor: colors.accent.butterSoft },
  pressed: { opacity: 0.9 },
});
