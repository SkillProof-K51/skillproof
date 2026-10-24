import { gap, layout, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { Fragment, useState } from "react";
import { StyleSheet, View } from "react-native";

import { ChallengeRow, KINDS } from "../../components/challenges/ChallengeRow";
import { TodayCard } from "../../components/challenges/TodayCard";
import { ModulePlaceholder } from "../../components/ModulePlaceholder";
import {
  Card,
  Divider,
  EmptyState,
  Hero,
  ICON_BADGE_SIZE,
  ListRow,
  ProgressDots,
  Screen,
  SectionHeader,
  SegmentedControl,
  SkillLogo,
  Text,
  useToast,
} from "../../components/ui";
import { getChallengesData, toPractisedLabel, type Challenge, type ChallengeKind } from "../../lib/challenges";

const LOGO = 24; // skill logo in the progress rows
const LOGO_INSET = LOGO + space.md; // logo + the row gap: dividers line up with the text
const BADGE_INSET = ICON_BADGE_SIZE + space.md;

type Filter = "all" | ChallengeKind;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  ...(Object.keys(KINDS) as ChallengeKind[]).map((k) => ({ value: k, label: KINDS[k].label })),
];

/**
 * Challenges (Module 3 home, reference screen): today's challenge (the one strong CTA), the skills
 * on their way to Practised, then every other challenge, filtered by kind.
 */
export default function ChallengesScreen() {
  const router = useRouter();
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const data = getChallengesData();

  if (!data) return <ModulePlaceholder title="Challenges" module="Module 3" owner="Azim" pose="laptop" />;
  const { passesToPractise, today, inProgress, challenges } = data;
  const shown = filter === "all" ? challenges : challenges.filter((c) => c.kind === filter);

  // fresh = straight after an attempt: the result opens on its celebration (passed) first
  const openResult = (id: string, fresh = false) =>
    router.push({ pathname: "/challenges/result", params: fresh ? { id, fresh: "1" } : { id } });
  // TODO (Module 3, weeks 7–11): open the challenge itself; it routes to its result once graded.
  const openChallenge = (c: Challenge) =>
    c.best ? openResult(c.id) : toast({ message: "Challenge screens arrive with Module 3 (weeks 7–11)", tone: "info" });

  return (
    <Screen>
      <Hero plain>
        <View style={styles.heading}>
          <Text variant="title">Challenges</Text>
          <Text variant="small" color="secondary">
            Pass {passesToPractise} in a skill to make it Practised
          </Text>
        </View>
      </Hero>

      <View style={styles.content}>
        {today ? (
          <>
            <SectionHeader title="Today’s challenge" />
            {/* TEST MODE skips the challenge screen (not built yet) and shows today's result, as if passed */}
            <TodayCard challenge={today} onPress={() => openResult(today.id, !today.done)} />
          </>
        ) : null}

        {inProgress.length ? (
          <>
            <SectionHeader title="On the way to Practised" />
            <Card style={styles.list}>
              {inProgress.map((s, i) => (
                <Fragment key={s.skill}>
                  {i ? <Divider inset={LOGO_INSET} /> : null}
                  <ListRow
                    title={s.skill}
                    subtitle={toPractisedLabel(s)}
                    leading={<SkillLogo skill={s.skill} size={LOGO} />}
                    trailing={<ProgressDots done={s.passed} of={s.of} />}
                  />
                </Fragment>
              ))}
            </Card>
          </>
        ) : null}

        <SectionHeader title="More challenges" />
        <SegmentedControl accessibilityLabel="Filter challenges by kind" options={FILTERS} value={filter} onChange={setFilter} />
        <Card style={styles.list}>
          {shown.length ? (
            shown.map((c, i) => (
              <Fragment key={c.id}>
                {i ? <Divider inset={BADGE_INSET} /> : null}
                <ChallengeRow challenge={c} onPress={() => openChallenge(c)} />
              </Fragment>
            ))
          ) : (
            <EmptyState
              title={filter === "all" ? "No challenges yet" : `No ${KINDS[filter].label} challenges yet`}
              body="New ones arrive each week for the skills on your roadmap."
            />
          )}
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: space.xxs },
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  list: { paddingVertical: space.xs },
});
