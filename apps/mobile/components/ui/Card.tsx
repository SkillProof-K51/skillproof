import { colors, opacity, radius, space } from "@skillproof/tokens";
import { Pressable, StyleSheet, View, type PressableProps, type ViewProps, type ViewStyle } from "react-native";

type Tone = "surface" | "butter" | "blue" | "passport";

type Props = ViewProps & {
  /**
   * surface = white card (default) · butter = energy, e.g. today's challenge ·
   * blue = a featured project (blue = in progress / projects, same rule as the Icon badge) ·
   * passport = navy cover with a gold edge, for the Skill Passport only (white / gold text on it).
   */
  tone?: Tone;
  /** Makes the card tappable — the whole card is the button. */
  onPress?: PressableProps["onPress"];
  style?: ViewStyle;
};

/** Flat card: radius 16, padding 16, no border, no shadow, no decoration (Azim, 18 Oct). */
export function Card({ tone = "surface", onPress, style, children, accessibilityLabel, ...rest }: Props) {
  const toneStyle = styles[tone];
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [styles.card, toneStyle, pressed && styles.pressed, style]}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View {...rest} accessibilityLabel={accessibilityLabel} style={[styles.card, toneStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: space.lg,
    alignSelf: "stretch",
    overflow: "hidden", // clips anything that hangs past the rounded corners (Today card's mascot)
    zIndex: 0, // its own layer, so a child at zIndex -1 still sits inside the card, on web too
  },
  surface: { backgroundColor: colors.bg.surface },
  butter: { backgroundColor: colors.accent.butterSoft },
  blue: { backgroundColor: colors.status.practised.bg },
  passport: { backgroundColor: colors.passport.cover, borderWidth: 1, borderColor: colors.passport.goldLine },
  pressed: { opacity: opacity.pressed },
});
