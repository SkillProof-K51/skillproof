import { colors, space } from "@skillproof/tokens";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { isBugLine, type WarmUp } from "../../lib/onboarding";
import { Card, CodeBlock, Icon, Text } from "../ui";

const ICON = 20;

type Props = {
  warmUp: WarmUp;
  /** Called once, when the student taps the right line. */
  onSolved: () => void;
};

/**
 * Onboarding's 30-second warm-up (Azim, 25 Oct): a few lines with one bug, and the student taps the
 * broken line. Right → it lights green and says why; wrong → red, look again. Graded in lib/.
 */
export function WarmUpCard({ warmUp, onSolved }: Props) {
  const [marks, setMarks] = useState<Record<number, "right" | "wrong">>({});
  const solved = Object.values(marks).includes("right");
  const missed = !solved && Object.keys(marks).length > 0;

  const tap = (line: number) => {
    if (solved) return;
    const right = isBugLine(warmUp, line);
    setMarks((m) => ({ ...m, [line]: right ? "right" : "wrong" }));
    if (right) onSolved();
  };

  return (
    <Card>
      <CodeBlock
        lines={warmUp.lines}
        language={warmUp.language}
        onPressLine={tap}
        marks={marks}
        accessibilityLabel="Code with one bug. Tap the line with the bug."
      />
      <View style={styles.feedback} accessibilityLiveRegion="polite">
        {solved ? (
          <>
            <Icon name="check-circle" weight="fill" size={ICON} color={colors.feedback.success.fg} />
            <Text variant="body" style={styles.flex}>
              <Text variant="bodyStrong">Found it! </Text>
              {warmUp.why}
            </Text>
          </>
        ) : missed ? (
          <>
            <Icon name="x-circle" weight="fill" size={ICON} color={colors.feedback.error.fg} />
            <Text variant="body" style={styles.flex}>
              Not that one. Look again.
            </Text>
          </>
        ) : (
          <Text variant="body" color="secondary">
            Tap the line you think is wrong.
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  feedback: { flexDirection: "row", alignItems: "flex-start", gap: space.sm, marginTop: space.md },
  flex: { flex: 1 },
});
