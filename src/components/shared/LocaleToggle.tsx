import { useStore } from "@nanostores/react";

import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { $locale, setLocale } from "@lib/i18n/locale";

export function LocaleToggle({ className }: { className?: string }) {
  const locale = useStore($locale);
  const other = locale === "th" ? "en" : "th";

  return (
    <Button
      type="button"
      variant="outline"
      aria-label={`Switch language to ${other.toUpperCase()}`}
      className={cn(
        "size-10.5 rounded border-none p-2 text-lg active:bg-accent",
        className,
      )}
      onClick={() => setLocale(other)}
    >
      {locale.toUpperCase()}
    </Button>
  );
}
