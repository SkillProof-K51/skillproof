import { space } from "@skillproof/tokens";
import { StyleSheet, View, type DimensionValue } from "react-native";

import type { TargetRole } from "../../lib/auth";
import { Card, Divider, SkillBadge, Text } from "../ui";

const BADGE = 64;
const COLUMNS = 3;
const CELL: DimensionValue = `${100 / COLUMNS}%`;

/** "A, B and C". */
const listOf = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}` : items[0]);

type Props = {
  role: TargetRole;
  /** Ids of the skills the student said they've used: their first challenges start there. */
  used: string[];
};

/**
 * Onboarding's last step before sign-up: the role's roadmap as badges, every one locked (only
 * evidence unlocks them, rule 7), and where the first challenges start.
 */
export function RoadmapPreview({ role, used }: Props) {
  const start = role.roadmap.filter((s) => used.includes(s.id)).map((s) => s.name);
  return (
    <Card>
      <View style={styles.grid}>
        {role.roadmap.map((skill) => (
          <View key={skill.id} style={styles.cell}>
            <SkillBadge skill={skill.name} status="not_yet" size={BADGE} />
            <Text variant="label" align="center" numberOfLines={2}>
              {skill.name}
            </Text>
          </View>
        ))}
      </View>
      <Divider />
      <Text variant="body" color="secondary" style={styles.start}>
        {start.length
          ? `Your first challenges: ${listOf(start)}, since you’ve used them.`
          : `Your first challenge: ${role.roadmap[0]?.name}, the start of the roadmap.`}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: space.lg, marginBottom: space.lg },
  cell: { width: CELL, alignItems: "center", gap: space.sm },
  start: { marginTop: space.md },
});
