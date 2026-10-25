import { colors, space, type } from "@skillproof/tokens";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";

import type { ChallengeResult } from "../../lib/challenges";
import { Card, Divider, Icon, Text } from "../ui";

const ICON = 20;
const ICON_DROP = (type.body.lineHeight - ICON) / 2; // centres the icon on the first line of text
const TEXT_INSET = ICON + space.md; // dividers line up with the text, not the icon

type Props = { checks: ChallengeResult["checks"] };

/**
 * The graded parts of an attempt — tests, checks on a query's result, or rubric lines — each
 * passed (green tick) or missed (red cross, with what went wrong). Outcome colours: feedback.*,
 * never a skill status; the icon and the word carry the meaning, not the colour alone.
 */
export function CheckList({ checks }: Props) {
  return (
    <Card style={styles.card}>
      {checks.map((c, i) => {
        const tone = c.passed ? colors.feedback.success : colors.feedback.error;
        return (
          <Fragment key={c.label}>
            {i ? <Divider inset={TEXT_INSET} /> : null}
            <View style={styles.row} accessibilityLabel={`${c.passed ? "Passed" : "Missed"}: ${c.label}${c.detail ? `. ${c.detail}` : ""}`}>
              <View style={styles.icon}>
                <Icon name={c.passed ? "check-circle" : "x-circle"} size={ICON} weight="fill" color={tone.fg} />
              </View>
              <View style={styles.text}>
                <Text variant="body">{c.label}</Text>
                {c.detail ? (
                  <Text variant="small" color={tone.fg}>
                    {c.detail}
                  </Text>
                ) : null}
              </View>
            </View>
          </Fragment>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: space.xs },
  row: { flexDirection: "row", alignItems: "flex-start", gap: space.md, paddingVertical: space.md },
  icon: { marginTop: ICON_DROP },
  text: { flex: 1, gap: space.xxs },
});
