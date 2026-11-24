import { gap, layout, space } from "@skillproof/tokens";
import { Fragment, useState } from "react";
import { StyleSheet, View } from "react-native";

import {
  Card,
  Divider,
  EmptyState,
  Hero,
  ListRow,
  Screen,
  SectionHeader,
  SegmentedControl,
  SkillLogo,
  StatusBadge,
  Text,
  TopBar,
} from "../../components/ui";

import {
  getProfileData,
  updateStudentAim,
  type StudentAim,
} from "../../lib/profile";

const LOGO = 24;
const SLOT = LOGO * 2 + space.xxs;
const INSET = SLOT + space.md;

const AIM_OPTIONS = [
  { value: "internship", label: "Internship" },
  { value: "first_job", label: "First Job" },
  { value: "freelance", label: "Freelance" },
] as const;

export default function ProfileScreen() {
  const data = getProfileData();

  const [aim, setAim] = useState<StudentAim>(data?.student.aim ?? "internship");

  return (
    <Screen>
      <Hero>
        <TopBar />
        <View style={styles.heading}>
          <Text variant="title" accessibilityRole="header">
            My Profile
          </Text>
          <Text variant="small" color="secondary">
            Your skills and career direction
          </Text>
        </View>
      </Hero>

      <View style={styles.content}>
        {data ? (
          <>
            <Card>
              <Text variant="title">{data.student.name}</Text>

              <Text variant="small" color="secondary">
                {data.student.programme} · Year {data.student.year ?? "Not set"}
              </Text>

              <Divider />

              <Text variant="small" color="secondary">
                TARGET ROLE
              </Text>

              <Text variant="title">{data.targetRole}</Text>
            </Card>

            <Card>
              <Text variant="small" color="secondary">
                CAREER AIM
              </Text>

              <SegmentedControl
                options={[...AIM_OPTIONS]}
                value={aim}
                onChange={(nextAim) => {
                  setAim(nextAim);
                  void updateStudentAim(nextAim).catch((error) => {
                    console.error("Failed to update career aim:", error);
                  });
                }}
                accessibilityLabel="Choose your career aim"
              />
            </Card>

            <Card>
              <Text variant="small" color="secondary">
                READINESS
              </Text>

              <Text variant="title">{data.readiness}%</Text>

              <Text
                variant="small"
                color={data.ready ? "success" : "secondary"}
              >
                {data.ready ? "Ready" : "Keep practising"}
              </Text>
            </Card>

            <SectionHeader title="Your Skills Roadmap" />

            <Card style={styles.list}>
              {data.skills.map((skill, index) => (
                <Fragment key={skill.skill}>
                  {index > 0 ? <Divider inset={INSET} /> : null}

                  <ListRow
                    title={skill.skill}
                    leading={
                      <View style={styles.slot}>
                        <SkillLogo skill={skill.skill} size={LOGO} />
                      </View>
                    }
                    trailing={<StatusBadge status={skill.status} />}
                  />
                </Fragment>
              ))}
            </Card>
          </>
        ) : (
          <Card>
            <EmptyState
              icon="user"
              title="Your profile will appear here"
              body="Complete your profile to see your skills and target role."
            />
          </Card>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    gap: space.xxs,
    marginTop: space.lg,
  },
  content: {
    paddingHorizontal: layout.gutter,
    gap: gap.loose,
  },
  list: {
    paddingVertical: space.xs,
  },
  slot: {
    width: SLOT,
    alignItems: "center",
  },
});
