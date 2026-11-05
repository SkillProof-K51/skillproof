import { colors, opacity, radius } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { Icon } from "./Icon";
import { SkillLogo, skillLogoCount } from "./SkillLogo";

const SIZE = 52; // default diameter
const LOGO = 0.42; // one logo, as a share of the diameter
const LOGO_PAIR = 0.29; // each of two logos ("HTML and CSS"), so the pair stays inside the ring
const BADGE = 0.35; // the Verified tick's circle, as a share of the diameter
const TICK = 0.6; // the tick, as a share of its circle
const RING = 2; // ring thickness
const BADGE_NUDGE = -3; // the tick's circle hangs over the ring, bottom right

type Props = {
  /** The skill's name, as SkillLogo knows it ("JavaScript", "HTML and CSS", "SQL"…). */
  skill: string;
  status: "not_yet" | "practised" | "verified";
  /** The next skill to practise: a dashed ring in the role colour, the logo at full strength. */
  next?: boolean;
  size?: number;
};

/**
 * A skill as its logo in a circle, ringed by its status (Azim, 29 Oct): Verified = solid ring and a
 * tick · Practised = dashed ring · not yet = grey and faded · the next one to practise = a dashed
 * ring in the role colour. Decorative: the row or cell around it says the skill and status.
 */
export function SkillCircle({ skill, status, next = false, size = SIZE }: Props) {
  const badge = size * BADGE;
  return (
    <View style={[styles.circle, next ? styles.next : styles[status], { width: size, height: size }]} accessible={false}>
      <View style={status === "not_yet" && !next ? styles.faded : null}>
        <SkillLogo skill={skill} size={size * (skillLogoCount(skill) > 1 ? LOGO_PAIR : LOGO)} />
      </View>
      {status === "verified" ? (
        <View style={[styles.badge, { width: badge, height: badge }]}>
          <Icon name="check" size={badge * TICK} weight="bold" color={colors.text.inverse} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { borderRadius: radius.full, borderWidth: RING, alignItems: "center", justifyContent: "center" },
  verified: { backgroundColor: colors.accent.skySoft, borderColor: colors.accent.progress },
  practised: { backgroundColor: colors.bg.surface, borderColor: colors.accent.sky, borderStyle: "dashed" },
  not_yet: { backgroundColor: colors.bg.subtle, borderColor: colors.bg.subtle },
  next: { backgroundColor: colors.bg.surface, borderColor: colors.accent.progress, borderStyle: "dashed" },
  faded: { opacity: opacity.disabled },
  badge: {
    position: "absolute",
    right: BADGE_NUDGE,
    bottom: BADGE_NUDGE,
    borderRadius: radius.full,
    borderWidth: RING,
    borderColor: colors.bg.surface,
    backgroundColor: colors.accent.progress,
    alignItems: "center",
    justifyContent: "center",
  },
});
