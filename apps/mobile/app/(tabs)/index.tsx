import { gap, layout, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ProjectCard } from "../../components/home/ProjectCard";
import { ReadinessHero } from "../../components/home/ReadinessHero";
import { TodayCard } from "../../components/home/TodayCard";
import {
  Avatar,
  Card,
  Carousel,
  Hero,
  Icon,
  IconBadge,
  Screen,
  SectionHeader,
  StatusBadge,
  Text,
} from "../../components/ui";
import { getHomeData, greetingFor } from "../../lib/home";

// The slider: the top open matches, then the next locked one as a goal. Everything else → "See all".
const SLIDER_OPEN = 3;
const SLIDER_LOCKED = 1;

/**
 * Home (Azim, 18 Oct): the goal is the hero — readiness for the target role and the skills still
 * missing — then today's challenge (the one strong CTA), micro-projects, passport.
 */
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
      <Hero>
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
        <ReadinessHero readiness={readiness} onPressRoadmap={() => router.push("/profile")} />
      </Hero>

      <View style={styles.content}>
        {/* Today's challenge (Module 3) — the one strong CTA on this screen while it is to do */}
        {todaysChallenge ? <TodayCard challenge={todaysChallenge} onPress={openChallenges} /> : null}

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
      <Hero mascot="question">
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
  stack: { flex: 1, gap: gap.tight },
  chips: { flexDirection: "row", gap: gap.tight },
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  fill: { flexGrow: 1 },
  emptyBody: { marginTop: space.xs },
});
