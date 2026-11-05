import { colors, radius, space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { Avatar, Chip, IconBadge, ProgressBar, ProgressDots, ProgressRing, SkillCircle, SkillLogo, StatusBadge, Text } from "../ui";
import { KitLabel, KitSection } from "./KitSection";

const RING_SMALL = 64;
const RING_HALF = 160;
const SKILLS = ["Node.js", "JavaScript", "TypeScript", "React", "HTML and CSS", "Python", "PostgreSQL", "Git", "SQL", "Testing"];

/** Progress and status: rings, bar, dots, status badges, chips, icon badges, avatars, skill logos. */
export function ProgressDemo() {
  return (
    <KitSection title="Progress & status" components="ProgressRing · ProgressBar · ProgressDots · SkillCircle · StatusBadge · Chip · IconBadge · Avatar · SkillLogo">
      <KitLabel>ProgressRing · full, or a half gauge with a caption</KitLabel>
      <View style={styles.row}>
        <ProgressRing percent={72} size={RING_SMALL} />
        <ProgressRing percent={72} size={RING_HALF} shape="half" caption="ready" />
      </View>
      <KitLabel>ProgressBar · ProgressDots (challenges passed toward Practised)</KitLabel>
      <ProgressBar percent={72} />
      <ProgressDots done={2} of={3} />
      <KitLabel>SkillCircle · a skill by its status: Verified · Practised · up next · not yet (a pair of logos drawn smaller)</KitLabel>
      <View style={styles.wrap}>
        <SkillCircle skill="HTML and CSS" status="verified" />
        <SkillCircle skill="React" status="practised" />
        <SkillCircle skill="Node.js" status="not_yet" next />
        <SkillCircle skill="SQL" status="not_yet" />
      </View>
      <KitLabel>StatusBadge · the skill status, one way only: not yet → Practised → Verified</KitLabel>
      <View style={styles.wrap}>
        <StatusBadge status="not_yet" />
        <StatusBadge status="practised" />
        <StatusBadge status="verified" />
        <StatusBadge status="verified" label="3 Verified" />
      </View>
      <KitLabel>Chip · small facts; tone = meaning</KitLabel>
      <View style={styles.wrap}>
        <Chip label="Fit 86%" tone="verified" icon="check" />
        <Chip label="In progress" tone="practised" />
        <Chip label="3 min" tone="butter" icon="clock" />
        <Chip label="On a tinted card" tone="surface" icon="clock" />
        <Chip label="Neutral" />
        <Chip label="Node.js" tone="surface" leading={<SkillLogo skill="Node.js" />} />
      </View>
      <KitLabel>IconBadge · tile (lists, features) and circle; tone = meaning</KitLabel>
      <View style={styles.wrap}>
        <IconBadge icon="briefcase" tone="blue" />
        <IconBadge icon="check-circle" tone="green" />
        <IconBadge icon="lock" tone="grey" />
        <IconBadge icon="zap" tone="butter" />
        <IconBadge icon="id-card" tone="gold" />
        <IconBadge icon="user" tone="blue" shape="circle" />
        <IconBadge icon="share" tone="grey" shape="circle" />
      </View>
      <KitLabel>Avatar · initials until photos arrive with the shared core</KitLabel>
      <View style={styles.row}>
        <Avatar initials="AS" />
        {/* white, for a picture behind it (Home's scene) */}
        <View style={styles.tight}>
          <Avatar initials="AS" tone="surface" />
        </View>
        <Avatar initials="AS" size={RING_SMALL} />
      </View>
      <KitLabel>SkillLogo · the skill’s own mark, or an icon when it has none</KitLabel>
      <View style={styles.wrap}>
        {SKILLS.map((s) => (
          <View key={s} style={styles.logo}>
            <SkillLogo skill={s} size={24} />
            <Text variant="caption" color="secondary">
              {s}
            </Text>
          </View>
        ))}
      </View>
    </KitSection>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  wrap: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: space.sm },
  tight: { padding: space.md, borderRadius: radius.xl, backgroundColor: colors.bg.app },
  logo: { alignItems: "center", gap: space.xxs, width: RING_SMALL },
});
