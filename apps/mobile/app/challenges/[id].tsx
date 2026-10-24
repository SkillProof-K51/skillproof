import { colors, gap, layout, space } from "@skillproof/tokens";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { BestCard } from "../../components/challenges/BestCard";
import { KINDS } from "../../components/challenges/ChallengeRow";
import { Button, Card, CodeBlock, EmptyState, Hero, Icon, Screen, Text, TopBar, useToast } from "../../components/ui";
import { getChallengeDetail, getChallengeResult } from "../../lib/challenges";

const CIRCLE = 168; // the kind's icon on a white circle: the page's picture
const KIND_ICON = 80;

/**
 * A challenge's own page (Module 3, reference screen), before the student starts: its kind's pastel
 * fading down the page (BitePal's detail pages; Azim picked a colour per kind, 25 Oct), the kind's icon big on a white circle,
 * the best score so far and the skill's passes, the task with its code, then Start pinned at the
 * bottom. `/challenges/<id>`
 */
export default function ChallengeScreen() {
  const router = useRouter();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const challenge = id ? getChallengeDetail(id) : null;
  if (!challenge) return <NoChallenge />;

  const kind = KINDS[challenge.kind];
  const openResult = (fresh: boolean) =>
    router.push({ pathname: "/challenges/result", params: fresh ? { id: challenge.id, fresh: "1" } : { id: challenge.id } });
  // TODO (Module 3, weeks 7–11): open the challenge itself (code editor, SQL runner, answer box).
  // TEST MODE skips it and shows a graded attempt, as if just finished.
  const start = () =>
    getChallengeResult(challenge.id)
      ? openResult(true)
      : toast({ message: "Challenge screens arrive with Module 3 (weeks 7–11)", tone: "info" });

  return (
    <Screen
      aboveTabBar={false}
      tint={kind.colours.page}
      footer={
        <View style={styles.actions}>
          {challenge.best ? <Button label="Your result" variant="secondary" onPress={() => openResult(false)} style={styles.flex} /> : null}
          <Button label={challenge.best ? "Try again" : "Start challenge"} icon={challenge.best ? "retry" : "play"} onPress={start} style={styles.flex} />
        </View>
      }
    >
      <Hero>
        <TopBar title={kind.label} subtitle={`${challenge.skill} · about ${challenge.minutes} min`} />
        <View style={styles.circle} accessible={false}>
          <Icon name={kind.icon} weight="duotone" size={KIND_ICON} color={kind.colours.ink} />
        </View>
      </Hero>

      <View style={styles.content}>
        <BestCard best={challenge.best} progress={challenge.progress} />
        <Card>
          <Text variant="label" color="secondary">
            The task
          </Text>
          <Text variant="heading" style={styles.title}>
            {challenge.title}
          </Text>
          <Text variant="body" color="secondary">
            {challenge.task}
          </Text>
          <CodeBlock
            lines={challenge.preview}
            language={challenge.kind === "sql_live" ? "sql" : "javascript"}
            accessibilityLabel={challenge.kind === "sql_live" ? "The tables and the start of the query" : "The code"}
            style={styles.code}
          />
        </Card>
      </View>
    </Screen>
  );
}

function NoChallenge() {
  const router = useRouter();
  const back = () => router.dismissTo("/challenges");
  return (
    <Screen aboveTabBar={false}>
      <Hero>
        <TopBar title="Challenge" onBack={back} />
      </Hero>
      <View style={styles.content}>
        <Card>
          <EmptyState title="This challenge isn’t here" body="It may have been removed. Pick another one from Challenges." action={{ label: "Back to challenges", onPress: back }} />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignSelf: "center",
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: colors.bg.surface,
    alignItems: "center",
    justifyContent: "center",
    marginTop: space.lg,
  },
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  title: { marginTop: space.xxs, marginBottom: space.xs },
  code: { marginTop: space.md },
  actions: { flexDirection: "row", gap: space.sm },
  flex: { flex: 1 },
});
