import { cn } from "cn";

import { getTestView } from "@/lib/account";
import { setTestView } from "@/lib/auth-actions";
import { TEST_VIEW_LABELS, TEST_VIEWS } from "@/lib/demo/accounts";

/**
 * TEST MODE's strip (AGENTS.md rule 4): always on top, in the TEST MODE yellow, so demo data never
 * looks real — and the switch for which demo account you're viewing the portal as.
 */
export async function TestModeStrip() {
  const current = await getTestView();
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-accent-butter px-4 py-1.5 text-xs">
      <strong className="font-semibold tracking-wide">TEST MODE</strong>
      <span className="text-muted-foreground">Demo data: nothing is saved. Viewing as</span>
      <div className="flex flex-wrap gap-1">
        {TEST_VIEWS.map((view) => (
          <form key={view} action={setTestView.bind(null, view)}>
            <button
              type="submit"
              aria-pressed={view === current}
              className={cn(
                "rounded-md px-2 py-0.5 font-medium",
                view === current ? "bg-foreground text-background" : "hover:bg-foreground/10",
              )}
            >
              {TEST_VIEW_LABELS[view]}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
