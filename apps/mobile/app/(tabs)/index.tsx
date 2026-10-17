import { gap, layout, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ProjectCard } from "../../components/home/ProjectCard";
import {
  Avatar,
  Button,
  Card,
  Carousel,
  Chip,
  GroundedMascot,
  Hero,
  Icon,
  IconBadge,
  ProgressBar,
  Screen,
  SectionHeader,
  SpeechBubble,
  StatusBadge,
  Text,
} from "../../components/ui";
import { getHomeData, greetingFor, type TodaysChallenge } from "../../lib/home";

const HERO_MASCOT_WIDTH = 120; // stands beside the challenge bubble
// The slider: the top open matches, then the next locked one as a goal. Everything else → "See all".
const SLIDER_OPEN = 3;
const SLIDER_LOCKED = 1;

/**
 * Home, "today-first" (Azim, 18 Oct): the hero IS today's challenge — the mascot says it in its
 * bubble and the one strong CTA sits on the sky. Readiness is a slim bar; projects and passport follow.
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
        {todaysChallenge ? <TodayInHero challenge={todaysChallenge} onPress={openChallenges} /> : null}
      </Hero>

      <View style={styles.content}>
        {/* Readiness (Module 2 computes it; Home only displays) */}
        <Card onPress={() => router.push("/profile")} style={styles.col}>
          <View style={styles.rowBetween}>
            <Text variant="label" color="secondary">
              {readiness.roleLabel}
            </Text>
            <Text variant="bodyStrong">{readiness.percent}%</Text>
          </View>
          <ProgressBar percent={readiness.percent} />
          <View style={styles.rowBetween}>
            <Text variant="caption" color="secondary">
              {readiness.headline}
            </Text>
            <View style={styles.link}>
              <Text variant="captionStrong">Roadmap</Text>
              <Icon name="chevron-right" size={14} />
            </View>
          </View>
        </Card>

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

/**
 * Today's challenge (Module 3) inside the hero: the mascot's bubble + the screen's one strong CTA.
 * Done → happy mascot, "Done for today", a quiet "Practise more" so finishing feels like a win.
 */
function TodayInHero({ challenge, onPress }: { challenge: TodaysChallenge; onPress: () => void }) {
  const { done } = challenge;
  return (
    <>
      <View style={styles.today}>
        <SpeechBubble style={styles.bubble}>
          <View style={styles.col}>
            {done ? (
              <Chip label="Done for today" tone="verified" icon="check" />
            ) : (
              <Chip label={`Today · ${challenge.minutes} min`} tone="butter" icon="clock" />
            )}
            <Text variant="heading">{done ? "Nice work!" : challenge.title}</Text>
            <Text variant="caption" color="secondary">
              {done
                ? "A new challenge arrives tomorrow."
                : `${challenge.skill} · ${challenge.passed} of ${challenge.of} passed`}
            </Text>
          </View>
        </SpeechBubble>
        <GroundedMascot pose={done ? "happy" : "idea"} width={HERO_MASCOT_WIDTH} />
      </View>
      {done ? (
        <Button label="Practise more" variant="secondary" block onPress={onPress} />
      ) : (
        <Button label="Start challenge" block onPress={onPress} />
      )}
    </>
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
  today: { flexDirection: "row", alignItems: "flex-end", gap: space.md, marginTop: space.lg, marginBottom: space.lg },
  bubble: { flex: 1 },
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  col: { gap: gap.tight }, // a stack of lines
  stack: { flex: 1, gap: gap.tight }, // the same, filling a row
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  link: { flexDirection: "row", alignItems: "center", gap: space.xxs },
  chips: { flexDirection: "row", gap: gap.tight },
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  fill: { flexGrow: 1 },
  emptyBody: { marginTop: space.xs },
});
