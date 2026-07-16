import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { NavigationMenu } from "@components/shared/NavigationMenu";
import ChulaQrQuestScanPanel from "@components/chula-qr-quest/scan/ChulaQrQuestScanPanel";
import { useT } from "@lib/i18n/useT";
import header from "@assets/images/chula_qr_quest_header.svg";

function ChulaQrQuestChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-w-0 min-h-200">
      <div className="absolute left-0 right-0 top-0 grid place-items-center">
        <img
          src={header.src}
          alt="rpkm chula qr quest header"
          className="w-full"
        />
      </div>

      <div className="absolute left-4 top-[4.5cqw] sm:top-4.5 h-10 flex items-center z-10">
        <a
          href="/qrquest"
          className="size-10 rounded-full bg-white border border-black grid place-items-center"
        >
          <ChevronLeft className="size-6.5 text-foreground" />
        </a>
      </div>

      <div className="absolute right-4 top-[2.5cqw] sm:top-2.5 z-10 flex items-center">
        <NavigationMenu showBorder />
      </div>

      <div className="relative flex flex-col px-[1.25em] pt-[24cqw] pb-8 sm:pt-24">
        {children}
      </div>
    </div>
  );
}

export function NotFoundOrQrQuestFallback() {
  // Lazy initializer (not an effect): this page is only ever hydrated
  // client-side for the /qrquest/* case that matters, so reading the real
  // URL directly during render avoids a setState-in-effect render cascade.
  const [path] = useState(() =>
    typeof window !== "undefined" ? window.location.pathname : null,
  );
  const t = useT();

  if (path === null) return null;

  if (path.startsWith("/qrquest/")) {
    return (
      <ChulaQrQuestChrome>
        <ChulaQrQuestScanPanel />
      </ChulaQrQuestChrome>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="text-2xl font-bold">{t("notFound.title")}</h1>
      <a href="/" className="underline">
        {t("notFound.backHome")}
      </a>
    </div>
  );
}
