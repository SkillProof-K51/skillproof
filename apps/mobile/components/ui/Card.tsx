import { colors, opacity, radius, space } from "@skillproof/tokens";
import { Pressable, StyleSheet, View, type PressableProps, type ViewProps, type ViewStyle } from "react-native";

type Tone = "surface" | "butter" | "blue";

type Props = ViewProps & {
  /**
   * surface = white card (default) · butter = energy, e.g. today's challenge ·
   * blue = a featured project (blue = in progress / projects, same rule as the Icon badge).
   */
  tone?: Tone;
  /** Makes the card tappable — the whole card is the button. */
  onPress?: PressableProps["onPress"];
  /** No decorative circles (e.g. forms, dense lists). */
  plain?: boolean;
  style?: ViewStyle;
};

// Two soft circles tucked into the card's corners (Azim, 18 Oct): one big top-right, one small
// along the bottom. They sit behind the content and are clipped by the card's rounded corners.
const DECOR_BIG = 150;
const DECOR_SMALL = 70;
const DECOR_BIG_OUT_X = 40; // how far the big circle hangs past the right edge…
const DECOR_BIG_OUT_Y = 50; // …and past the top edge
const DECOR_SMALL_FROM_RIGHT = 96;
const DECOR_SMALL_OUT_Y = 30; // how far the small one hangs below the bottom edge

/** Flat card: radius 16, padding 16, no border, no shadow, faint decorative circles. */
export function Card({ tone = "surface", onPress, plain, style, children, accessibilityLabel, ...rest }: Props) {
  const toneStyle = styles[tone];
  const decor = plain ? null : <Decor tone={tone} />;
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [styles.card, toneStyle, pressed && styles.pressed, style]}
      >
        {decor}
        {children}
      </Pressable>
    );
  }
  return (
    <View {...rest} accessibilityLabel={accessibilityLabel} style={[styles.card, toneStyle, style]}>
      {decor}
      {children}
    </View>
  );
}

function Decor({ tone }: { tone: Tone }) {
  const fill = { backgroundColor: colors.decor[tone] };
  return (
    <>
      <View style={[styles.circle, styles.big, fill]} pointerEvents="none" />
      <View style={[styles.circle, styles.small, fill]} pointerEvents="none" />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: space.lg,
    alignSelf: "stretch",
    overflow: "hidden", // clips the decorative circles to the rounded corners
    zIndex: 0, // its own layer, so the circles (zIndex -1) sit behind every child, on web too
  },
  surface: { backgroundColor: colors.bg.surface },
  butter: { backgroundColor: colors.accent.butterSoft },
  blue: { backgroundColor: colors.status.practised.bg },
  pressed: { opacity: opacity.pressed },
  // behind the content: on web, absolute boxes otherwise paint over plain children like an <svg>
  circle: { position: "absolute", borderRadius: radius.full, zIndex: -1 },
  big: { width: DECOR_BIG, height: DECOR_BIG, right: -DECOR_BIG_OUT_X, top: -DECOR_BIG_OUT_Y },
  small: { width: DECOR_SMALL, height: DECOR_SMALL, right: DECOR_SMALL_FROM_RIGHT, bottom: -DECOR_SMALL_OUT_Y },
});
