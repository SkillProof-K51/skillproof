import { gap, space } from "@skillproof/tokens";
import { Pressable, StyleSheet, View } from "react-native";

import type { HomeData } from "../../lib/home";
import { Chip, Icon, ProgressRing, SkillLogo, Text } from "../ui";

const RING = 140; // the focal element of Home

type Props = {
  readiness: HomeData["readiness"];
  onPressRoadmap?: () => void;
};

/**
 * Home's focal point (Azim, 18 Oct): how ready the student is for their target role, and the
 * skills still missing for 100 %. Readiness comes from the Module 2 fit engine — this only shows it.
 */
export function ReadinessHero({ readiness, onPressRoadmap }: Props) {
  return (
    <View style={styles.wrap}>
      <ProgressRing percent={readiness.percent} size={RING} tone="sky" caption="ready" />
      <View style={styles.text}>
        <Text variant="label" color="secondary" align="center">
          {readiness.roleLabel}
        </Text>
        <Text variant="heading" align="center">
          {readiness.headline}
        </Text>
      </View>
      {readiness.focusSkills.length ? (
        <View style={styles.chips}>
          {readiness.focusSkills.map((skill) => (
            <Chip key={skill} label={skill} tone="surface" leading={<SkillLogo skill={skill} />} />
          ))}
        </View>
      ) : null}
      <Pressable onPress={onPressRoadmap} accessibilityRole="link" hitSlop={8} style={styles.link}>
        <Text variant="label">See my roadmap</Text>
        <Icon name="chevron-right" size={16} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: space.md, marginTop: space.lg },
  text: { alignItems: "center", gap: space.xxs },
  chips: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: gap.tight },
  link: { flexDirection: "row", alignItems: "center", gap: space.xxs },
});
