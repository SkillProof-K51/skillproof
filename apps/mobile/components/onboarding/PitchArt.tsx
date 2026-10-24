import { colors, gap, radius, shadow, space } from "@skillproof/tokens";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";

import { Avatar, Card, Chip, Icon, IconBadge, QrCode, SkillBadge, SkillLogo, Text, type SkillStatus } from "../ui";
import { KINDS } from "../challenges/ChallengeRow";

// The pictures on onboarding's four "why SkillProof" screens, built from the app's own pieces and
// tilted like BitePal's onboarding cards (Azim's references, 25 Oct). Demo content only.
const TILT_LEFT = "-4deg";
const TILT_RIGHT = "3deg";
const FAN = ["-7deg", "2deg", "-2deg"]; // three challenge cards, fanned
const BADGE = 70;
const ARROW = 18;
const STAR = 18;
const QR = 92;
const LOGO = 20; // a kind's icon on its mini card; the mentor's avatar is twice this
const CHIP_LOGO = 14;

const STAGES: { status: SkillStatus; label: string }[] = [
  { status: "not_yet", label: "Not yet" },
  { status: "practised", label: "Practised" },
  { status: "verified", label: "Verified" },
];

/** "Prove your skills": one skill's badge going from locked to Practised to Verified. */
export function ProveArt() {
  return (
    <View style={[styles.card, { transform: [{ rotate: TILT_LEFT }] }]}>
      <View style={styles.stages}>
        {STAGES.map((s, i) => (
          <Fragment key={s.status}>
            {i ? <Icon name="arrow-right" size={ARROW} color={colors.icon.muted} /> : null}
            <View style={styles.stage}>
              <SkillBadge skill="Node.js" status={s.status} size={BADGE} />
              <Text variant="captionStrong">{s.label}</Text>
            </View>
          </Fragment>
        ))}
      </View>
    </View>
  );
}

/** "15 minutes a day": the three kinds of challenge, fanned out in their colours. */
export function DailyArt() {
  const kinds = Object.values(KINDS);
  return (
    <View style={styles.fan}>
      {kinds.map((k, i) => (
        <View key={k.label} style={[styles.card, styles.mini, i ? styles.overlap : null, { backgroundColor: k.colours.page, transform: [{ rotate: FAN[i] }] }]}>
          <View style={styles.miniIcon}>
            <Icon name={k.icon} weight="duotone" size={LOGO} color={k.colours.ink} />
          </View>
          <Text variant="subheading" style={styles.flex}>
            {k.label}
          </Text>
          <Chip label={`${3 + i} min`} icon="clock" tone="surface" />
        </View>
      ))}
    </View>
  );
}

/** "Real projects, real mentors": a micro-project card with the mentor's rating. */
export function ProjectArt() {
  return (
    <View style={[styles.card, styles.project, { transform: [{ rotate: TILT_RIGHT }] }]}>
      <View style={styles.row}>
        <IconBadge icon="briefcase" tone="blue" />
        <View style={styles.flex}>
          <Text variant="subheading">Café landing page</Text>
          <Text variant="small" color="secondary">
            Micro-project · sample
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <Chip label="HTML and CSS" leading={<SkillLogo skill="HTML and CSS" size={CHIP_LOGO} />} />
        <Chip label="React" leading={<SkillLogo skill="React" size={CHIP_LOGO} />} />
      </View>
      <View style={styles.rating}>
        <Avatar initials="M" size={LOGO * 2} />
        <View style={styles.flex}>
          <Text variant="label" color="secondary">
            Your mentor rated it
          </Text>
          <View style={styles.stars} accessibilityLabel="4 of 5">
            {[0, 1, 2, 3, 4].map((n) => (
              <Icon key={n} name="star" weight={n < 4 ? "fill" : "regular"} size={STAR} color={n < 4 ? colors.passport.gold : colors.icon.muted} />
            ))}
          </View>
        </View>
        <Chip label="Verified" icon="check" tone="verified" />
      </View>
    </View>
  );
}

/** "A passport employers can check": the navy cover beside its QR code. */
export function PassportArt() {
  return (
    <View style={styles.passport}>
      <View style={[styles.cover, { transform: [{ rotate: TILT_LEFT }] }]}>
        <Card tone="passport">
          <IconBadge icon="id-card" tone="gold" />
          <Text variant="heading" color="inverse" style={styles.name}>
            Aina Sofea
          </Text>
          <Text variant="small" color="gold">
            Web Developer path
          </Text>
          <Text variant="caption" color="gold" style={styles.name}>
            3 Verified · 2 Practised
          </Text>
        </Card>
      </View>
      <View style={[styles.card, styles.qr, { transform: [{ rotate: TILT_RIGHT }] }]}>
        <QrCode value="https://skillproof.test/p/aina-sofea" size={QR} accessibilityLabel="QR code for a sample passport" />
        <Text variant="captionStrong">Scan to check</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.bg.surface, borderRadius: radius.xl, padding: space.lg, boxShadow: shadow.art },
  stages: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  stage: { alignItems: "center", gap: space.sm },
  fan: { paddingHorizontal: space.sm },
  overlap: { marginTop: -space.sm }, // fanned: each card overlaps the one above it
  mini: { flexDirection: "row", alignItems: "center", gap: space.md },
  miniIcon: { padding: space.sm, borderRadius: radius.full, backgroundColor: colors.bg.surface },
  flex: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: space.sm },
  project: { gap: gap.loose },
  rating: { flexDirection: "row", alignItems: "center", gap: space.md, paddingTop: space.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border.default },
  stars: { flexDirection: "row", gap: space.xxs, marginTop: space.xxs },
  passport: { flexDirection: "row", alignItems: "center", gap: space.md },
  cover: { flex: 1 },
  name: { marginTop: space.md },
  qr: { alignItems: "center", gap: space.sm, padding: space.md },
});
