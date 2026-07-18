import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import cloudLeft from "@assets/images/landing_cloud_left.svg";
import cloudRight from "@assets/images/landing_cloud_right.svg";
import emblem from "@assets/images/landing_emblem.svg";
import plantsLeft from "@assets/images/landing_plants_left.svg";
import plantsRight from "@assets/images/landing_plants_right.svg";
import { Button } from "@components/ui/button";
import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import { signInWithGoogle } from "@lib/api/auth";
import { popReturnTo } from "@lib/auth/returnTo";
import { useSession } from "@lib/auth/useSession";
import { useProfile } from "@lib/auth/useProfile";
import { useT } from "@lib/i18n/useT";

export function LandingPanel() {
  const t = useT();
  const session = useSession();
  const profile = useProfile();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (profile.status === "ineligible") {
      // Discard any stored destination so it can't leak into a later login.
      popReturnTo();
      window.location.href = "/not-eligible";
    } else if (profile.status === "ready" && profile.me.staffRole === null) {
      // A deep link (e.g. a Chula QR Quest sticker scanned while logged out)
      // stashed its target before bouncing to login — send them back to it
      // instead of the default destination. useAccessGuard re-validates that
      // path normally once they land (register/lock/role checks still apply).
      // Always pop so a stale destination can't hijack a later login;
      // unregistered users must finish /register first and simply lose it.
      const returnTo = popReturnTo();
      window.location.href = profile.me.registered
        ? (returnTo ?? "/")
        : "/register";
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
    // The artwork's sky is transparent, so the page colour *is* the sky, and it
    // fills whatever width the viewport has. The container isolates the stacking
    // context, without which this background would paint over the -z-1 noise.
    //
    // The art ships as five segments cut from one 402x965 composition, because a
    // single asset has only one scale knob — fit its height and it's a narrow
    // strip, fit its width and the page is 3x tall.
    //
    // Phones keep that original composition exactly: the box below holds the
    // 402/965 ratio, so every offset here is a straight percentage of the source
    // coordinates (cloud_left sits at x -2, y 219 => left -0.5%, top 22.69%) and
    // the art reassembles pixel-faithfully. From sm up the ratio is dropped and
    // each piece instead anchors to the edge it was drawn to touch, frozen at its
    // natural size, so the clouds still reach the edges without anything scaling.
    <MonotoneNoiseContainer
      className="relative w-full overflow-x-clip bg-[#D3F3FF]"
      noise={{ noiseColor: "rgba(0 0 0 / 0.25)" }}
    >
      <div className="relative aspect-402/965 w-full sm:aspect-auto sm:h-svh sm:min-h-[640px]">
        <img
          src={cloudRight.src}
          alt=""
          aria-hidden
          className="pointer-events-none absolute top-[-0.21%] left-[-0.75%] w-[101.24%] max-w-none translate-x-[5px] sm:top-0 sm:left-auto sm:right-0 sm:w-[407px]"
        />
        <img
          src={cloudLeft.src}
          alt=""
          aria-hidden
          className="pointer-events-none absolute top-[22.69%] left-[-0.5%] w-[48.01%] -translate-x-[5px] sm:left-0 sm:w-[193px]"
        />

        <div className="@container absolute top-[11.4%] left-[2.99%] z-1 w-[93.78%] sm:top-1/2 sm:left-1/2 sm:w-[377px] sm:-translate-x-1/2 sm:-translate-y-1/2">
          <img src={emblem.src} alt="รับเพื่อน ก้าวใหม่" className="w-full" />

          {/* The CTA is drawn into the emblem at x 107.5–294.5, y 612.025–655.025,
            r=12.5 of the original 402x965 space, which this segment crops to a
            "12 110 377 595" viewBox — hence 25.3% in from the left, 84.4% down.
            It was stripped out of the asset so the label stays translatable and
            can swap to a spinner; keep these in sync with the SVG. */}
          <div className="absolute inset-x-[25.2%] top-[84.37%]">
            <Button
              type="button"
              variant="default"
              size="xl"
              className="h-[11.4cqw] w-full rounded-[3.32cqw] border-foreground bg-[#F7EB78] px-0 text-[5.04cqw] hover:bg-[#F7EB78]/80"
              disabled={isResolving}
              onClick={handleGoogleSignIn}
            >
              {isResolving ? (
                <Loader2 className="size-[5.04cqw] animate-spin" />
              ) : (
                t("landing.cta")
              )}
            </Button>
          </div>
        </div>

        <img
          src={plantsLeft.src}
          alt=""
          aria-hidden
          className="pointer-events-none absolute top-[76.06%] left-[-7.46%] w-[55.97%] sm:top-auto sm:bottom-0 sm:left-0 sm:w-[225px]"
        />
        <img
          src={plantsRight.src}
          alt=""
          aria-hidden
          className="pointer-events-none absolute top-[76.17%] left-[52.99%] w-[69.9%] sm:top-auto sm:right-0 sm:bottom-0 sm:left-auto sm:w-[281px]"
        />
      </div>
    </MonotoneNoiseContainer>
  );
}
