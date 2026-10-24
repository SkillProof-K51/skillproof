import { space } from "@skillproof/tokens";
import { StyleSheet, View } from "react-native";

import { Button } from "./Button";
import type { IconName } from "./Icon";
import { IconBadge } from "./IconBadge";
import { Text } from "./Text";

type Props = {
  /** A grey circle with an icon above the title, saying what will live here (e.g. "id-card"). */
  icon?: IconName;
  title: string;
  /** Say what will fill this space and how — not just "nothing here". */
  body?: string;
  /** The way forward. Primary only if it's the screen's one strong button. */
  action?: { label: string; onPress: () => void; variant?: "primary" | "secondary" };
};

/** Nothing to show yet: an icon, a line that explains, and the way forward. */
export function EmptyState({ icon, title, body, action }: Props) {
  return (
    <View style={styles.wrap}>
      {icon ? <IconBadge icon={icon} tone="grey" shape="circle" /> : null}
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
