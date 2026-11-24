import { useCallback, useEffect, useState } from "react";

export type Loaded<T> = {
  /** undefined until it arrives */
  data?: T;
  /** What went wrong, to show on screen (rule 11: never swallow it). */
  error?: string;
  /** Try again, e.g. from the error's button. */
  reload: () => void;
};

/**
 * Runs one of lib's async reads when the screen opens. Pass a function defined in lib (not an
 * inline arrow), so it only runs once.
 */
export function useLoad<T>(load: () => Promise<T>): Loaded<T> {
  const [state, setState] = useState<{ data?: T; error?: string }>({});
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let live = true;
    load().then(
      (data) => live && setState({ data }),
      (e: unknown) => live && setState({ error: e instanceof Error ? e.message : "Couldn’t load this. Try again." }),
    );
    return () => {
      live = false;
    };
  }, [load, attempt]);
  const reload = useCallback(() => {
    setState({});
    setAttempt((n) => n + 1);
  }, []);
  return { ...state, reload };
}
