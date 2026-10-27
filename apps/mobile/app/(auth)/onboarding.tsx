import { colors, gap, layout, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import { BackHandler, Platform, StyleSheet, View } from "react-native";

import { DailyArt, PassportArt, ProjectArt, ProveArt } from "../../components/onboarding/PitchArt";
import { RoadmapPreview } from "../../components/onboarding/RoadmapPreview";
import { WarmUpCard } from "../../components/onboarding/WarmUpCard";
import {
  Button,
  Card,
  EmptyState,
  Hero,
  IconBadge,
  IconButton,
  OptionList,
  ProgressBar,
  Reveal,
  Screen,
  SegmentedControl,
  SkillLogo,
  Text,
  TopBar,
  type IconName,
} from "../../components/ui";
import { getOnboardingOptions, getWarmUp, type OnboardingAnswers } from "../../lib/onboarding";
import { useLoad } from "../../lib/useLoad";

const NEXT_WIDTH = 168; // the centred black pill, BitePal-style
const LOGO = 24;

// Each step's soft page tint: lilac = your path · apricot = a Fix-the-bug challenge · blue =
// projects · gold = the passport (colour = meaning, docs/ui.md).
const STEPS = [
  { id: "prove", tint: colors.accent.skySoft },
  { id: "daily", tint: colors.kind.fixBug.page },
  { id: "projects", tint: colors.status.practised.bg },
  { id: "passport", tint: colors.passport.wash },
  { id: "role", tint: colors.accent.skySoft },
  { id: "aim", tint: colors.accent.skySoft },
  { id: "study", tint: colors.accent.skySoft },
  { id: "used", tint: colors.accent.skySoft },
  { id: "warmup", tint: colors.kind.fixBug.page },
  { id: "roadmap", tint: colors.accent.skySoft },
] as const;
type Step = (typeof STEPS)[number];
// The steps that need the options (roles, programmes) loaded before the student can answer.
const NEEDS_OPTIONS = new Set<Step["id"]>(["role", "aim", "study", "used", "roadmap"]);

const ROLE_ICONS: Record<string, IconName> = { web: "browser", data: "chart", mobile: "mobile", qa: "test" };
const AIM_ICONS: Record<string, IconName> = { internship: "briefcase", first_job: "rocket", freelance: "compass" };

/**
 * Onboarding (shared core, reference screen; Azim 25 Oct): screens 2–11 of 12, between Welcome and
 * Create account. Four "why SkillProof" screens, four questions, a 30-second warm-up, then the
 * student's roadmap. Each step fades up into place; answers ride along to sign-up. The options load
 * while the pitch screens play; the warm-up only shows when there's one to give (TEST MODE for now).
 */
export default function OnboardingScreen() {
  const router = useRouter();
  const { data: options, error, reload } = useLoad(getOnboardingOptions);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({ used: [] });
  const [solved, setSolved] = useState(false);
  const set = (change: Partial<OnboardingAnswers>) => setAnswers((a) => ({ ...a, ...change }));

  const back = () => (step ? setStep(step - 1) : router.back());
  // Android's back button walks back through the steps too (there's no BackHandler anywhere else)
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!step) return false;
      setStep((s) => s - 1);
      return true;
    });
    return () => sub.remove();
  }, [step]);

  const steps: readonly Step[] = getWarmUp() ? STEPS : STEPS.filter((s) => s.id !== "warmup");
  const { id, tint } = steps[step];
  const waiting = !options && NEEDS_OPTIONS.has(id);
  if (waiting && error) return <OptionsError message={error} onRetry={reload} />;
  const role = options?.roles.find((r) => r.id === answers.roleId);
  const warmUp = getWarmUp(answers.roleId);
  const last = step === steps.length - 1;
  const ready =
    !waiting &&
    (id !== "role" || !!answers.roleId) &&
    (id !== "aim" || !!answers.aimId) &&
    (id !== "study" || (!!answers.programmeId && !!answers.year));
  const skipping = id === "warmup" && !solved;
  const next = () =>
    last ? router.push({ pathname: "/sign-up", params: { answers: JSON.stringify(answers) } }) : setStep(step + 1);

  const page: Record<(typeof STEPS)[number]["id"], { title: string; body: string; content: ReactNode }> = {
    prove: { title: "Prove your skills, not just list them", body: "Every skill goes from Not yet to Practised to Verified, with evidence behind it.", content: <ProveArt /> },
    daily: { title: "15 minutes a day", body: "Short challenges: fix a bug, write a query, explain some code.", content: <DailyArt /> },
    projects: {
      title: "Real projects, real mentors",
      body: "Practised skills unlock micro-projects from companies. A mentor rates your work and verifies the skill.",
      content: <ProjectArt />,
    },
    passport: { title: "A passport employers can check", body: "One link or QR code with every verified skill and the evidence behind it.", content: <PassportArt /> },
    role: {
      title: "Which role are you working towards?",
      body: "Your roadmap follows it. You can change it later.",
      content: (
        <OptionList
          accessibilityLabel="Role"
          options={(options?.roles ?? []).map((r) => ({ value: r.id, label: r.label, description: r.description, leading: <IconBadge icon={ROLE_ICONS[r.id] ?? "compass"} tone="grey" /> }))}
          value={answers.roleId}
          // a new role has a new roadmap: skills picked for the old one no longer apply
          onChange={(roleId) => set({ roleId, used: [] })}
        />
      ),
    },
    aim: {
      title: "What are you aiming for?",
      body: "We’ll suggest projects that fit.",
      content: (
        <OptionList
          accessibilityLabel="Aim"
          options={(options?.aims ?? []).map((a) => ({ value: a.id, label: a.label, description: a.description, leading: <IconBadge icon={AIM_ICONS[a.id] ?? "compass"} tone="grey" /> }))}
          value={answers.aimId}
          onChange={(aimId) => set({ aimId })}
        />
      ),
    },
    study: {
      title: "What do you study?",
      body: "Your programme and year go on your profile.",
      content: (
        <View style={styles.study}>
          <OptionList
            accessibilityLabel="Programme"
            options={(options?.programmes ?? []).map((p) => ({ value: p.id, label: p.label }))}
            value={answers.programmeId}
            onChange={(programmeId) => set({ programmeId })}
          />
          <Text variant="label" color="secondary">
            Year
          </Text>
          <SegmentedControl
            accessibilityLabel="Year of study"
            options={(options?.years ?? []).map((y) => ({ value: String(y), label: `Year ${y}` }))}
            value={answers.year ? String(answers.year) : ""}
            onChange={(y) => set({ year: Number(y) })}
          />
        </View>
      ),
    },
    used: {
      title: "Which of these have you used?",
      body: "Pick any. Your first challenges start there; only challenges and mentors can prove a skill.",
      content: (
        <OptionList
          multiple
          accessibilityLabel="Skills you have used"
          options={(role?.roadmap ?? []).map((s) => ({ value: s.id, label: s.name, leading: <SkillLogo skill={s.name} size={LOGO} /> }))}
          value={answers.used}
          onChange={(used) => set({ used })}
        />
      ),
    },
    warmup: {
      title: "Try one: tap the line with the bug",
      body: `${warmUp?.skill ?? "Code"} · about 30 seconds`,
      content: warmUp ? <WarmUpCard warmUp={warmUp} onSolved={() => setSolved(true)} /> : null,
    },
    roadmap: {
      title: `Your ${role?.label ?? ""} roadmap`,
      body: `${role?.roadmap.length ?? 0} badges to earn. Each starts locked: pass challenges to unlock it, then a mentor verifies it.`,
      content: role ? <RoadmapPreview role={role} used={answers.used} /> : null,
    },
  };
  const { title, body, content } = page[id];

  return (
    <Screen
      aboveTabBar={false}
      tint={tint}
      footer={
        <Button
          label={last ? "Create my account" : skipping ? "Skip for now" : "Next"}
          icon={last ? "arrow-right" : undefined}
          variant={skipping ? "secondary" : "primary"}
          disabled={!ready}
          onPress={next}
          style={styles.next}
        />
      }
    >
      <Hero>
        <View style={styles.top}>
          <IconButton icon="chevron-left" accessibilityLabel={step ? "Back" : "Back to welcome"} onPress={back} />
          <View style={styles.flex} accessibilityLabel={`Step ${step + 2} of ${steps.length + 2}`}>
            <ProgressBar percent={Math.round(((step + 1) / steps.length) * 100)} />
          </View>
        </View>
      </Hero>
      <Reveal key={id} style={styles.content}>
        <View style={styles.words}>
          <Text variant="headline" align="center" accessibilityRole="header">
            {title}
          </Text>
          <Text variant="body" color="secondary" align="center">
            {body}
          </Text>
        </View>
        {waiting ? (
          <Text variant="body" color="secondary" align="center">
            Loading the choices…
          </Text>
        ) : (
          content
        )}
      </Reveal>
    </Screen>
  );
}

/** The roles or programmes didn't load: say why, and offer to try again (rule 11). */
function OptionsError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Screen aboveTabBar={false}>
      <Hero>
        <TopBar title="Get started" />
      </Hero>
      <View style={styles.content}>
        <Card>
          <EmptyState title="Couldn’t load the choices" body={message} action={{ label: "Try again", onPress: onRetry }} />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "center", gap: space.lg },
  flex: { flex: 1 },
  content: { paddingHorizontal: layout.gutter, gap: space.xl },
  words: { gap: space.sm, paddingHorizontal: space.sm },
  study: { gap: gap.loose },
  next: { alignSelf: "center", minWidth: NEXT_WIDTH },
});
