import { atom } from "nanostores";

import { APIError } from "@lib/client";
import { getMe, type MeResult } from "@lib/api/rpkm";
import { $session, refreshSession } from "./session";

export type ProfileState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "ineligible" }
  | { status: "error" }
  | { status: "ready"; me: MeResult };

export const $profile = atom<ProfileState>({ status: "loading" });

let inflight: Promise<void> | null = null;

export function refreshProfile(): Promise<void> {
  if (!inflight) {
    inflight = (async () => {
      if ($session.get().status === "loading") {
        await refreshSession();
      }

      if ($session.get().status !== "authenticated") {
        $profile.set({ status: "unauthenticated" });
        return;
      }

      try {
        const me = await getMe();
        $profile.set({ status: "ready", me });
      } catch (err) {
        if (err instanceof APIError && err.status === 403) {
          $profile.set({ status: "ineligible" });
        } else {
          $profile.set({ status: "error" });
        }
      }
    })().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}
