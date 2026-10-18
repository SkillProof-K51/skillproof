import { colors, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { Text } from "./Text";

export type SkillStatus = "not_yet" | "practised" | "verified";

const LABELS: Record<SkillStatus, string> = { not_yet: "Not yet", practised: "Practised", verified: "Verified" };

type Props = {
  status: SkillStatus;
  /** Override the label, e.g. "3 Verified". */
  label?: string;
};

/**
 * Skill status pill. Verified = a mentor rated the skill (Module 4). Practised = 3 challenges
 * passed at 70 %+ (Module 3). Not yet = no evidence. The 14 px glyphs are the Figma originals.
 */
export function StatusBadge({ status, label }: Props) {
  const tone = status === "verified" ? colors.status.verified : status === "practised" ? colors.status.practised : colors.status.notYet;
  return (
    <View style={[styles.badge, { backgroundColor: tone.bg }]}>
      <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
        <Circle cx={7} cy={7} r={5.25} stroke={tone.fg} strokeWidth={1.5} />
        {status === "verified" ? (
          <Path d="M4.667 7.292l1.75 1.75 2.916-3.5" stroke={tone.fg} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        ) : status === "practised" ? (
          <Circle cx={7} cy={7} r={2.333} stroke={tone.fg} strokeWidth={1.5} />
        ) : null}
      </Svg>
      <Text variant="label" color={tone.fg}>
        {label ?? LABELS[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    paddingLeft: space.sm,
    paddingRight: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
});
