import { space } from "@skillproof/tokens";
import { Pressable, StyleSheet, View } from "react-native";

import type { HomeData } from "../../lib/home";
import { BottomSheet, Icon, SkillCircle, Text } from "../ui";

const COLUMNS = 3;
const ARROW = 14;
const STATUS = { verified: "Verified", practised: "Practised", not_yet: "Not yet" } as const;

type Props = {
  visible: boolean;
  onClose: () => void;
  readiness: HomeData["readiness"];
  /** The role's roadmap title, e.g. "Web Developer path". */
  pathLabel: string;
  /** "See your progress": the Progress screen. */
  onPressRoadmap: () => void;
};

/**
 * Home's readiness card, opened (Azim, 29 Oct): every skill on the path as a SkillCircle, its status
 * and how much it counts (Module 1's weight), and how Readiness adds them up. The percent and the
 * ready line come from the Module 2 fit engine; this only shows them.
 */
export function ReadinessSheet({ visible, onClose, readiness, pathLabel, onPressRoadmap }: Props) {
  const next = readiness.skills.findIndex((s) => s.status === "not_yet");
  return (
    <BottomSheet visible={visible} onClose={onClose} title={`${pathLabel} · ${readiness.percent}% ready`}>
      <Text variant="small" color="secondary">
        Each skill counts by how often employers ask for it. Verified counts in full, Practised counts half. You’re
        ready at {readiness.readyAt}%.
      </Text>
      <View style={styles.grid}>
        {readiness.skills.map((s, i) => {
          const status = i === next ? "Up next" : STATUS[s.status];
          return (
            <View key={s.name} style={styles.cell} accessible accessibilityLabel={`${s.name}: ${status}, counts ${s.weight}%`}>
              <SkillCircle skill={s.name} status={s.status} next={i === next} />
              <Text variant="label" align="center" numberOfLines={1}>
                {s.name}
              </Text>
              <Text variant="caption" color="secondary" align="center">
                {status} · {s.weight}%
              </Text>
            </View>
          );
        })}
      </View>
      <Pressable
        onPress={() => {
          onClose();
          onPressRoadmap();
        }}
        accessibilityRole="link"
        hitSlop={8}
        style={styles.link}
      >
        <Text variant="label" color="secondary">
          See your progress
        </Text>
        <Icon name="arrow-right" size={ARROW} />
      </Pressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: space.lg, marginTop: space.sm },
  cell: { width: `${100 / COLUMNS}%`, alignItems: "center", gap: space.xxs, paddingHorizontal: space.xs },
  link: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space.xs, paddingVertical: space.sm },
});
