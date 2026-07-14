import { useEffect } from "react";
import { useStore } from "@nanostores/react";

import { $profile, refreshProfile } from "./profile";

export function useProfile() {
  const profile = useStore($profile);

  useEffect(() => {
    if (profile.status === "loading") {
      refreshProfile();
    }
  }, [profile.status]);

  return profile;
}
