import { gap, layout, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, View, type TextInputInstance } from "react-native";

import { Button, Hero, Screen, Text, TextField, TopBar, useToast } from "../../components/ui";
import { logIn, sendPasswordReset, validateLogIn, type LogInInput } from "../../lib/auth";

/**
 * Log in (shared core, reference screen): email and password, the keyboard's Go key submits,
 * Forgot password? as a quiet text button, one strong button. Errors after the first try.
 */
export default function LogInScreen() {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState<LogInInput>({ email: "", password: "" });
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState(false);
  const passwordRef = useRef<TextInputInstance>(null);
  const errors = tried ? validateLogIn(form) : {};
  const set = (key: keyof LogInInput) => (value: string) => setForm((f) => ({ ...f, [key]: value }));
  const fail = (e: unknown) => toast({ message: e instanceof Error ? e.message : "Something went wrong. Try again.", tone: "error" });

  const submit = async () => {
    setTried(true);
    if (Object.keys(validateLogIn(form)).length) return;
    setBusy(true);
    try {
      const { demo } = await logIn(form);
      // A real log-in moves on by itself: the session opens the app (app/_layout.tsx).
      if (demo) {
        toast({ message: "Test mode: you’re in as the demo student" });
        if (router.canDismiss()) router.dismissAll();
        router.replace("/");
      }
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };

  const forgot = async () => {
    if (validateLogIn(form).email) {
      toast({ message: "Enter your email above first, then tap Forgot password" });
      return;
    }
    try {
      const { demo } = await sendPasswordReset(form.email);
      toast(demo ? { message: "Test mode: no email was sent" } : { message: "Check your inbox for a reset link", tone: "success" });
    } catch (e) {
      fail(e);
    }
  };

  return (
    <Screen aboveTabBar={false}>
      <Hero>
        <TopBar />
        <Text variant="title" accessibilityRole="header" style={styles.title}>
          Welcome back
        </Text>
      </Hero>

      <View style={styles.content}>
        <TextField
          label="Email"
          icon="mail"
          placeholder="you@example.com"
          value={form.email}
          onChangeText={set("email")}
          error={errors.email}
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
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        <Button label="Forgot password?" variant="text" onPress={forgot} style={styles.forgot} />
        <View style={styles.actions}>
          <Button label="Log in" block onPress={submit} disabled={busy} />
          <Button label="Create an account" variant="secondary" block onPress={() => router.replace("/sign-up")} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: space.lg },
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
  forgot: { alignSelf: "flex-end" },
  actions: { gap: space.sm },
});
