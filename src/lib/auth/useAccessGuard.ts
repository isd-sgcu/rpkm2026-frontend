import { useEffect } from "react";

import { useProfile } from "./useProfile";
import type { ProfileState } from "./profile";

const STAFF_ALLOWED_PATHS = ["/", "/staff/register"];
const PUBLIC_PATHS = ["/landing"];

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function resolveRedirect(profile: ProfileState, path: string): string | null {
  if (profile.status === "ready") {
    const isStaff = profile.me.role === "staff";
    if (isStaff && !STAFF_ALLOWED_PATHS.includes(path)) return "/";
    if (!isStaff && path === "/staff/register") return "/";
    if (!isStaff && profile.me.registered && path === "/register") return "/";
    return null;
  }

  if (profile.status === "ineligible") {
    if (path !== "/landing" && path !== "/not-eligible") return "/not-eligible";
    return null;
  }

  if (profile.status === "unauthenticated" && !PUBLIC_PATHS.includes(path)) {
    return "/landing";
  }

  return null;
}

export function useAccessGuard(pathname: string): { ready: boolean } {
  const profile = useProfile();
  const path = normalizePath(pathname);
  const redirectTo = resolveRedirect(profile, path);

  useEffect(() => {
    if (redirectTo) {
      window.location.href = redirectTo;
    }
  }, [redirectTo]);

  if (path === "/landing") {
    return { ready: true };
  }

  return { ready: profile.status !== "loading" && redirectTo === null };
}
