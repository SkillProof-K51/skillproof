import { gap, layout, space } from "@skillproof/tokens";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, View, type TextInput } from "react-native";

import { Button, Checkbox, Hero, Screen, Select, Text, TextField, TopBar, useToast } from "../../components/ui";
import { getTargetRoles, MIN_PASSWORD, signUp, validateSignUp, type SignUpInput } from "../../lib/auth";
import { parseAnswers } from "../../lib/onboarding";

/**
 * Sign up (shared core, reference screen) — screen 12 of 12, after onboarding, whose answers arrive
 * as `?answers=` (the role comes pre-picked) and are saved with the account. The form pattern: TextFields that hand focus on with
 * the keyboard's Next key, a Select, a consent Checkbox, one strong button. Errors appear under
 * each field after the first try, then update as the student types (rules: lib/auth.ts).
 */
export default function SignUpScreen() {
  const router = useRouter();
  const toast = useToast();
  const roles = getTargetRoles();
  const params = useLocalSearchParams<{ answers?: string }>();
  const [answers] = useState(() => parseAnswers(params.answers));
  const [form, setForm] = useState<SignUpInput>({ name: "", email: "", password: "", roleId: answers.roleId, consent: false });
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const errors = tried ? validateSignUp(form) : {};
  const set =
    <K extends keyof SignUpInput>(key: K) =>
    (value: SignUpInput[K]) =>
      setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    setTried(true);
    if (Object.keys(validateSignUp(form)).length) return;
    setBusy(true);
    try {
      const { demo } = await signUp(form, answers);
      if (demo) toast({ message: "Test mode: no account was created" });
      // into the app with nothing behind it to go back to
      // TODO (shared core): guard routes on the session (Stack.Protected) instead
      if (router.canDismiss()) router.dismissAll();
      router.replace("/");
    } catch (e) {
      toast({ message: e instanceof Error ? e.message : "Couldn’t create your account. Try again.", tone: "error" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen aboveTabBar={false}>
      <Hero plain>
        <TopBar />
        <Text variant="title" accessibilityRole="header" style={styles.title}>
          Create your account
        </Text>
      </Hero>

      <View style={styles.content}>
        <TextField
          label="Full name"
          icon="user"
          value={form.name}
          onChangeText={set("name")}
          error={errors.name}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <TextField
          ref={emailRef}
          label="Email"
          icon="mail"
          placeholder="you@student.utem.edu.my"
          value={form.email}
          onChangeText={set("email")}
          error={errors.email}
          helper="Use your university email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <TextField
          ref={passwordRef}
          label="Password"
          icon="lock"
          secure
          value={form.password}
          onChangeText={set("password")}
          error={errors.password}
          helper={`At least ${MIN_PASSWORD} characters`}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
        />
        <Select
          label="Role you’re working towards"
          options={roles.map((r) => ({ value: r.id, label: r.label, description: r.description }))}
          value={form.roleId}
          onChange={set("roleId")}
          error={errors.roleId}
          helper="Your roadmap and matches follow it. You can change it later."
        />
        <Checkbox
          checked={form.consent}
          onChange={set("consent")}
          label="I agree to the terms and the privacy notice"
          description="Your passport stays private until you share it"
          error={errors.consent}
        />
        <View style={styles.actions}>
          <Button label="Create account" block onPress={submit} disabled={busy} />
          <Button label="I already have an account" variant="secondary" block onPress={() => router.replace("/log-in")} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: space.lg },
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  actions: { gap: space.sm, marginTop: space.sm },
});
