import { gap, layout, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { PassportCard } from "../../components/home/PassportCard";
import { ProjectCard } from "../../components/home/ProjectCard";
import { ReadinessCard } from "../../components/home/ReadinessCard";
import { TodayCard } from "../../components/challenges/TodayCard";
import { UnlockCard } from "../../components/home/UnlockCard";
import {
  Avatar,
  Card,
  Carousel,
  Hero,
  Screen,
  SectionHeader,
  Text,
} from "../../components/ui";
import { getHomeData, greetingFor, nextUnlock } from "../../lib/home";

// Home's illustrated scene (ChatGPT image, Azim's account, 24 Oct — see docs/ai-use-log.md).
const SCENE = require("../../assets/scenes/campus-garden.jpg");

// The slider: the top open matches, then the next locked one as a goal. Everything else → "See all".
const SLIDER_OPEN = 3;
const SLIDER_LOCKED = 1;

/**
 * Home (BitePal-style, Azim 24 Oct): an illustrated scene with the greeting, then cards sliding up
 * over it — readiness for the target role first, then today's challenge (the one strong CTA),
 * micro-projects, passport.
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
  const unlock = nextUnlock(data);
  const openProjects = () => router.push("/projects");
  const openChallenges = () => router.push("/challenges");

  return (
    <Screen>
      <Hero scene={SCENE}>
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text variant="title">
              {greetingFor(new Date())}, {student.firstName}
            </Text>
          </View>
          <Avatar initials={student.initials} tone="surface" />
        </View>
      </Hero>

      <View style={styles.content}>
        <ReadinessCard
          readiness={readiness}
          pathLabel={student.pathLabel}
          onPressRoadmap={() => router.push("/profile")}
          onPressNext={openChallenges}
        />

        {/* Today's challenge (Module 3) — the one strong CTA on this screen while it is to do */}
        {todaysChallenge ? (
          <>
            <SectionHeader title="Today’s challenge" />
            <TodayCard
              challenge={todaysChallenge}
              onPress={() =>
                todaysChallenge.done ? openChallenges() : router.push({ pathname: "/challenges/[id]", params: { id: todaysChallenge.id } })
              }
            />
            {unlock ? (
              <UnlockCard
                challenge={todaysChallenge}
                projectTitle={unlock.project.title}
                remaining={unlock.remaining}
                onPress={openProjects}
              />
            ) : null}
          </>
        ) : null}

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
        <PassportCard passport={passport} onPress={() => router.push("/passport")} />
      </View>
    </Screen>
  );
}

/** Shown when there is no signed-in student yet (and TEST MODE is off). */
function HomeEmpty() {
  return (
    <Screen>
      <Hero>
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
  fill: { flexGrow: 1 },
  emptyBody: { marginTop: space.xs },
});
