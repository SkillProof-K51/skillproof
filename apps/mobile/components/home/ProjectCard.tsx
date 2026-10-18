import { colors, space } from "@skillproof/tokens";
import { StyleSheet, View, type ViewStyle } from "react-native";

import { placesLeftLabel, type MicroProject } from "../../lib/home";
import { Button, Card, Chip, CHIP_HEIGHT, Icon, Text } from "../ui";

type Props = {
  project: MicroProject;
  /** Small label on open projects, e.g. "Best match" for the first card, "Good fit" for the rest. */
  eyebrow: string;
  /** Open project → its details (Module 4). */
  onView: () => void;
  /** Locked project → practise the missing skill (Module 3). */
  onPractise: () => void;
  /** From the carousel: stretch to the tallest card so all buttons line up. */
  style?: ViewStyle;
};

/**
 * A micro-project in the Home slider. The ranking comes from the fit engine (Module 2) — this
 * card only displays it.
 * - Open: white card, blue eyebrow, Fit chip, "View project" (white, not blue — Azim: "too much blue").
 * - Locked (a required skill isn't Practised yet): white card, muted, "Practise <skill>" — the
 *   lock becomes the way back to Module 3.
 * Buttons are secondary: the screen's one strong CTA stays "Start challenge".
 */
export function ProjectCard({ project, eyebrow, onView, onPractise, style }: Props) {
  const locked = !!project.lockedBy;
  const details = [project.skillsLabel, !locked && project.placesLeft !== undefined ? placesLeftLabel(project.placesLeft) : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card
      style={StyleSheet.flatten([styles.card, style])}
      accessibilityLabel={locked ? `${project.title}, locked until ${project.lockedBy} is Practised` : undefined}
    >
      <View style={styles.top}>
        <Text variant="sectionLabel" color={locked ? "secondary" : "practised"}>
          {locked ? "Locked" : eyebrow}
        </Text>
        {locked ? (
          <Icon name="lock" size={20} color={colors.icon.default} />
        ) : project.fitPercent !== undefined ? (
          <Chip label={`Fit ${project.fitPercent}%`} tone="verified" />
        ) : null}
      </View>

      <View style={styles.text}>
        <Text variant="heading" color={locked ? "secondary" : "primary"}>
          {project.title}
        </Text>
        <Text variant="caption" color="secondary">
          {details}
        </Text>
        {locked ? (
          <Text variant="caption" color="secondary">
            Unlocks when {project.lockedBy} is Practised
          </Text>
        ) : null}
      </View>

      {/* pushes the button to the bottom when the card is stretched (carousel) */}
      <View style={styles.spacer} />
      {locked ? (
        <Button label={`Practise ${project.lockedBy}`} variant="secondary" block onPress={onPractise} />
      ) : (
        <Button label="View project" variant="secondary" block onPress={onView} />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.md },
  // same height whether the right side holds a Fit chip (open) or a lock icon (locked)
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: CHIP_HEIGHT },
  text: { gap: space.xs },
  spacer: { flexGrow: 1, marginTop: -space.md },
});
