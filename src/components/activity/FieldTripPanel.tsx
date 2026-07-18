import { CalendarDays } from "lucide-react";

import { FieldTripCard, type FieldTrip } from "./FieldTripCard";
import { useT } from "@lib/i18n/useT";

const FieldTripPanel = () => {
  const t = useT();

  const fieldTrips: { color: string; data: FieldTrip }[] = [
    {
      color: "#6ABF73",
      data: {
        id: "eco",
        title: t("activity.fieldTripPage.routes.eco.title"),
        description: t("activity.fieldTripPage.routes.eco.description"),
        routes: [
          {
            name: t("activity.fieldTripPage.routes.eco.plantWalk.name"),
            date: t("activity.fieldTripPage.routes.eco.plantWalk.date"),
            time: t("activity.fieldTripPage.routes.eco.plantWalk.time"),
            location: t("activity.fieldTripPage.routes.eco.plantWalk.location"),
            registerUrl: "https://forms.gle/m4y6pyWxjZzU18Si7",
          },
          {
            name: t("activity.fieldTripPage.routes.eco.trashvenger.name"),
            date: t("activity.fieldTripPage.routes.eco.trashvenger.date"),
            time: t("activity.fieldTripPage.routes.eco.trashvenger.time"),
            location: t(
              "activity.fieldTripPage.routes.eco.trashvenger.location",
            ),
            registerUrl: "https://forms.gle/SEHikkUfS1AtM6WP6 ",
          },
        ],
      },
    },
    {
      color: "#73AA7A",
      data: {
        id: "samyan",
        title: t("activity.fieldTripPage.routes.samyan.title"),
        description: t("activity.fieldTripPage.routes.samyan.description"),
        routes: [
          {
            date: t("activity.fieldTripPage.routes.samyan.date"),
            time: t("activity.fieldTripPage.routes.samyan.time"),
            location: t("activity.fieldTripPage.routes.samyan.location"),
          },
        ],
        registerUrl: "https://forms.gle/NNYTJkRN1Cuid3us7 ",
      },
    },
    {
      color: "#638C68",
      data: {
        id: "campus",
        title: t("activity.fieldTripPage.routes.campus.title"),
        description: t("activity.fieldTripPage.routes.campus.description"),
        routes: [
          {
            date: t("activity.fieldTripPage.routes.campus.date"),
            time: t("activity.fieldTripPage.routes.campus.time"),
            location: t("activity.fieldTripPage.routes.campus.location"),
          },
        ],
        registerUrl: "https://forms.gle/t2Rc3aBZPDGwNZtd7",
      },
    },
  ];

  return (
    <>
      <div className="w-full flex items-left">
        <header className="relative z-10 text-left">
          <h1 className="text-2xl font-bold">
            {t("activity.fieldTripPage.title")}
          </h1>
          <p className="text-xs font-normal my-1 leading-normal">
            {t("activity.fieldTripPage.description1")}
            <br />
            {t("activity.fieldTripPage.description2")}
          </p>
          <div className="flex flex-col items-left">
            <p className="flex items-start gap-1 text-xs font-normal leading-normal">
              <CalendarDays className="size-4.5 shrink-0 text-black" />
              {t("activity.fieldTripPage.registrationNote")}
              <br />
            </p>
            <p className="flex items-start gap-1 text-xs font-normal leading-normal">
              <CalendarDays className="mt-1.5 size-4.5 shrink-0 text-black" />
              {t("activity.fieldTripPage.activityNote")} <br />{" "}
              {t("activity.fieldTripPage.activityNoteDetail")}
            </p>
          </div>
        </header>
      </div>
      <div className="w-full flex items-left my-4">
        <header className="relative z-10 text-left">
          <h1 className="text-xl font-bold">
            {t("activity.fieldTripPage.chooseTitle")}
          </h1>
          <p className="flex items-start gap-1 text-xs font-normal leading-normal">
            {t("activity.fieldTripPage.chooseNote1")}
            <br />
            {t("activity.fieldTripPage.chooseNote2")}
          </p>
        </header>
      </div>

      <div className="flex w-full flex-col items-center gap-6 pb-8">
        {fieldTrips.map(({ color, data }) => (
          <FieldTripCard key={data.id} fieldTrip={data} color={color} />
        ))}
      </div>
    </>
  );
};

export default FieldTripPanel;
