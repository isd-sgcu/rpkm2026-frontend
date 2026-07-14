import { useEffect } from "react";
import { useStore } from "@nanostores/react";

import { $session, refreshSession } from "./session";

export function useSession() {
  const session = useStore($session);

  useEffect(() => {
    if (session.status === "loading") {
      refreshSession();
    }
  }, [session.status]);

  return session;
}
