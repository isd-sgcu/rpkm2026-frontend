import { useEffect, useState } from "react";

import { Button } from "@components/ui/button";
import { signInWithGoogle } from "@lib/api/auth";
import { useSession } from "@lib/auth/useSession";
import { useProfile } from "@lib/auth/useProfile";
import { refreshProfile } from "@lib/auth/profile";
import { useT } from "@lib/i18n/useT";

import rpkmLogo from "@assets/images/rpkm_logo.png";

function LandingCta() {
  const t = useT();
  const session = useSession();
  const profile = useProfile();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState(false);

  useEffect(() => {
    if (profile.status === "ineligible") {
      window.location.href = "/not-eligible";
    } else if (profile.status === "ready" && profile.me.role !== "staff") {
      window.location.href = profile.me.registered ? "/" : "/register";
    }
  }, [profile.status]);

  // `window.location.href = url` navigates away to Google; if the user hits
  // back (or Google rejects the request, e.g. redirect_uri_mismatch) and the
  // browser restores this page from the bfcache, React state is exactly as
  // it was mid-redirect — isSigningIn would otherwise stay stuck at `true`
  // forever with no way to retry short of a hard refresh.
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setIsSigningIn(false);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setSignInError(false);
    try {
      const { url } = await signInWithGoogle(
        `${window.location.origin}/landing`,
      );
      window.location.href = url;
    } catch {
      setSignInError(true);
      setIsSigningIn(false);
    }
  };

  if (profile.status === "error" || signInError) {
    return (
      <div className="flex w-full flex-col items-center gap-3">
        <p className="text-sm text-destructive">{t("login.error")}</p>
        <Button
          type="button"
          size="lg"
          className="w-full rounded-full"
          onClick={() =>
            signInError ? handleGoogleSignIn() : refreshProfile()
          }
        >
          {t("login.retry")}
        </Button>
      </div>
    );
  }

  const isResolving = isSigningIn || session.status !== "unauthenticated";

  return (
    <Button
      type="button"
      size="lg"
      className="w-full rounded-full"
      disabled={isResolving}
      onClick={handleGoogleSignIn}
    >
      {isResolving ? t("login.loading") : t("landing.cta")}
    </Button>
  );
}

export function LandingCardContent() {
  const t = useT();

  // TODO: THIS IS MOCK LANDING
  return (
    <div className="flex h-full flex-col items-center justify-between gap-6 rounded-3xl bg-primary px-8 py-10 text-center">
      <img src={rpkmLogo.src} alt="rpkm logo" className="w-full max-w-40" />

      <div className="flex flex-col gap-5 text-foreground">
        <div className="flex flex-col">
          <p className="text-[17px]">{t("landing.eyebrow")}</p>
          <p className="text-[28px]">
            <span>{t("landing.titleLine1")}</span>
            <br />
            <span>{t("landing.titleLine2")}</span>
          </p>
        </div>
        <p className="text-2xl">{t("landing.date")}</p>
      </div>

      <LandingCta />
    </div>
  );
}
