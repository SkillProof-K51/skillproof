import { colors } from "@skillproof/tokens";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { TestModeFrame } from "../components/TestModeFrame";
import { ToastProvider } from "../components/ui";
import { fontsToLoad } from "../components/ui/fonts";
import { useSession } from "../lib/session";
import { isTestMode } from "../lib/testMode";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontsToLoad);
  const session = useSession();
  const ready = (fontsLoaded || !!fontError) && session !== undefined;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // Keep the splash up until the fonts and the saved session are ready, so no screen ever flashes
  // the system font or the wrong side of the sign-in.
  if (!ready) return null;

  // Signed out: Welcome, onboarding, sign-up, log-in. Signed in: the app. Switching sides happens by
  // itself when the session changes. TEST MODE opens both, on demo data.
  const signedIn = !!session;
  return (
    <SafeAreaProvider>
      <TestModeFrame>
        <ToastProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg.app } }}>
            <Stack.Protected guard={isTestMode || !signedIn} redirectTo="/">
              <Stack.Screen name="(auth)/welcome" />
              <Stack.Screen name="(auth)/onboarding" />
              <Stack.Screen name="(auth)/sign-up" />
              <Stack.Screen name="(auth)/log-in" />
            </Stack.Protected>
            <Stack.Protected guard={isTestMode || signedIn} redirectTo="/welcome">
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="challenges/[id]" />
              <Stack.Screen name="challenges/result" />
              <Stack.Screen name="progress" />
            </Stack.Protected>
            <Stack.Screen name="kit" />
          </Stack>
        </ToastProvider>
      </TestModeFrame>
    </SafeAreaProvider>
  );
}
