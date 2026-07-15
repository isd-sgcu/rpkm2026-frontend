import { useEffect } from "react";

import { useProfile } from "./useProfile";
import type { ProfileState } from "./profile";
import { toast } from "sonner";

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
    if (!isStaff && !profile.me.registered && path !== "/register")
      return "/register";
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
      if (import.meta.env.DEV) {
        toast.info("[dev] ยกเลิกการ redirect ของ AccessGaurd", {
          description: `จริงๆ ควรโดน redirect ไป ${redirectTo} แต่ยกเลิกเพราะอยู่ใน dev`,
        });
        return;
      }
      window.location.href = redirectTo;
    }
  }, [redirectTo]);

  if (path === "/landing") {
    return { ready: true };
  }

  if (import.meta.env.DEV) {
    return { ready: profile.status !== "loading" };
  }

  return { ready: profile.status !== "loading" && redirectTo === null };
}
