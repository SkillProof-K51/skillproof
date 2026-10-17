import { colors, layout, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FeaturedProjectCard } from "../../components/home/FeaturedProjectCard";
import { LockedProjectRow } from "../../components/home/LockedProjectRow";
import { MicroProjectRow } from "../../components/home/MicroProjectRow";
import { TodaysChallengeCard } from "../../components/home/TodaysChallengeCard";
import {
  Avatar,
  Card,
  Carousel,
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
const TOP_MATCHES = 3; // micro-projects in the carousel

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const data = getHomeData();

  if (!data) return <HomeEmpty />;
  const { student, readiness, todaysChallenge, microProjects, passport } = data;
  // The list arrives ranked: the top 3 open projects go in the carousel, the rest follow as rows.
  const topMatches = microProjects.filter((p) => !p.lockedBy).slice(0, TOP_MATCHES);
  const others = microProjects.filter((p) => !topMatches.includes(p));
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
          <Avatar initials={student.initials} tone="surface" />
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

        {/* Today's challenge (Module 3) — the one strong CTA on this screen while it is to do */}
        {todaysChallenge ? (
          <TodaysChallengeCard challenge={todaysChallenge} onPress={() => router.push("/challenges")} />
        ) : null}

        {/* Micro-projects (Module 4) */}
        <SectionHeader title="Micro-projects for you" link="See all" onPressLink={openProjects} />
        <Carousel
          items={topMatches}
          keyExtractor={(p) => p.id}
          accessibilityLabel="Top micro-project matches, swipe for more"
          renderItem={(project, i) => (
            <FeaturedProjectCard
              project={project}
              eyebrow={i === 0 ? "Best match" : "Good fit"}
              onPress={openProjects}
              style={styles.fill}
            />
          )}
        />
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
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  rowText: { flex: 1, gap: 6 },
  fill: { flexGrow: 1 },
  emptyBody: { marginTop: space.xs },
});
