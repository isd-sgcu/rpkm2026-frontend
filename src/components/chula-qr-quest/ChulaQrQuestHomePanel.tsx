import { Calendar, MapPin } from "lucide-react";
import type MapLibreGL from "maplibre-gl";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@nanostores/react";
import { buttonVariants } from "@components/ui/button";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from "@components/ui/map";
import { QueryProvider } from "@components/shared/QueryProvider";
import { useT } from "@lib/i18n/useT";
import { $locale } from "@lib/i18n/locale";
import { cn } from "@lib/utils";
import { getGameProgress } from "@lib/api/games";
import scanIcon from "@assets/images/scan.svg";
import positions from "@components/chula-qr-quest/position.json";
import rpkmMapStyle from "@components/chula-qr-quest/map-style.json";

interface StampPosition {
  id: string;
  nameTh: string;
  nameEn: string;
  lat: number;
  lng: number;
}

const stampPositions = positions as StampPosition[];
const mapStyle = rpkmMapStyle as MapLibreGL.StyleSpecification;

// Center of the Chulalongkorn University area
const MAP_CENTER: [number, number] = [100.5296, 13.7367];

const ChulaQrQuestHomePanel = () => {
  return (
    <QueryProvider>
      <ChulaQrQuestHomePanelContent />
    </QueryProvider>
  );
};

function ChulaQrQuestHomePanelContent() {
  const t = useT();
  const locale = useStore($locale);
  const { data: progress } = useQuery({
    queryKey: ["chula-qr-quest-progress"],
    queryFn: () => getGameProgress("csr"),
  });
  const collectedIds = new Set(
    (progress?.collected ?? []).map((entry) => entry.checkpointId),
  );

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col items-center gap-1 text-center text-rpkm-red">
        <h1 className="text-xl font-bold">{t("chulaQrQuest.home.title1")}</h1>
        <h1 className="text-3xl font-bold">{t("chulaQrQuest.home.title2")}</h1>
      </div>

      <p className="text-center text-sm font-bold text-wrap whitespace-normal text-foreground">
        {t("chulaQrQuest.home.subtitle")}
      </p>

      <div className="flex items-center justify-center gap-2 text-sm font-bold text-foreground">
        <Calendar className="size-4" />
        {t("chulaQrQuest.home.dateRange")}
      </div>

      <a
        href="/qrquest/reward"
        className={cn(
          buttonVariants({ variant: "default", size: "sm" }),
          "mx-auto w-fit rounded-full",
        )}
      >
        {t("chulaQrQuest.home.rewardButton")}
      </a>

      <div className="relative aspect-9/16 w-full overflow-hidden rounded-3xl border border-foreground">
        <Map
          center={MAP_CENTER}
          zoom={15}
          styles={{ light: mapStyle, dark: mapStyle }}
        >
          <MapControls showZoom />

          {stampPositions.map((position) => (
            <MapMarker
              key={position.id}
              longitude={position.lng}
              latitude={position.lat}
            >
              <MarkerContent>
                <MapPin
                  className={cn(
                    "size-6 text-foreground",
                    collectedIds.has(position.id)
                      ? "fill-rpkm-red"
                      : "fill-muted-foreground",
                  )}
                />
              </MarkerContent>
              <MarkerPopup>
                <p className="font-bold">
                  {locale === "th" ? position.nameTh : position.nameEn}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${position.lat},${position.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "mt-2 w-full",
                  )}
                >
                  {t("chulaQrQuest.home.openInMaps")}
                </a>
              </MarkerPopup>
            </MapMarker>
          ))}
        </Map>
      </div>

      <a
        href="/qrquest/scan"
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "mx-auto w-fit gap-2 rounded-full",
        )}
      >
        <img src={scanIcon.src} alt="" className="size-5" />
        {t("chulaQrQuest.home.scanButton")}
      </a>
    </div>
  );
}

export default ChulaQrQuestHomePanel;
