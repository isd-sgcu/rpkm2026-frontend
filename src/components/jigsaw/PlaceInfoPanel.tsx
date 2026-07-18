import { PlaceInfoCard } from "./PlaceInfoCard";

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
    title: "สำนักงานวิทยทรัพยากร จุฬาลงกรณ์มหาวิทยาลัย",
    mapUrl: "https://maps.app.goo.gl/EAV9zKPWMGMV3wPc6",
  },
  {
    title: "อาคารจามจุรี 9",
    mapUrl: "https://maps.app.goo.gl/3Ka6bH3UH2Viurfi8",
  },
  {
    title: "อุทยาน 100 ปี จุฬาลงกรณ์มหาวิทยาลัย",
    mapUrl: "https://maps.app.goo.gl/wux3wsUxhdZiXJs67",
  },
  {
    title: "ศาลเจ้าพ่อเสือ ตั่วเหล่าเอี๊ย สามย่าน",
    mapUrl: "https://maps.app.goo.gl/K6p5fqdGrWC4RzbB6",
  },
  {
    title: "ตึกจักรพงษ์ (หอประวัติจุฬาลงกรณ์มหาวิทยาลัย)",
    mapUrl: "https://maps.app.goo.gl/3rCgadm7rzy8n4zL8",
  },
  {
    title: "ศาลเจ้าแม่ทับทิม สะพานเหลือง",
    mapUrl: "https://maps.app.goo.gl/EFZi8jAQpEY2DATu6",
  },
  {
    title: "อาคารเฉลิมราชสุดากีฬาสถาน",
    mapUrl: "https://maps.app.goo.gl/DxWd3vSAG28dSvZy6",
  },
  {
    title: "CU Plearn Space",
    mapUrl: "https://maps.app.goo.gl/iofZzaKnrnrWjgDQ9",
  },
  {
    title: "ศาลาพระเกี้ยว",
    mapUrl: "https://maps.app.goo.gl/tryrBcNrajaDiTWe7",
  },
  {
    title: "อาคารมหาจุฬาลงกรณ์",
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
  return (
    <div className="flex w-full flex-col gap-5">
      {PLACES.map((place) => (
        <PlaceInfoCard
          key={place.title}
          image={place.image}
          title={place.title}
          mapUrl={place.mapUrl}
          imageAlt={place.title}
        />
      ))}
    </div>
  );
}
