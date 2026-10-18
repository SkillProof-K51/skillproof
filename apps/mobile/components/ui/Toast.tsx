import { colors, layout, motion, radius, shadow, space } from "@skillproof/tokens";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon, type IconName } from "./Icon";
import { NATIVE_DRIVER, useDuration } from "./motion";
import { Text } from "./Text";

const HIDE_Y = -160; // parked above the screen
const ICON = 20;

type Tone = "success" | "error" | "info";
export type ToastInput = { message: string; tone?: Tone };

const ICONS: Record<Tone, IconName> = { success: "check-circle", error: "x-circle", info: "info" };

const ToastContext = createContext<(toast: ToastInput) => void>(() => {});

/**
 * Shows a toast from anywhere: `const toast = useToast(); toast({ message: "Saved", tone: "success" })`.
 * Success and info toasts leave on their own; error toasts stay until tapped (rule 11: show save
 * and sync failures, never swallow them).
 */
export function useToast() {
  return useContext(ToastContext);
}

/** Wrap the app once (root layout). Renders the current toast at the top, over everything. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<(ToastInput & { id: number }) | null>(null);
  const counter = useRef(0);
  const show = useCallback((toast: ToastInput) => setCurrent({ ...toast, id: ++counter.current }), []);
  const value = useMemo(() => show, [show]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <View style={styles.layer} pointerEvents="box-none">
        {current ? <ToastView key={current.id} toast={current} onDone={() => setCurrent((c) => (c?.id === current.id ? null : c))} /> : null}
      </View>
    </ToastContext.Provider>
  );
}

function ToastView({ toast, onDone }: { toast: ToastInput; onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const inMs = useDuration("standard");
  const outMs = useDuration("quick");
  const [y] = useState(() => new Animated.Value(HIDE_Y));
  const tone = toast.tone ?? "info";
  const t = colors.feedback[tone];

  const dismiss = useCallback(() => {
    Animated.timing(y, { toValue: HIDE_Y, duration: outMs, easing: Easing.in(Easing.cubic), useNativeDriver: NATIVE_DRIVER }).start(({ finished }) => finished && onDone());
  }, [y, outMs, onDone]);

  useEffect(() => {
    Animated.timing(y, { toValue: 0, duration: inMs, easing: Easing.out(Easing.cubic), useNativeDriver: NATIVE_DRIVER }).start();
    if (tone === "error") return; // stays until tapped
    const timer = setTimeout(dismiss, motion.toast);
    return () => clearTimeout(timer);
  }, [y, inMs, tone, dismiss]);

  return (
    <Animated.View style={[styles.wrap, { top: insets.top + space.sm, transform: [{ translateY: y }] }]}>
      <Pressable
        onPress={dismiss}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        accessibilityLabel={`${toast.message}. Tap to dismiss`}
        style={[styles.toast, { backgroundColor: t.bg }]}
      >
        <Icon name={ICONS[tone]} size={ICON} weight="fill" color={t.fg} />
        <Text variant="bodyStrong" color={t.fg} style={styles.text}>
          {toast.message}
        </Text>
        {tone === "error" ? <Icon name="x" size={ICON} color={t.fg} /> : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 },
  wrap: { position: "absolute", left: layout.gutter, right: layout.gutter },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    shadowColor: shadow.bubble.color,
    shadowOpacity: shadow.bubble.opacity,
    shadowOffset: { width: 0, height: shadow.bubble.offsetY },
    shadowRadius: shadow.bubble.blur / 2,
    elevation: 4,
  },
  text: { flex: 1 },
});
