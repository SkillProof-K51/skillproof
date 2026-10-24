import { colors } from "@skillproof/tokens";

import type { Challenge, ChallengeKind } from "../../lib/challenges";
import { Chip, IconBadge, ListRow, type IconName } from "../ui";

/**
 * Each kind's name, icon and colours — the same everywhere a challenge appears (list, filter, its
 * page, result) — and what its graded parts are called on the Result screen.
 */
export const KINDS: Record<ChallengeKind, { label: string; icon: IconName; checks: string; colours: { page: string; ink: string } }> = {
  fix_bug: { label: "Fix the bug", icon: "bug", checks: "Tests", colours: colors.kind.fixBug },
  sql_live: { label: "SQL live", icon: "database", checks: "Checks on your result", colours: colors.kind.sqlLive },
  explain_it: { label: "Explain it", icon: "message", checks: "Rubric", colours: colors.kind.explainIt },
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
