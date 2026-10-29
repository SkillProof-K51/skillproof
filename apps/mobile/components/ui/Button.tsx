import { colors, opacity, radius, space, type } from "@skillproof/tokens";
import { Pressable, StyleSheet, View, type PressableProps, type ViewStyle } from "react-native";

import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";

const EDGE = 4; // the darker edge under the face; a press pushes the face down onto it
const OUTLINE = 2; // the secondary button's outline (its edge is EDGE thick)
const PAD_Y = 14;
const ICON = 18;
// Capitals have no descenders, so they sit high in their line box; this lowers the label so its
// capitals are centred on the icon and the face. Measured in the browser on Sofia Sans 800 at
// 15/20: the capitals' ink sat 1 px above the icon's and the face's centre.
const CAPS_NUDGE = 1;
// Icons whose drawing leans to one side of their box pull the label off-centre. Play leans right
// (4.5 px empty on its left, 1.1 on its right at 18 px), so it moves left by the difference. The
// others on buttons (retry, share, qr, briefcase) are within half a pixel.
const OPTICAL_LEFT: Partial<Record<IconName, number>> = { play: 3.4 };

type Props = Omit<PressableProps, "style" | "children"> & {
  label: string;
  /**
   * primary = the ONE main action on a screen · secondary = everything else ·
   * danger = the confirm button of a delete / remove dialog (red = can't be undone) ·
   * text = a quiet text-only action beside a form (Forgot password?) — never the main one.
   */
  variant?: "primary" | "secondary" | "danger" | "text";
  icon?: IconName;
  /** Stretch to the container width (cards, sheets). */
  block?: boolean;
  style?: ViewStyle;
};

/**
 * Chunky buttons (Azim, 29 Oct): a face on a darker edge, the label in capitals. Pressing pushes
 * the face down onto its edge — the button's height stays the same, so nothing around it moves.
 * `text` stays flat and in normal case.
 */
export function Button({ label, variant = "primary", icon, block, style, disabled, ...rest }: Props) {
  const filled = variant === "primary" || variant === "danger";
  const fg = filled ? colors.action.onPrimaryStrong : colors.text.primary;

  if (variant === "text") {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        disabled={disabled}
        {...rest}
        style={({ pressed }) => [styles.row, styles.text, pressed && styles.pressedText, disabled && styles.disabled, style]}
      >
        {icon ? <Icon name={icon} size={ICON} color={fg} /> : null}
        <Text variant="bodyStrong">{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label} // the words as written, not the capitals on screen
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      {...rest}
      style={[block ? styles.block : styles.hug, disabled && styles.disabled, style]}
    >
      {({ pressed }) => (
        <View style={[styles.row, styles.face, styles[variant], pressed && !disabled && styles[`${variant}Pressed`]]}>
          {icon ? (
            <View style={{ marginLeft: -(OPTICAL_LEFT[icon] ?? 0) }}>
              <Icon name={icon} size={ICON} color={fg} />
            </View>
          ) : null}
          <Text variant="button" color={fg} style={styles.label}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space.sm },
  hug: { alignSelf: "flex-start" },
  block: { alignSelf: "stretch" },
  face: {
    paddingHorizontal: space.xl,
    paddingVertical: PAD_Y,
    borderRadius: radius.lg,
    borderBottomWidth: EDGE,
  },
  // the letter spacing also follows the last capital; taking it back keeps the word centred
  label: { transform: [{ translateY: CAPS_NUDGE }], marginRight: -type.button.letterSpacing },
  primary: { backgroundColor: colors.action.primary, borderColor: colors.action.primaryEdge },
  danger: { backgroundColor: colors.action.danger, borderColor: colors.action.dangerEdge },
  secondary: {
    backgroundColor: colors.bg.surface,
    borderColor: colors.action.secondaryEdge,
    borderWidth: OUTLINE,
    borderBottomWidth: EDGE,
    paddingTop: PAD_Y - OUTLINE, // the outline sits inside the same height as a filled face
  },
  // Pressed: the face drops by its edge, so the whole button keeps its height.
  primaryPressed: { borderBottomWidth: 0, marginTop: EDGE },
  dangerPressed: { borderBottomWidth: 0, marginTop: EDGE },
  secondaryPressed: { borderBottomWidth: OUTLINE, marginTop: EDGE - OUTLINE },
  text: { alignSelf: "flex-start", paddingVertical: space.md },
  pressedText: { opacity: opacity.pressed },
  disabled: { opacity: opacity.disabled },
});
