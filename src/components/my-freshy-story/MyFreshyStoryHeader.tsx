import { useT } from "@lib/i18n/useT";
import { CalendarDaysIcon, CircleAlert } from "lucide-react";

export default function MyFreshyStory() {
  const t = useT();

  return (
    <header className="w-full px-6">
      <h1 className="w-2/3 text-4xl font-bold">My Freshy Story</h1>
      <p className="font-bold text-lg mt-4 mb-2">
        {t("myfreshystory.header.description")}
      </p>
      <section>
        <p>
          <CalendarDaysIcon className="inline mr-1" />
          {t("myfreshystory.header.date")}
        </p>
        <p>
          <CircleAlert className="inline mr-1" />
          {t("myfreshystory.header.caution")}
        </p>
      </section>
    </header>
  );
}
