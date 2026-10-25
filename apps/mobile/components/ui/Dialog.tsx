import { colors, layout, radius, space } from "@skillproof/tokens";
import { Animated, StyleSheet, View } from "react-native";

import { Button } from "./Button";
import { Overlay } from "./Overlay";
import { Text } from "./Text";

const SCALE_FROM = 0.96; // settles into place as it fades in

type Action = { label: string; onPress: () => void };

type Props = {
  visible: boolean;
  title: string;
  body?: string;
  /** The main button. `danger` = red, for things that can't be undone (remove, delete, withdraw). */
  confirm: Action & { variant?: "primary" | "danger" };
  /** The quiet second button. Without one, the scrim tap is the only way out. */
  cancel?: Action;
  /** Scrim tap / back gesture. Usually the same as cancel's onPress. */
  onClose: () => void;
};

/**
 * A yes/no moment that needs an answer before going on: submit for review, remove a skill,
 * withdraw an application. One question, one or two buttons.
 */
export function Dialog({ visible, title, body, confirm, cancel, onClose }: Props) {
  return (
    <Overlay visible={visible} onClose={onClose} align="center">
      {(progress) => (
        <Animated.View
          style={[styles.card, { opacity: progress, transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [SCALE_FROM, 1] }) }] }]}
          accessibilityViewIsModal
        >
          <Text variant="heading" align="center" accessibilityRole="header">
            {title}
          </Text>
          {body ? (
            <Text variant="small" color="secondary" align="center">
              {body}
            </Text>
          ) : null}
          <View style={styles.actions}>
            <Button label={confirm.label} variant={confirm.variant ?? "primary"} block onPress={confirm.onPress} />
            {cancel ? <Button label={cancel.label} variant="secondary" block onPress={cancel.onPress} /> : null}
          </View>
        </Animated.View>
      )}
    </Overlay>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: layout.gutter,
    padding: space.xl,
    gap: space.sm,
    borderRadius: radius.xl,
    backgroundColor: colors.bg.surface,
    alignItems: "stretch",
  },
  actions: { gap: space.sm, marginTop: space.md },
});
