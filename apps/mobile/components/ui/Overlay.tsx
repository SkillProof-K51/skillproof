import { colors } from "@skillproof/tokens";
import { useEffect, useState, type ReactNode } from "react";
import { Animated, Easing, Modal, Pressable, StyleSheet } from "react-native";

import { NATIVE_DRIVER, useDuration } from "./motion";

type Props = {
  visible: boolean;
  /** Tapping the scrim or the system back gesture. */
  onClose: () => void;
  /** Where the content sits over the scrim. */
  align: "bottom" | "center";
  /** The content, given the open progress (0 → 1) to animate with. */
  children: (progress: Animated.Value) => ReactNode;
};

/**
 * Shared by BottomSheet and Dialog: a modal with a slate scrim that fades in, stays mounted while
 * the close animation plays, and closes on scrim tap or back gesture. Durations come from the
 * motion tokens and drop to 0 under Reduce Motion.
 */
export function Overlay({ visible, onClose, align, children }: Props) {
  const openMs = useDuration("standard");
  const closeMs = useDuration("quick");
  const [progress] = useState(() => new Animated.Value(0)); // lazy state, not a ref: stable and compiler-safe
  const [mounted, setMounted] = useState(visible);
  // opening mounts at once (set during render — React's "adjust state on prop change" pattern);
  // closing unmounts only when the close animation has finished
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (visible) {
      Animated.timing(progress, { toValue: 1, duration: openMs, easing: Easing.out(Easing.cubic), useNativeDriver: NATIVE_DRIVER }).start();
    } else {
      Animated.timing(progress, { toValue: 0, duration: closeMs, easing: Easing.in(Easing.cubic), useNativeDriver: NATIVE_DRIVER }).start(
        ({ finished }) => finished && setMounted(false),
      );
    }
  }, [visible, progress, openMs, closeMs]);

  if (!mounted) return null;
  return (
    <Modal transparent visible animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, { opacity: progress }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" />
      </Animated.View>
      <Animated.View style={[styles.layer, align === "center" ? styles.center : styles.bottom]} pointerEvents="box-none">
        {children(progress)}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { backgroundColor: colors.overlay.scrim },
  layer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  center: { justifyContent: "center" },
  bottom: { justifyContent: "flex-end" },
});
