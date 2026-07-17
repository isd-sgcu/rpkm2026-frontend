import { useT } from "@lib/i18n/useT";
import { useState } from "react";

// Physical QR codes encode /qrquest/questNN(?code=...). That route does not
// exist, so the request lands here; redirect to the real scan page, carrying
// any query string (e.g. ?code=...) through.
const QUEST_PATH_PATTERN = /^\/qrquest\/quest\d+\/?$/;

export function NotFoundOrQrQuestFallback() {
  // Lazy initializer (not an effect): this page is only ever hydrated
  // client-side for the /qrquest/* case that matters, so reading the real
  // URL directly during render avoids a setState-in-effect render cascade.
  const [path] = useState(() =>
    typeof window !== "undefined" ? window.location.pathname : null,
  );
  const t = useT();

  if (path === null) return null;

  if (QUEST_PATH_PATTERN.test(path)) {
    window.location.replace(`/qrquest/scan${window.location.search}`);
    return null;
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
