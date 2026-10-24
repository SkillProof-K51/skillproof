import { space } from "@skillproof/tokens";
import { Pressable, StyleSheet, View } from "react-native";

import type { HomeData } from "../../lib/home";
import { Card, Icon, SegmentedProgress, Text, type SegmentFill } from "../ui";

const ARROW = 14;

const FILL: Record<HomeData["readiness"]["skills"][number]["status"], SegmentFill> = {
  verified: "strong",
  practised: "soft",
  not_yet: "empty",
};

type Props = {
  readiness: HomeData["readiness"];
  /** The role's roadmap title, e.g. "Web Developer path". */
  pathLabel: string;
  onPressRoadmap: () => void;
  onPressNext: () => void;
};

/**
 * Home's progress card (Azim, 24 Oct, the bar from his reference): the path and "See all", what's
 * up next and the readiness number, then one segment per roadmap skill — Verified strong,
 * Practised soft. Readiness comes from the Module 2 fit engine; this only shows it.
 */
export function ReadinessCard({ readiness, pathLabel, onPressRoadmap, onPressNext }: Props) {
  const { skills, percent } = readiness;
  const verified = skills.filter((s) => s.status === "verified").length;
  const practised = skills.filter((s) => s.status === "practised").length;
  // Up next: the first skill not yet practised, else the first one still waiting for a mentor.
  const toPractise = skills.find((s) => s.status === "not_yet");
  const toVerify = skills.find((s) => s.status === "practised");
  const next = toPractise ? `Practise ${toPractise.name}` : toVerify ? `Verify ${toVerify.name}` : null;

  return (
    <Card>
      <View style={styles.row}>
        <Text variant="heading" style={styles.flex}>
          {pathLabel}
        </Text>
        <Pressable onPress={onPressRoadmap} accessibilityRole="link" hitSlop={8} style={styles.link}>
          <Text variant="label" color="secondary">
            See all
          </Text>
          <Icon name="arrow-right" size={ARROW} />
        </Pressable>
      </View>

      <View style={[styles.row, styles.stats]}>
        <View style={styles.flex}>
          <Text variant="overline" color="secondary">
            Up next
          </Text>
          {next ? (
            <Pressable onPress={onPressNext} accessibilityRole="button" hitSlop={8} style={styles.link}>
              <Text variant="subheading" numberOfLines={1}>
                {next}
              </Text>
              <Icon name="arrow-right" size={ARROW} />
            </Pressable>
          ) : (
            <Text variant="subheading">Every skill is Verified</Text>
          )}
        </View>
        <View>
          <Text variant="overline" color="secondary" align="right">
            Readiness
          </Text>
          <Text variant="subheading" align="right">
            {percent}%
          </Text>
        </View>
      </View>

      <SegmentedProgress
        segments={skills.map((s) => FILL[s.status])}
        accessibilityLabel={`${verified} of ${skills.length} skills Verified, ${practised} Practised`}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  flex: { flex: 1 },
  link: { flexDirection: "row", alignItems: "center", gap: space.xs, alignSelf: "flex-start" },
  stats: { alignItems: "flex-end", marginTop: space.lg, marginBottom: space.md },
});
