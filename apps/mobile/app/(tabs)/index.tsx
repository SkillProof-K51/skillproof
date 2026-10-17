import { colors, layout, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FeaturedProjectCard } from "../../components/home/FeaturedProjectCard";
import { LockedProjectRow } from "../../components/home/LockedProjectRow";
import { MicroProjectRow } from "../../components/home/MicroProjectRow";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Icon,
  IconBadge,
  Mascot,
  MascotShadow,
  ProgressRing,
  Screen,
  SectionHeader,
  SkyBackdrop,
  SpeechBubble,
  StatusBadge,
  Text,
} from "../../components/ui";
import { getHomeData, greetingFor } from "../../lib/home";

const HERO = 300; // Home stretches the Tall sky to 300; the first card overlaps it by 56 (lip 32 + 24)

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const data = getHomeData();

  if (!data) return <HomeEmpty />;
  const { student, readiness, todaysChallenge, microProjects, passport } = data;
  // The list arrives ranked; the first open project is featured, the rest follow as rows.
  const featured = microProjects.find((p) => !p.lockedBy);
  const others = microProjects.filter((p) => p !== featured);
  const openProjects = () => router.push("/projects");

  return (
    <Screen>
      {/* Hero — sky, greeting, mascot. Positions are the Figma ones; the mascot anchors right. */}
      <View style={styles.hero}>
        <SkyBackdrop height={HERO} />
        <MascotShadow width={88} style={styles.mascotShadow} />
        <Mascot pose="wave" width={142} style={styles.mascot} />
        <SpeechBubble text={data.bubble} style={styles.bubble} />
        <View style={[styles.header, { top: insets.top + 13 }]}>
          <View style={styles.greeting}>
            <Text variant="title">
              {greetingFor(new Date())}, {student.firstName}
            </Text>
            <Text variant="small" color="secondary">
              {student.pathLabel}
            </Text>
          </View>
          <Avatar initials={student.initials} />
        </View>
      </View>

      <View style={styles.content}>
        {/* Readiness (Module 2 computes it; Home only displays) */}
        <Card style={styles.readiness}>
          <ProgressRing percent={readiness.percent} />
          <View style={styles.readinessText}>
            <Text variant="label" color="secondary">
              {readiness.roleLabel}
            </Text>
            <Text variant="bodyStrong">{readiness.headline}</Text>
            <View style={styles.chips}>
              {readiness.focusSkills.map((skill) => (
                <Chip key={skill} label={skill} tone="practised" />
              ))}
            </View>
            <View style={styles.link}>
              <Text variant="label">See my roadmap</Text>
              <Icon name="chevron-right" size={16} color={colors.text.primary} />
            </View>
          </View>
        </Card>

        {/* Today's challenge (Module 3) — the one strong CTA on this screen */}
        {todaysChallenge ? (
          <Card tone="butter" style={styles.challenge}>
            <View style={styles.rowBetween}>
              <Chip label="Today's challenge" tone="butter" />
              <View style={styles.timer}>
                <Icon name="clock" size={14} />
                <Text variant="caption">{todaysChallenge.minutes} min</Text>
              </View>
            </View>
            <View style={styles.challengeBody}>
              <View style={styles.challengeText}>
                <Text variant="heading">{todaysChallenge.title}</Text>
                <Text variant="caption">
                  {todaysChallenge.skill} · {todaysChallenge.passed} of {todaysChallenge.of} passed
                </Text>
              </View>
              <Mascot pose="idea" width={103} />
            </View>
            <Button label="Start challenge" block onPress={() => router.push("/challenges")} />
          </Card>
        ) : null}

        {/* Micro-projects (Module 4) */}
        <SectionHeader title="Micro-projects for you" link="See all" onPressLink={openProjects} />
        {featured ? <FeaturedProjectCard project={featured} onPress={openProjects} /> : null}
        {others.map((project) =>
          project.lockedBy ? (
            <LockedProjectRow key={project.id} project={project} onPress={openProjects} />
          ) : (
            <MicroProjectRow key={project.id} project={project} onPress={openProjects} />
          ),
        )}

        {/* Passport snapshot (Module 5) */}
        <SectionHeader title="Your passport" />
        <Card onPress={() => router.push("/passport")} style={styles.row}>
          <IconBadge icon="id-card" tone="green" />
          <View style={styles.rowText}>
            <Text variant="heading">Skill Passport</Text>
            <View style={styles.chips}>
              <StatusBadge status="verified" label={`${passport.verified} Verified`} />
              <StatusBadge status="practised" label={`${passport.practised} Practised`} />
            </View>
          </View>
          <Icon name="chevron-right" size={20} />
        </Card>
      </View>
    </Screen>
  );
}

/** Shown when there is no signed-in student yet (and TEST MODE is off). */
function HomeEmpty() {
  const insets = useSafeAreaInsets();
  return (
    <Screen>
      <View style={styles.hero}>
        <SkyBackdrop height={HERO} />
        <MascotShadow width={88} style={styles.mascotShadow} />
        <Mascot pose="question" width={142} style={styles.mascot} />
        <View style={[styles.header, { top: insets.top + 13 }]}>
          <Text variant="title">Nothing here yet</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Card>
          <Text variant="heading">Home fills up once you log in</Text>
          <Text variant="small" color="secondary" style={styles.emptyBody}>
            Auth, profiles and skills arrive with the shared core (weeks 6–7). To preview with demo data, set
            EXPO_PUBLIC_TEST_MODE=1 in apps/mobile/.env and restart the dev server.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { height: HERO, marginBottom: -(layout.skyLip + layout.heroOverlap) },
  header: { position: "absolute", left: layout.gutter, right: layout.gutter, flexDirection: "row", alignItems: "center", gap: space.md },
  greeting: { flex: 1, gap: 2 },
  mascot: { position: "absolute", right: 20, top: 106 },
  mascotShadow: { position: "absolute", right: 47, top: 229 },
  bubble: { position: "absolute", left: layout.gutter, top: 140 },
  content: { paddingHorizontal: layout.gutter, gap: 14 },
  readiness: { flexDirection: "row", alignItems: "center", gap: 14 },
  readinessText: { flex: 1, gap: 6 },
  chips: { flexDirection: "row", gap: 6 },
  link: { flexDirection: "row", alignItems: "center", gap: space.xs },
  challenge: { gap: space.md },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    paddingHorizontal: 10,
    paddingVertical: space.xs,
    borderRadius: 999,
    backgroundColor: colors.bg.surface,
  },
  challengeBody: { flexDirection: "row", alignItems: "center", gap: space.md },
  challengeText: { flex: 1, gap: 6 },
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  rowText: { flex: 1, gap: 6 },
  emptyBody: { marginTop: space.xs },
});
