import { gap, layout, space } from "@skillproof/tokens";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Share, StyleSheet, View } from "react-native";

import { ModulePlaceholder } from "../../components/ModulePlaceholder";
import { PassportBadges } from "../../components/passport/PassportBadges";
import { PassportCover } from "../../components/passport/PassportCover";
import { QrSheet } from "../../components/passport/QrSheet";
import { SharingCard } from "../../components/passport/SharingCard";
import { ShownSkillsSheet } from "../../components/passport/ShownSkillsSheet";
import { SkillEvidenceList } from "../../components/passport/SkillEvidenceList";
import { Card, Dialog, EmptyState, Hero, Screen, SectionHeader, Text, useToast } from "../../components/ui";
import { getPassportData, passportBadges, savePassportSharing } from "../../lib/passport";

/**
 * Skill Passport (Module 5 home, reference screen): the open passport, its badges, who can see it
 * (public switch with consent, skills shown, Share link, QR code), then every skill with its evidence.
 * Saves show a toast; failures an error toast that stays (rule 11).
 */
export default function PassportScreen() {
  const router = useRouter();
  const toast = useToast();
  const data = getPassportData();
  const [isPublic, setIsPublic] = useState(data?.share.isPublic ?? false);
  const [shown, setShown] = useState<string[]>(() => data?.skills.filter((s) => s.shown).map((s) => s.skill) ?? []);
  const [askPublic, setAskPublic] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>([]);

  if (!data) return <ModulePlaceholder title="Skill Passport" module="Module 5" owner="Azim" pose="graduate" />;
  const skills = data.skills.map((s) => ({ ...s, shown: shown.includes(s.skill) }));
  const verified = skills.filter((s) => s.status === "verified");
  const practised = skills.filter((s) => s.status === "practised");

  // apply the change only once it is saved; a failure stays on screen until tapped
  const save = async (change: Parameters<typeof savePassportSharing>[0], done: string, apply: () => void) => {
    try {
      await savePassportSharing(change);
      apply();
      toast({ message: done, tone: "success" });
    } catch (e) {
      toast({ message: `Couldn’t save. ${e instanceof Error ? e.message : "Try again."}`, tone: "error" });
    }
  };
  const makePublic = () => {
    setAskPublic(false);
    save({ isPublic: true }, "Your passport is public", () => setIsPublic(true));
  };
  const makePrivate = () => save({ isPublic: false }, "Your passport is private now", () => setIsPublic(false));
  const openSheet = () => {
    setDraft(shown);
    setSheetOpen(true);
  };
  const saveShown = () => {
    setSheetOpen(false);
    save({ shown: draft }, `Saved: ${draft.length} of ${skills.length} skills shown`, () => setShown(draft));
  };
  const shareLink = async () => {
    try {
      await Share.share({ message: `My SkillProof passport: https://${data.share.link}` });
    } catch (e) {
      // closing the share sheet is a choice, not a failure (the web rejects with AbortError)
      if (e instanceof Error && e.name === "AbortError") return;
      toast({ message: "Sharing isn’t available here. Copy the link from your passport instead.", tone: "error" });
    }
  };

  return (
    <Screen>
      <Hero plain>
        <View style={styles.heading}>
          <Text variant="title">Skill Passport</Text>
          <Text variant="small" color="secondary">
            Your proven skills, ready to share
          </Text>
        </View>
      </Hero>

      <View style={styles.content}>
        <PassportCover student={data.student} verified={verified.length} practised={practised.length} share={{ ...data.share, isPublic }} />
        {skills.length ? (
          <>
            <PassportBadges badges={passportBadges(data)} onUnlockMore={() => router.navigate("/challenges")} />
            <SectionHeader title="Sharing" />
            <SharingCard
              isPublic={isPublic}
              shownCount={shown.length}
              total={skills.length}
              onTogglePublic={(on) => (on ? setAskPublic(true) : makePrivate())}
              onChooseSkills={openSheet}
              onShare={shareLink}
              onShowQr={() => setQrOpen(true)}
            />
            {verified.length ? (
              <>
                <SectionHeader title="Verified by a mentor" />
                <SkillEvidenceList skills={verified} />
              </>
            ) : null}
            {practised.length ? (
              <>
                <SectionHeader title="Practised in challenges" />
                <SkillEvidenceList skills={practised} />
              </>
            ) : null}
          </>
        ) : (
          <Card>
            <EmptyState
              mascot="graduate"
              title="Your passport is empty for now"
              body="Pass challenges in a skill to add it as Practised. A mentor-reviewed project makes it Verified."
              action={{ label: "Go to challenges", variant: "primary", onPress: () => router.navigate("/challenges") }}
            />
          </Card>
        )}
      </View>

      {/* consent before anything goes public (PDPA) — never flip the switch without it */}
      <Dialog
        visible={askPublic}
        title="Make your passport public?"
        body="Anyone with your link will see your name, the skills you choose and their evidence. You can make it private again at any time."
        confirm={{ label: "Make public", onPress: makePublic }}
        cancel={{ label: "Not now", onPress: () => setAskPublic(false) }}
        onClose={() => setAskPublic(false)}
      />
      <ShownSkillsSheet visible={sheetOpen} skills={skills} value={draft} onChange={setDraft} onSave={saveShown} onClose={() => setSheetOpen(false)} />
      <QrSheet visible={qrOpen && isPublic} onClose={() => setQrOpen(false)} name={data.student.name} link={data.share.link} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: space.xxs },
  content: { paddingHorizontal: layout.gutter, gap: gap.loose },
});
