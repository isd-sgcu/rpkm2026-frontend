import { atom } from "nanostores";

import { getSession, signOut, type SessionUser } from "@lib/api/auth";

export type SessionState =
  | { status: "loading" }
  | { status: "authenticated"; user: SessionUser }
  | { status: "unauthenticated" };

export const $session = atom<SessionState>({ status: "loading" });

let inflight: Promise<void> | null = null;

export function refreshSession(): Promise<void> {
  if (!inflight) {
    inflight = getSession()
      .then((data) => {
        $session.set(
          data?.user
            ? { status: "authenticated", user: data.user }
            : { status: "unauthenticated" },
        );
      })
      .catch(() => {
        $session.set({ status: "unauthenticated" });
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export async function logout(): Promise<void> {
  try {
    await signOut();
  } finally {
    $session.set({ status: "unauthenticated" });
  }
}
