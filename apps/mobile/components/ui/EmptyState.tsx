import { space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { Button } from "./Button";
import { GroundedMascot } from "./GroundedMascot";
import type { MascotPose } from "./Mascot";
import { Text } from "./Text";

const MASCOT_WIDTH = 120;

type Props = {
  /** Leave out on task screens (no mascot there, docs/ui.md). */
  mascot?: MascotPose;
  title: string;
  /** Say what will fill this space and how — not just "nothing here". */
  body?: string;
  /** The way forward. Primary only if it's the screen's one strong button. */
  action?: { label: string; onPress: () => void; variant?: "primary" | "secondary" };
};

/** Nothing to show yet: a mascot, a line that explains, and the way forward. */
export function EmptyState({ mascot, title, body, action }: Props) {
  return (
    <View style={styles.wrap}>
      {mascot ? <GroundedMascot pose={mascot} width={MASCOT_WIDTH} /> : null}
      <Text variant="heading" align="center">
        {title}
      </Text>
      {body ? (
        <Text variant="small" color="secondary" align="center">
          {body}
        </Text>
      ) : null}
      {action ? <Button label={action.label} variant={action.variant ?? "secondary"} onPress={action.onPress} style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: space.sm, paddingVertical: space.xl, paddingHorizontal: space.lg },
  action: { marginTop: space.sm },
});
