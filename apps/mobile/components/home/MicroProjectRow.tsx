import { space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import type { MicroProject } from "../../lib/home";
import { Card, Chip, Icon, IconBadge, Text } from "../ui";

type Props = {
  project: MicroProject;
  onPress?: () => void;
};

/** An open micro-project in a list (after the featured one). Locked ones use LockedProjectRow. */
export function MicroProjectRow({ project, onPress }: Props) {
  return (
    <Card onPress={onPress} style={styles.row}>
      <IconBadge icon="briefcase" tone="blue" />
      <View style={styles.text}>
        <Text variant="subheading">{project.title}</Text>
        <Text variant="caption" color="secondary">
          {project.skillsLabel}
        </Text>
        <View style={styles.meta}>
          {project.fitPercent !== undefined ? <Chip label={`Fit ${project.fitPercent}%`} tone="verified" /> : null}
          {project.placesLeft !== undefined ? <Chip label={`${project.placesLeft} places left`} /> : null}
        </View>
      </View>
      <Icon name="chevron-right" size={20} />
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  text: { flex: 1, gap: space.xs },
  meta: { flexDirection: "row", gap: 6, marginTop: 2 },
});
