import { Alert } from "react-native";

import { Button, Hero, Screen, Text } from "../../components/ui";

export default function ProfileScreen() {
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
        onPress={() => Alert.alert("Profile", "Warm-up screen is working!")}
      />
    </Screen>
  );
}
