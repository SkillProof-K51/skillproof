import { space } from "@skillproof/tokens";
import { StyleSheet } from "react-native";

import type { MicroProject } from "../../lib/home";
import { Card, Icon, Text } from "../ui";

type Props = {
  project: MicroProject;
  onPress?: () => void;
};

/** A locked micro-project as one slim line: what it is and which skill unlocks it. */
export function LockedProjectRow({ project, onPress }: Props) {
  return (
    <Card
      onPress={onPress}
      style={styles.row}
      accessibilityLabel={`${project.title}, locked until ${project.lockedBy} is Practised`}
    >
      <Icon name="lock" size={18} />
      <Text variant="label" color="secondary" numberOfLines={1} style={styles.title}>
        {project.title}
      </Text>
      <Text variant="caption" color="secondary">
        Unlocks at {project.lockedBy}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingVertical: space.md },
  title: { flex: 1 },
});
