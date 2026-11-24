import { opacity, space } from "@skillproof/tokens";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import type { HomeData } from "../../lib/home";
import { Card, Icon, ProgressRing, Text } from "../ui";
import { ReadinessSheet } from "./ReadinessSheet";

const ARROW = 14;
const RING = 72; // the readiness ring (Azim's pick, 29 Oct: "R")

type Props = {
  readiness: HomeData["readiness"];
  /** The role's roadmap title, e.g. "Web Developer path". */
  pathLabel: string;
  /** The Progress screen, with every roadmap skill (from the sheet's "See your progress"). */
  onPressRoadmap: () => void;
  onPressNext: () => void;
};

/**
 * Home's progress card (Azim, 29 Oct: the ring + sheet): the path and "See all", what's up next
 * with the skill counts, and Readiness as a ring — the same ring as Profile's target-role card. The
 * ring and See all open ReadinessSheet: every skill, its status and how much it counts. Readiness and
 * the ready line come from the Module 2 fit engine; this only shows them.
 */
export function ReadinessCard({ readiness, pathLabel, onPressRoadmap, onPressNext }: Props) {
  const [open, setOpen] = useState(false);
  const { skills, percent, readyAt } = readiness;
  const verified = skills.filter((s) => s.status === "verified").length;
  const practised = skills.filter((s) => s.status === "practised").length;
  const toGo = skills.length - verified - practised;
  // Up next: the first skill not yet practised, else the first one still waiting for a mentor.
  const toPractise = skills.find((s) => s.status === "not_yet");
  const toVerify = skills.find((s) => s.status === "practised");
  const next = toPractise ? `Practise ${toPractise.name}` : toVerify ? `Verify ${toVerify.name}` : null;

  return (
    <>
      <Card>
        <View style={styles.row}>
          <Text variant="heading" style={styles.flex}>
            {pathLabel}
          </Text>
          <Pressable onPress={() => setOpen(true)} accessibilityRole="button" hitSlop={8} style={styles.link}>
            <Text variant="label" color="secondary">
              See all
            </Text>
            <Icon name="arrow-right" size={ARROW} />
          </Pressable>
        </View>

        <View style={[styles.row, styles.body]}>
          <View style={[styles.flex, styles.words]}>
            <View>
              <Text variant="overline" color="secondary">
                Up next
              </Text>
              {next ? (
                <Pressable onPress={onPressNext} accessibilityRole="button" hitSlop={8} style={styles.link}>
                  <Text variant="subheading" numberOfLines={1}>
                    {next}
                  </Text>
                  <Icon name="arrow-right" size={ARROW} />
                </Pressable>
              ) : (
                <Text variant="subheading">Every skill is Verified</Text>
              )}
            </View>
            <Text variant="caption" color="secondary">
              {verified} Verified · {practised} Practised · {toGo} to go · ready at {readyAt}%
            </Text>
          </View>
          <Pressable
            onPress={() => setOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={`${percent}% ready, ready at ${readyAt}%. Shows your skills.`}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <ProgressRing percent={percent} size={RING} />
          </Pressable>
        </View>
      </Card>

      <ReadinessSheet
        visible={open}
        onClose={() => setOpen(false)}
        readiness={readiness}
        pathLabel={pathLabel}
        onPressRoadmap={onPressRoadmap}
      />
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  flex: { flex: 1 },
  link: { flexDirection: "row", alignItems: "center", gap: space.xs, alignSelf: "flex-start" },
  body: { marginTop: space.lg },
  words: { gap: space.sm },
  pressed: { opacity: opacity.pressed },
});
