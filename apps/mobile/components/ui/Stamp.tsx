import { colors, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import type { SkillStatus } from "./StatusBadge";
import { Text } from "./Text";

const BORDER = 3;
const ROTATE = "-8deg"; // slapped on, not printed

type Status = Exclude<SkillStatus, "not_yet">;
const LABELS: Record<Status, string> = { practised: "Practised", verified: "Verified" };

type Props = {
  /** practised (blue, Module 3's result) or verified (green, Module 4's). Colour = meaning. */
  status: Status;
  /** Override the word, e.g. "Passed". Keep it to one or two words. */
  label?: string;
};

/** The rubber stamp on a Result screen's celebration beat: PRACTISED or VERIFIED, slightly rotated. */
export function Stamp({ status, label }: Props) {
  const tone = colors.status[status];
  const word = label ?? LABELS[status];
  return (
    <View style={[styles.stamp, { borderColor: tone.fg, backgroundColor: tone.bg }]} accessibilityRole="image" accessibilityLabel={`${word} stamp`}>
      <Text variant="stamp" color={tone.fg}>
        {word}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stamp: {
    alignSelf: "center",
    paddingHorizontal: space.lg,
    paddingVertical: space.xs,
    borderWidth: BORDER,
    borderRadius: radius.control,
    transform: [{ rotate: ROTATE }],
  },
});
