import { useState } from "react";
import { View } from "react-native";
import { layout } from "@skillproof/tokens";

import { Button, Hero, Screen, Text, useToast } from "../../components/ui";
import { logOut } from "../../lib/auth";

export default function ProfileScreen() {
  const [message, setMessage] = useState("");
  const toast = useToast();
  // shared core (Azim): signing out sends the app back to Welcome by itself
  const leave = () =>
    logOut().then(
      ({ demo }) => demo && toast({ message: "Test mode: you stay signed in" }),
      (e: unknown) => toast({ message: e instanceof Error ? e.message : "Couldn’t log out. Try again.", tone: "error" }),
    );

  return (
    <Screen>
      <Hero>
        <Text variant="title">My Profile</Text>
        <Text variant="small" color="secondary">
          SkillProof Module 2 · Insyirah
        </Text>
      </Hero>

      <View style={{ paddingHorizontal: layout.gutter }}>
        <Button
          label="Test Profile"
          block
          onPress={() => setMessage("Warm-up screen is working!")}
        />

        {message ? <Text variant="small">{message}</Text> : null}

        <Button label="Log out" variant="secondary" block onPress={leave} />
      </View>
    </Screen>
  );
}
