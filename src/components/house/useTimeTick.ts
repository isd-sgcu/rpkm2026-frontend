import { useEffect, useState } from "react";

/**
 * Forces a re-render every `intervalMs` and returns the current time, so
 * render-time checks against a lock module's open/close/announce boundaries
 * (isRound2Open, isHouseResultAnnounced, etc) flip on their own while the
 * page stays open, instead of only updating on the next user-triggered
 * render or a full reload.
 */
export function useTimeTick(intervalMs: number = 30_000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
