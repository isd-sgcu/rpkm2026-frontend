import { useT } from "@lib/i18n/useT";
import { CalendarDaysIcon, CircleAlertIcon } from "lucide-react";

export default function MyFreshyStory() {
  const t = useT();

  return (
    <header className="w-full px-6">
      <h1 className="text-4xl font-bold">My Freshy Story</h1>
      <p className="font-bold text-lg mt-4 mb-2">
        {t("myfreshystory.header.description")}
      </p>
      <section className="*:font-bold *:flex *:items-center *:gap-1">
        <p>
          <CalendarDaysIcon />
          {t("myfreshystory.header.date")}
        </p>
        <p>
          <CircleAlertIcon />
          {t("myfreshystory.header.caution")}
        </p>
      </section>
    </header>
  );
}
