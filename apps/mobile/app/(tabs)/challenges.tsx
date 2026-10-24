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
} from "../../components/ui";
import { getChallengesData, toPractisedLabel, type ChallengeKind } from "../../lib/challenges";

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
  const [filter, setFilter] = useState<Filter>("all");
  const data = getChallengesData();

  if (!data) return <ModulePlaceholder title="Challenges" module="Module 3" owner="Azim" pose="laptop" />;
  const { passesToPractise, today, inProgress, challenges } = data;
  const shown = filter === "all" ? challenges : challenges.filter((c) => c.kind === filter);

  // a challenge opens on its own page (Start is there); today's, once done, opens its result
  const openChallenge = (id: string) => router.push({ pathname: "/challenges/[id]", params: { id } });
  const openResult = (id: string) => router.push({ pathname: "/challenges/result", params: { id } });

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
            <TodayCard challenge={today} onPress={() => (today.done ? openResult(today.id) : openChallenge(today.id))} />
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
                <ChallengeRow challenge={c} onPress={() => openChallenge(c.id)} />
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
