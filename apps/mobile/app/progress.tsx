import { gap, layout, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";

import { PracticeCard } from "../components/progress/PracticeCard";
import { ReadinessTrendCard } from "../components/progress/ReadinessTrendCard";
import { Card, Divider, EmptyState, Hero, ListRow, Screen, SectionHeader, SkillLogo, StatusBadge, Text, TopBar } from "../components/ui";
import { getProgressData } from "../lib/progress";

const LOGO = 24;
const SLOT = LOGO * 2 + space.xxs; // room for a combined skill's two logos, so the rows line up
const INSET = SLOT + space.md;

/**
 * Progress (reference screen; BitePal's Statistics, Azim's theme mockup 24 Oct), opened from "See
 * all" on Home's progress card: the week's challenges by kind (Module 3's practice report),
 * readiness over the week (Module 2's fit engine), then every roadmap skill with what proves it.
 */
export default function ProgressScreen() {
  const router = useRouter();
  const data = getProgressData();

  return (
    <Screen aboveTabBar={false}>
      <Hero>
        <TopBar />
        <View style={styles.heading}>
          <Text variant="title" accessibilityRole="header">
            Progress
          </Text>
          {data ? (
            <Text variant="small" color="secondary">
              This week · {data.week}
            </Text>
          ) : null}
        </View>
      </Hero>

      <View style={styles.content}>
        {data ? (
          <>
            <PracticeCard practice={data.practice} />
            <ReadinessTrendCard readiness={data.readiness} />
            <SectionHeader title="Your roadmap" />
            <Card style={styles.list}>
              {data.roadmap.map((s, i) => (
                <Fragment key={s.skill}>
                  {i ? <Divider inset={INSET} /> : null}
                  <ListRow
                    title={s.skill}
                    subtitle={s.detail}
                    leading={
                      <View style={styles.slot}>
                        <SkillLogo skill={s.skill} size={LOGO} />
                      </View>
                    }
                    trailing={<StatusBadge status={s.status} />}
                  />
                </Fragment>
              ))}
            </Card>
          </>
        ) : (
          <Card>
            <EmptyState
              icon="chart"
              title="Your progress shows here"
              body="Once you've done a few challenges, this week's practice and your readiness appear here."
              action={{ label: "Go to challenges", variant: "primary", onPress: () => router.navigate("/challenges") }}
            />
          </Card>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: space.xxs, marginTop: space.lg },
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  list: { paddingVertical: space.xs },
  slot: { width: SLOT, alignItems: "center" },
});
