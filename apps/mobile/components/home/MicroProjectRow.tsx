import { space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import type { HomeData } from "../../lib/home";
import { Card, Chip, Icon, IconBadge, Text } from "../ui";

type Props = {
  project: HomeData["microProjects"][number];
  onPress?: () => void;
};

/** One micro-project in a list. Locked rows go grey and show why. (Module 4 will own the real one.) */
export function MicroProjectRow({ project, onPress }: Props) {
  const locked = !!project.lockedBy;
  const color = locked ? "secondary" : "primary";
  return (
    <Card onPress={onPress} style={styles.row}>
      <IconBadge icon={locked ? "lock" : "briefcase"} tone={locked ? "grey" : "blue"} />
      <View style={styles.text}>
        <Text variant="subheading" color={color}>
          {project.title}
        </Text>
        <Text variant="caption" color="secondary">
          {project.skillsLabel}
        </Text>
        {locked ? (
          <Text variant="caption" color="secondary">
            Unlocks when {project.lockedBy} is Practised
          </Text>
        ) : (
          <View style={styles.meta}>
            {project.fitPercent !== undefined ? <Chip label={`Fit ${project.fitPercent}%`} tone="verified" /> : null}
            {project.placesLeft !== undefined ? <Chip label={`${project.placesLeft} places left`} /> : null}
          </View>
        )}
      </View>
      <Icon name={locked ? "lock" : "chevron-right"} size={20} />
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  text: { flex: 1, gap: space.xs },
  meta: { flexDirection: "row", gap: 6, marginTop: 2 },
});
