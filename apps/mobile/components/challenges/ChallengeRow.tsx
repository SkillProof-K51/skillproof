import type { Challenge, ChallengeKind } from "../../lib/challenges";
import { Chip, IconBadge, ListRow, type IconName } from "../ui";

/** Each kind's name and icon — the same everywhere a challenge appears (list, filter, result). */
export const KINDS: Record<ChallengeKind, { label: string; icon: IconName }> = {
  fix_bug: { label: "Fix the bug", icon: "bug" },
  sql_live: { label: "SQL live", icon: "database" },
  explain_it: { label: "Explain it", icon: "message" },
};

type Props = {
  challenge: Challenge;
  onPress: () => void;
};

/**
 * One challenge in a list: its kind as a grey tile (a category, not a status), the skill, and where
 * the student stands — not tried yet (time), tried (best score), or passed (blue: it counts toward
 * Practised). Put rows in a <Card> with a <Divider> between them.
 */
export function ChallengeRow({ challenge, onPress }: Props) {
  const kind = KINDS[challenge.kind];
  const { best } = challenge;
  const state = best?.passed
    ? `Passed with ${best.score}%`
    : best
      ? `Best so far ${best.score}%, not passed yet`
      : `${challenge.minutes} minutes, not tried yet`;
  return (
    <ListRow
      title={challenge.title}
      // "SQL live" already names its skill — no "SQL · SQL live"
      subtitle={kind.label.includes(challenge.skill) ? kind.label : `${challenge.skill} · ${kind.label}`}
      leading={<IconBadge icon={kind.icon} tone="grey" />}
      trailing={
        best?.passed ? (
          <Chip label={`${best.score}%`} icon="check" tone="practised" />
        ) : best ? (
          <Chip label={`Best ${best.score}%`} />
        ) : (
          <Chip label={`${challenge.minutes} min`} icon="clock" />
        )
      }
      onPress={onPress}
      accessibilityLabel={`${challenge.title}. ${kind.label}, ${challenge.skill}. ${state}.`}
    />
  );
}
