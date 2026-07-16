import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import topLanding from "@assets/images/top_landing.svg";
import centerLanding from "@assets/images/center_landing.svg";
import { Button } from "@components/ui/button";
import { MonotoneNoise } from "@components/shared/MonotoneNoise";
import { signInWithGoogle } from "@lib/api/auth";
import { useSession } from "@lib/auth/useSession";
import { useProfile } from "@lib/auth/useProfile";
import { POST_LOGIN_REDIRECT_KEY } from "@lib/auth/useAccessGuard";
import { useT } from "@lib/i18n/useT";

export function LandingPanel() {
  const t = useT();
  const session = useSession();
  const profile = useProfile();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (profile.status === "ineligible") {
      sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
      window.location.href = "/not-eligible";
    } else if (profile.status === "ready" && profile.me.role !== "staff") {
      // A deep link (e.g. a Chula QR Quest sticker scanned while logged out)
      // stashed its target here before bouncing to login — send them back
      // to it instead of the default destination. useAccessGuard re-validates
      // that path normally once they land (register/lock/role checks still apply).
      const savedRedirect = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
      if (savedRedirect) {
        sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
        window.location.href = savedRedirect;
        return;
      }
      window.location.href = profile.me.registered ? "/" : "/register";
    }
  }, [profile.status]);

  // `window.location.href = url` navigates away to Google; if the user hits
  // back (or Google rejects the request) and the browser restores this page
  // from the bfcache, React state is exactly as it was mid-redirect —
  // isSigningIn would otherwise stay stuck at `true` with no way to retry.
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setIsSigningIn(false);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const { url } = await signInWithGoogle(
        `${window.location.origin}/landing`,
      );
      window.location.href = url;
    } catch {
      setIsSigningIn(false);
    }
  };

  const isResolving = isSigningIn || session.status !== "unauthenticated";

  return (
    <div className="relative flex w-full flex-col self-start overflow-x-clip bg-background pb-20.5">
      {/* noise ? */}
      <MonotoneNoise
        noiseColor="rgba(0 0 0 / 0.25)"
        className="pointer-events-none absolute inset-0 -z-1"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-1 flex justify-between">
        <img src={topLanding.src} alt="" className="w-32" />
        <img src={topLanding.src} alt="" className="w-32 -scale-x-100" />
      </div>

      <div className={`relative z-2 px-4 mt-28`}>
        <div className="@container relative mx-auto w-full max-w-92.5">
          <img
            src={centerLanding.src}
            alt="รับเพื่อน ก้าวใหม่"
            className="w-full"
          />
          <div className="absolute inset-x-0 bottom-[6.28%] flex justify-center">
            <Button
              type="button"
              variant="default"
              size="xl"
              className="h-[13.24cqw] w-[54.9cqw] px-0 text-[5.55cqw]"
              disabled={isResolving}
              onClick={handleGoogleSignIn}
            >
              {isResolving ? (
                <Loader2 className="size-[5.55cqw] animate-spin" />
              ) : (
                t("landing.cta")
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
