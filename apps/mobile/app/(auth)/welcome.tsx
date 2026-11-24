import { colors, layout, motion, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, View, type LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Logo, Mascot, Text, useReducedMotion } from "../../components/ui";
import { NATIVE_DRIVER } from "../../components/ui/motion";

const LOGO = 34; // the logo on Welcome
const LOGO_LAUNCH = 52; // the logo on the purple — the native launch screen's size (app.config.ts imageWidth 236)
const GEM = 132;
const GEM_FROM = 0.6; // Gem pops in from this scale
const WORDS_WIDTH = 300;
const WORDS_RISE = 12; // the sentence comes up from this far below
const BUTTONS_RISE = 90; // the buttons rise from below the screen's edge
const STATUS_FLIP = 0.5; // the status bar turns dark halfway through
// Where each part plays on the opening's 0 → 1 timeline.
const PHASE = { purple: [0, 0.7], gem: [0.45, 0.85], words: [0.6, 1], buttons: [0.5, 1] } as const;

// The opening plays once per app launch, not when the student comes back from onboarding or log in.
let opened = false;

/**
 * Welcome (shared core, reference screen; Azim 29 Oct, after Duolingo's): it opens from the launch
 * screen — the logo on the brand purple — then the purple fades into the page, the logo settles into
 * its place in its own colours, Gem pops in above it, one sentence on what SkillProof does fades up
 * and the two buttons rise. Under Reduce Motion, and on a second visit, it shows the end at once.
 */
export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, launching } = useOpening();
  const [pageHeight, setPageHeight] = useState<number | null>(null);
  const [logoY, setLogoY] = useState<number | null>(null);

  const along = (phase: readonly [number, number], from: number, to: number) =>
    t.interpolate({ inputRange: [...phase], outputRange: [from, to], extrapolate: "clamp" });
  const purple = along(PHASE.purple, 1, 0);
  // the logo starts in the middle of the page (where the launch screen drew it) and ends in its place
  const shift = pageHeight == null || logoY == null ? 0 : logoY + LOGO / 2 - pageHeight / 2;

  return (
    <View style={styles.page} onLayout={(e: LayoutChangeEvent) => setPageHeight(e.nativeEvent.layout.height)}>
      <StatusBar style={launching ? "light" : "dark"} />

      <View style={[styles.centre, { paddingTop: insets.top }]}>
        <Animated.View style={{ opacity: along(PHASE.gem, 0, 1), transform: [{ scale: along(PHASE.gem, GEM_FROM, 1) }] }}>
          <Mascot size={GEM} />
        </Animated.View>
        {/* the logo's place; the logo itself is drawn above the purple, at the end of this file */}
        <View
          onLayout={(e: LayoutChangeEvent) => setLogoY(e.nativeEvent.layout.y)}
          style={styles.logoSlot}
          accessible
          accessibilityRole="header"
          accessibilityLabel="SkillProof"
        />
        <Animated.View style={{ opacity: along(PHASE.words, 0, 1), transform: [{ translateY: along(PHASE.words, WORDS_RISE, 0) }] }}>
          <Text variant="body" color="secondary" align="center" style={styles.words}>
            Short challenges and real projects turn your tech skills into proof employers can check.
          </Text>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.actions,
          { paddingBottom: insets.bottom + space.lg },
          { opacity: along(PHASE.buttons, 0, 1), transform: [{ translateY: along(PHASE.buttons, BUTTONS_RISE, 0) }] },
        ]}
      >
        <Button label="Get started" block onPress={() => router.push("/onboarding")} />
        <Button label="I have an account" variant="secondary" block onPress={() => router.push("/log-in")} />
      </Animated.View>

      {/* the launch screen's purple, fading into the page… */}
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.purple, { opacity: purple }]} />
      {/* …and the logo on top of it: white on the purple, its own colours on the page */}
      <Animated.View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.logo, { transform: [{ translateY: along(PHASE.purple, 0, shift) }, { scale: along(PHASE.purple, LOGO_LAUNCH / LOGO, 1) }] }]}
      >
        <Logo size={LOGO} />
        <Animated.View style={[StyleSheet.absoluteFill, styles.centred, { opacity: purple }]}>
          <Logo size={LOGO} tone="onBrand" />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

/** The opening's timeline (0 → 1) and whether the purple still shows (for the status bar). */
function useOpening() {
  const reduced = useReducedMotion();
  const [t] = useState(() => new Animated.Value(opened ? 1 : 0));
  const [launching, setLaunching] = useState(!opened);

  useEffect(() => {
    const id = t.addListener(({ value }) => setLaunching(value < STATUS_FLIP));
    const end = { toValue: 1, useNativeDriver: NATIVE_DRIVER };
    const anim =
      opened || reduced
        ? Animated.timing(t, { ...end, duration: 0 })
        : Animated.sequence([
            Animated.delay(motion.launch),
            Animated.timing(t, { ...end, duration: motion.open, easing: Easing.inOut(Easing.cubic) }),
          ]);
    anim.start(({ finished }) => {
      if (finished) opened = true;
    });
    return () => {
      anim.stop();
      t.removeListener(id);
    };
  }, [reduced, t]);

  return { t, launching };
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg.app },
  centre: { flex: 1, alignItems: "center", justifyContent: "center", gap: space.lg, paddingHorizontal: layout.gutter },
  logoSlot: { height: LOGO },
  words: { maxWidth: WORDS_WIDTH },
  actions: { paddingHorizontal: layout.gutter, gap: space.sm },
  purple: { backgroundColor: colors.accent.brand },
  logo: { position: "absolute", left: 0, right: 0, top: "50%", marginTop: -LOGO / 2, alignItems: "center" },
  centred: { alignItems: "center" },
});
