import { colors, gap, layout, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ProjectCard } from "../../components/home/ProjectCard";
import { TodaysChallengeCard } from "../../components/home/TodaysChallengeCard";
import {
  Avatar,
  Card,
  Carousel,
  Chip,
  Hero,
  Icon,
  IconBadge,
  ProgressRing,
  Screen,
  SectionHeader,
  StatusBadge,
  Text,
} from "../../components/ui";
import { getHomeData, greetingFor } from "../../lib/home";

const HERO = 300; // Home stretches the Tall sky to 300 (Figma)
// The slider: the top open matches, then the next locked one as a goal. Everything else → "See all".
const SLIDER_OPEN = 3;
const SLIDER_LOCKED = 1;

export default function HomeScreen() {
  const router = useRouter();
  const data = getHomeData();

  if (!data) return <HomeEmpty />;
  const { student, readiness, todaysChallenge, microProjects, passport } = data;
  // The list arrives ranked by the fit engine; Home only picks what goes in the slider.
  const slider = [
    ...microProjects.filter((p) => !p.lockedBy).slice(0, SLIDER_OPEN),
    ...microProjects.filter((p) => p.lockedBy).slice(0, SLIDER_LOCKED),
  ];
  const openProjects = () => router.push("/projects");
  const openChallenges = () => router.push("/challenges");

  return (
    <Screen>
      <Hero height={HERO} mascot="wave" bubble={data.bubble}>
        <View style={styles.header}>
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
      </Hero>

      <View style={styles.content}>
        {/* Readiness (Module 2 computes it; Home only displays) */}
        <Card style={styles.readiness}>
          <ProgressRing percent={readiness.percent} />
          <View style={styles.stack}>
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
        {todaysChallenge ? <TodaysChallengeCard challenge={todaysChallenge} onPress={openChallenges} /> : null}

        {/* Micro-projects (Module 4) */}
        {slider.length ? (
          <>
            <SectionHeader title="Micro-projects for you" link="See all" onPressLink={openProjects} />
            <Carousel
              items={slider}
              keyExtractor={(p) => p.id}
              accessibilityLabel="Micro-projects for you, swipe for more"
              renderItem={(project, i) => (
                <ProjectCard
                  project={project}
                  eyebrow={i === 0 ? "Best match" : "Good fit"}
                  onView={openProjects}
                  onPractise={openChallenges}
                  style={styles.fill}
                />
              )}
            />
          </>
        ) : null}

        {/* Passport snapshot (Module 5) */}
        <SectionHeader title="Your passport" />
        <Card onPress={() => router.push("/passport")} style={styles.row}>
          <IconBadge icon="id-card" tone="green" />
          <View style={styles.stack}>
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
  return (
    <Screen>
      <Hero height={HERO} mascot="question">
        <Text variant="title">Nothing here yet</Text>
      </Hero>
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
  header: { flexDirection: "row", alignItems: "center", gap: space.md },
  greeting: { flex: 1, gap: space.xxs },
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  readiness: { flexDirection: "row", alignItems: "center", gap: gap.loose },
  stack: { flex: 1, gap: gap.tight },
  chips: { flexDirection: "row", gap: gap.tight },
  link: { flexDirection: "row", alignItems: "center", gap: space.xs },
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  fill: { flexGrow: 1 },
  emptyBody: { marginTop: space.xs },
});
