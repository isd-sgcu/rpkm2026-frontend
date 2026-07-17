import { useEffect } from "react";

import { useProfile } from "./useProfile";
import type { ProfileState } from "./profile";
import { toast } from "sonner";
import { findGatedEvent, isUnlocked } from "@lib/guard";

const STAFF_ALLOWED_PATHS = ["/"];
const PUBLIC_PATHS = ["/landing"];

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export const POST_LOGIN_REDIRECT_KEY = "rpkm:postLoginRedirect";

function resolveRedirect(profile: ProfileState, path: string): string | null {
  // Checked before the event-lock gate: an unauthenticated visitor should go
  // log in first regardless of whether the page is locked — once they're
  // back and "ready", this function runs again and the gate applies normally.
  if (profile.status === "unauthenticated") {
    if (PUBLIC_PATHS.includes(path)) return null;
    return "/landing";
  }

  const gated = findGatedEvent(path);
  if (gated && !isUnlocked(gated[0])) {
    return "/";
  }

  if (profile.status === "ready") {
    const isStaff = profile.me.role === "staff";
    if (
      isStaff &&
      !STAFF_ALLOWED_PATHS.includes(path) &&
      !path.startsWith("/staff")
    )
      return "/";
    if (!isStaff && path.startsWith("/staff")) return "/";
    if (!isStaff && !profile.me.registered && path !== "/register")
      return "/register";
    if (!isStaff && profile.me.registered && path === "/register") return "/";
    if (
      gated?.[1].allowedRoles &&
      !gated[1].allowedRoles.includes(profile.me.role)
    )
      return "/";
    return null;
  }

  if (profile.status === "ineligible") {
    if (path !== "/landing" && path !== "/not-eligible") return "/not-eligible";
    return null;
  }

  return null;
}

export function useAccessGuard(pathname: string): { ready: boolean } {
  const profile = useProfile();
  // Prefer the real browser URL over the build-time prop: they match for
  // every normally-matched route, but diverge on the static 404 fallback
  // (see src/pages/404.astro), where the Astro-resolved path is always
  // "/404" while window.location still has the real requested path/query.
  const path = normalizePath(
    typeof window !== "undefined" ? window.location.pathname : pathname,
  );
  const redirectTo = resolveRedirect(profile, path);

  useEffect(() => {
    if (redirectTo) {
      if (redirectTo === "/landing" && profile.status === "unauthenticated") {
        const target = window.location.pathname + window.location.search;
        console.log(target);
        if (target !== "/landing") {
          sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, target);
        }
      }
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
