import { space } from "@skillproof/tokens";
import { StyleSheet, View, type ViewStyle } from "react-native";

import { placesLeftLabel, type MicroProject } from "../../lib/home";
import { Button, Card, Chip, Text } from "../ui";

type Props = {
  project: MicroProject;
  /** Small label on top, e.g. "Best match" for the first card, "Good fit" for the rest. */
  eyebrow: string;
  onPress?: () => void;
  /** From the carousel: stretch to the tallest card so all buttons line up. */
  style?: ViewStyle;
};

/**
 * A top-matching micro-project, shown bigger than the list rows. The ranking comes from the fit
 * engine (Module 2) — this card only displays it. Its button is secondary: the screen's one strong
 * CTA stays "Start challenge".
 */
export function FeaturedProjectCard({ project, eyebrow, onPress, style }: Props) {
  const details = [project.skillsLabel, project.placesLeft !== undefined ? placesLeftLabel(project.placesLeft) : null]
    .filter(Boolean)
    .join(" · ");
  return (
    <Card tone="blue" style={StyleSheet.flatten([styles.card, style])}>
      <View style={styles.top}>
        <Text variant="sectionLabel" color="practised">
          {eyebrow}
        </Text>
        {project.fitPercent !== undefined ? <Chip label={`Fit ${project.fitPercent}%`} tone="verified" /> : null}
      </View>
      <View style={styles.text}>
        <Text variant="heading">{project.title}</Text>
        <Text variant="caption" color="secondary">
          {details}
        </Text>
      </View>
      {/* pushes the button to the bottom when the card is stretched (carousel) */}
      <View style={styles.spacer} />
      <Button label="View project" variant="secondary" block onPress={onPress} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.md },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  text: { gap: space.xs },
  spacer: { flexGrow: 1, marginTop: -space.md },
});
