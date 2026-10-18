import { colors, gap, layout, space } from "@skillproof/tokens";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { KINDS } from "../../components/challenges/ChallengeRow";
import { CheckList } from "../../components/challenges/CheckList";
import { ResultCelebration } from "../../components/challenges/ResultCelebration";
import {
  Button,
  Card,
  Chip,
  EmptyState,
  Hero,
  Icon,
  ProgressDots,
  Screen,
  SectionHeader,
  SkillLogo,
  StatusBadge,
  Text,
  TopBar,
  useToast,
} from "../../components/ui";
import { getChallengeResult, toPractisedLabel, type ChallengeResult } from "../../lib/challenges";
import { isTestMode } from "../../lib/testMode";

const LOGO = 24; // the skill's logo in the progress card
const ICON = 20; // card heading icons (unlock, hint, AI)

/**
 * Result (Module 3, reference screen) — two beats. A fresh pass opens on its celebration
 * (ResultCelebration), then the details: the score against the pass mark, what it means for the
 * skill, a project it opened, every test / check / rubric line, and a hint or the AI's feedback.
 * A miss or a past attempt opens straight on the details. `?id=<challenge>&fresh=1`
 */
export default function ResultScreen() {
  const router = useRouter();
  const toast = useToast();
  const { id, fresh } = useLocalSearchParams<{ id?: string; fresh?: string }>();
  const result = id ? getChallengeResult(id) : null;
  const [celebrating, setCelebrating] = useState(fresh === "1" && !!result?.passed);

  const backToChallenges = () => router.dismissTo("/challenges");
  if (!result) return <NoResult onBack={backToChallenges} />;
  if (celebrating) return <ResultCelebration result={result} onContinue={() => setCelebrating(false)} />;

  const kind = KINDS[result.kind];
  const { progress, unlocked, feedback } = result;
  // TODO (Module 4): open the project itself, not the Projects tab
  const openProject = () => router.navigate("/projects");
  // TODO (Module 3, weeks 7–11): open the challenge again
  const tryAgain = () => toast({ message: "Challenge screens arrive with Module 3 (weeks 7–11)", tone: "info" });

  return (
    <Screen aboveTabBar={false}>
      <Hero size="compact">
        <TopBar title="Result" onBack={backToChallenges} />
        <View style={styles.summary}>
          <Text variant="heading">{result.title}</Text>
          <View style={styles.score}>
            <Text variant="display">{`${result.score}%`}</Text>
            <View>
              <Text variant="bodyStrong">{result.passed ? "Passed" : "Not passed yet"}</Text>
              <Text variant="small" color="secondary">
                Pass mark {result.passMark}%
              </Text>
            </View>
          </View>
        </View>
      </Hero>

      <View style={styles.content}>
        {/* what this attempt means for the skill */}
        <Card>
          <View style={styles.row}>
            <SkillLogo skill={progress.skill} size={LOGO} />
            <Text variant="subheading" style={styles.flex}>
              {progress.skill}
            </Text>
            {result.nowPractised ? <StatusBadge status="practised" /> : <ProgressDots done={progress.passed} of={progress.of} />}
          </View>
          <Text variant="small" color="secondary" style={styles.sub}>
            {result.nowPractised
              ? `${progress.of} of ${progress.of} passed. Practised now: your readiness goes up.`
              : `${progress.passed} of ${progress.of} passed · ${toPractisedLabel(progress)}`}
          </Text>
        </Card>

        {unlocked ? (
          <Card tone="blue">
            <View style={styles.row}>
              <Icon name="unlock" size={ICON} weight="fill" color={colors.status.practised.fg} />
              <Text variant="bodyStrong" style={styles.flex}>
                {unlocked.title} is open
              </Text>
            </View>
            <Text variant="small" color="secondary" style={styles.sub}>
              Every skill it needs is Practised, so you can apply now.
            </Text>
          </Card>
        ) : null}

        <SectionHeader title={kind.checks} />
        <CheckList checks={result.checks} />
        {feedback ? <FeedbackCard feedback={feedback} /> : null}

        {/* one strong button: apply to what opened · try a miss again · or back to the list */}
        <View style={styles.actions}>
          {unlocked ? (
            <Button label="View project" icon="briefcase" block onPress={openProject} />
          ) : !result.passed ? (
            <Button label="Try again" icon="retry" block onPress={tryAgain} />
          ) : null}
          <Button label="Back to challenges" variant={unlocked || !result.passed ? "secondary" : "primary"} block onPress={backToChallenges} />
        </View>
      </View>
    </Screen>
  );
}

/** A hint after a miss, or the AI's feedback on an Explain it answer — always labelled as AI. */
function FeedbackCard({ feedback }: { feedback: NonNullable<ChallengeResult["feedback"]> }) {
  const ai = feedback.kind === "ai";
  return (
    <Card>
      <View style={styles.row}>
        <Icon name={ai ? "ai" : "hint"} size={ICON} color={colors.icon.default} />
        <Text variant="bodyStrong" style={styles.flex}>
          {ai ? "AI feedback" : "Hint"}
        </Text>
        {/* rule 4: a mocked AI grade never looks real */}
        {ai && isTestMode ? <Chip label="Demo grade" tone="butter" /> : null}
      </View>
      <Text variant="body" style={styles.sub}>
        {feedback.text}
      </Text>
      {ai ? (
        <Text variant="caption" color="secondary" style={styles.sub}>
          Graded by AI against our rubric.
        </Text>
      ) : null}
    </Card>
  );
}

function NoResult({ onBack }: { onBack: () => void }) {
  return (
    <Screen aboveTabBar={false}>
      <Hero size="compact">
        <TopBar title="Result" onBack={onBack} />
      </Hero>
      <View style={styles.content}>
        <Card>
          <EmptyState
            title="No result yet"
            body="Finish this challenge to see your score and every test here."
            action={{ label: "Back to challenges", onPress: onBack }}
          />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { gap: space.xs, marginTop: space.lg },
  score: { flexDirection: "row", alignItems: "center", gap: space.md },
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  row: { flexDirection: "row", alignItems: "center", gap: space.sm },
  flex: { flex: 1 },
  sub: { marginTop: space.xs },
  actions: { gap: space.sm, marginTop: space.sm },
});
