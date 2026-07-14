import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import { useState } from "react";
import { useT } from "@lib/i18n/useT";
import { Button } from "@components/ui/button";
import stamp from "@assets/images/house/house_ranking_stamp.svg";

export type RankingHouses = {
  house1: string | null;
  house2: string | null;
  house3: string | null;
  house4: string | null;
  house5: string | null;
};

export type RankingProps = {
  houses: RankingHouses;
};

export default function Ranking() {
  const [selectedHouse, setSelectedHouse] = useState<boolean>(false);
  const t = useT();

  return (
    <div className="relative flex flex-col items-center gap-4 mt-6">
      <img
        src={stamp.src}
        alt="Stamp"
        className="absolute top-0 left-0 transform translate-y-[-60%] z-10 mx-auto mt-4"
      />
      <MonotoneNoiseContainer className="w-full bg-rpkm-red rounded-4xl border p-4 py-6">
        <h1 className="text-white font-bold text-2xl text-center">
          {" "}
          {t("house.ranking.title")}{" "}
        </h1>
        {selectedHouse ? (
          <div className="flex flex-col items-center gap-5 mt-6">
            <p className="text-white text-lg">You selected: {selectedHouse}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 mt-6">
            <p className="text-rpkm-yellow text-3xl font-normal text-center whitespace-pre-line">
              {" "}
              {t("house.ranking.noHouses")}{" "}
            </p>
            <Button
              type="button"
              size="xl"
              className="w-[80%] py-7 text-xl"
              onClick={() => setSelectedHouse(true)}
            >
              {t("house.ranking.selectHouse")}
            </Button>
          </div>
        )}
      </MonotoneNoiseContainer>
    </div>
  );
}
