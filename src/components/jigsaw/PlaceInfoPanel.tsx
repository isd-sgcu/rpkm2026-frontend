import { CircleAlert } from "lucide-react";
import { PlaceInfoCard } from "./PlaceInfoCard";
import { useT } from "@lib/i18n/useT";
/**
 * Placeholder photos for each place, keyed by number (1..10). Reuses the piece
 * artwork (jigsaw_<n>.png) until real place photos exist. `import.meta.glob`
 * needs a literal relative pattern, so the "@assets" alias can't be used here.
 * TODO: replace with the actual place photos.
 */
const photoModules = import.meta.glob<{ default: ImageMetadata }>(
  "../../assets/images/place/place_*.png",
  { eager: true },
);

const photoByNumber: Record<number, string> = {};
for (const [path, module] of Object.entries(photoModules)) {
  const n = Number(path.match(/place_(\d+)\.png$/)?.[1]);
  if (n) photoByNumber[n] = module.default.src;
}

/**
 * The ten Chula Jigsaw Journey places, in board order (1..10). Only the display
 * title is kept here — the sensitive point/QR fields from jigsawtesting.json are
 * deliberately not imported into this client component. Put the exact Google
 * Maps link for each place in its `mapUrl` field.
 * TODO: fill in each mapUrl and swap the placeholder photos for real ones.
 */
const PLACES = [
  {
    title: "jigsaw.info.loc1",
    mapUrl: "https://maps.app.goo.gl/EAV9zKPWMGMV3wPc6",
  },
  {
    title: "jigsaw.info.loc2",
    mapUrl: "https://maps.app.goo.gl/3Ka6bH3UH2Viurfi8",
  },
  {
    title: "jigsaw.info.loc3",
    mapUrl: "https://maps.app.goo.gl/wux3wsUxhdZiXJs67",
  },
  {
    title: "jigsaw.info.loc4",
    mapUrl: "https://maps.app.goo.gl/K6p5fqdGrWC4RzbB6",
  },
  {
    title: "jigsaw.info.loc5",
    mapUrl: "https://maps.app.goo.gl/3rCgadm7rzy8n4zL8",
  },
  {
    title: "jigsaw.info.loc6",
    mapUrl: "https://maps.app.goo.gl/EFZi8jAQpEY2DATu6",
  },
  {
    title: "jigsaw.info.loc7",
    mapUrl: "https://maps.app.goo.gl/DxWd3vSAG28dSvZy6",
  },
  {
    title: "jigsaw.info.loc8",
    mapUrl: "https://maps.app.goo.gl/iofZzaKnrnrWjgDQ9",
  },
  {
    title: "jigsaw.info.loc9",
    mapUrl: "https://maps.app.goo.gl/tryrBcNrajaDiTWe7",
  },
  {
    title: "jigsaw.info.loc10",
    mapUrl: "https://maps.app.goo.gl/Agp8t2jpXyao9jkN7",
  },
].map((place, i) => ({
  ...place,
  image: photoByNumber[i + 1],
}));

/**
 * The list of place cards shown on the jigsaw place-info page: all ten places
 * stacked vertically, each rendered as a {@link PlaceInfoCard}.
 */
export function PlaceInfoPanel() {
  const t = useT();

  return (
    <div className="flex w-full flex-col gap-5">
      {PLACES.map((place) => {
        // `title` holds an i18n key (e.g. "jigsaw.info.loc1"); t() resolves it to
        // the current locale. Titles not yet migrated to a key are returned as-is
        // by useT, so the array can be converted one entry at a time.
        const title = t(place.title as Parameters<typeof t>[0]);
        return (
          <PlaceInfoCard
            key={place.title}
            image={place.image}
            title={title}
            mapUrl={place.mapUrl}
            imageAlt={title}
          />
        );
      })}
    </div>
  );
}

export const PlaceInfoHeader = () => {
  const t = useT();

  return (
    <div className="flex flex-col items-start gap-1">
      <h1 className="text-3xl font-bold whitespace-pre-line">
        {t("jigsaw.info.title")}
      </h1>
      <p className="flex items-center gap-1.5 text-base font-normal">
        <CircleAlert className="size-5 shrink-0" />
        {t("jigsaw.info.note")}
      </p>
    </div>
  );
};
