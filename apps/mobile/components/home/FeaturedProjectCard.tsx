import { space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import type { MicroProject } from "../../lib/home";
import { Button, Card, Chip, Text } from "../ui";

type Props = {
  project: MicroProject;
  onPress?: () => void;
};

/**
 * The student's best-matching micro-project, shown bigger than the rest. Which project is "best"
 * is decided by the fit engine (Module 2) — this card only displays the first one it ranks.
 * Its button is secondary: the screen's one strong CTA stays "Start challenge".
 */
export function FeaturedProjectCard({ project, onPress }: Props) {
  const details = [project.skillsLabel, project.placesLeft !== undefined ? `${project.placesLeft} places left` : null]
    .filter(Boolean)
    .join(" · ");
  return (
    <Card tone="blue" style={styles.card}>
      <View style={styles.top}>
        <Text variant="sectionLabel" color="practised">
          Best match
        </Text>
        {project.fitPercent !== undefined ? <Chip label={`Fit ${project.fitPercent}%`} tone="verified" /> : null}
      </View>
      <View style={styles.text}>
        <Text variant="heading">{project.title}</Text>
        <Text variant="caption" color="secondary">
          {details}
        </Text>
      </View>
      <Button label="View project" variant="secondary" block onPress={onPress} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.md },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  text: { gap: space.xs },
});
