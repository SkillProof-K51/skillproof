import { useState } from "react";

import { Button, Hero, Screen, Text } from "../../components/ui";

export default function ProfileScreen() {
  const [message, setMessage] = useState("");

  return (
    <Screen>
      <Hero>
        <Text variant="title">My Profile</Text>
        <Text variant="small" color="secondary">
          SkillProof Module 2 · Insyirah
        </Text>
      </Hero>

      <Button
        label="Test Profile"
        block
        onPress={() => setMessage("Warm-up screen is working!")}
      />

      {message ? <Text variant="small">{message}</Text> : null}
    </Screen>
  );
}
