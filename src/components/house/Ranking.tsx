import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import { useState } from "react";
import { useT } from "@lib/i18n/useT";
import { Button } from "@components/ui/button";
import stamp from "@assets/images/house/house_ranking_stamp.svg";
import HouseSelector from "./HouseSelector";
import HouseSelectPopup from "./HouseSelectPopup";

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
  const [haveSelectedHouse, setHaveSelectedHouse] = useState<boolean>(false);
  const [selectedHouses, setSelectedHouses] = useState<RankingHouses>({
    house1: null,
    house2: null,
    house3: null,
    house4: null,
    house5: null,
  });
  const rankingKeys: (keyof RankingHouses)[] = [
    "house1",
    "house2",
    "house3",
    "house4",
    "house5",
  ];
  const [activeRank, setActiveRank] = useState<keyof RankingHouses | null>(
    null,
  );
  const t = useT();

  const handleOpenSelector = (rank: keyof RankingHouses) => {
    setActiveRank(rank);
  };

  const handleSubmit = () => {
    // Handle the submission logic here
    console.log("Submit button clicked");
  };

  return (
    <div className="relative flex flex-col items-center gap-4 mt-6">
      <img
        src={stamp.src}
        alt="Stamp"
        className="absolute top-0 left-0 transform translate-y-[-60%] z-10 mx-auto mt-4"
      />
      <MonotoneNoiseContainer className="w-full bg-rpkm-red rounded-4xl border p-4 py-6">
        <h1 className="text-white font-bold text-2xl text-center">
          {t("house.ranking.title")}
        </h1>
        {haveSelectedHouse ? (
          <div className="flex flex-col items-center gap-5 mt-6">
            {/* // map through the houses and display them */}
            <div className="flex flex-col gap-3 w-full">
              {rankingKeys.map((rank, index) => (
                <HouseSelector
                  key={rank}
                  rank={rank}
                  index={index}
                  selectedHouses={selectedHouses}
                  onChangeHouse={handleOpenSelector}
                />
              ))}
            </div>

            <div className="w-full flex flex-row items-center justify-between gap-4">
              <p className="text-rpkm-yellow text-md font-normal whitespace-pre-line">
                {t("house.ranking.houseAnnouncement")}
              </p>
              <Button type="button" size="lg" onClick={() => handleSubmit()}>
                {t("house.ranking.save")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 mt-6">
            <p className="text-rpkm-yellow text-3xl font-normal text-center whitespace-pre-line">
              {t("house.ranking.noHouses")}
            </p>
            <Button
              type="button"
              size="xl"
              className="w-[80%] py-7 text-xl"
              onClick={() => setHaveSelectedHouse(true)}
            >
              {t("house.ranking.selectHouse")}
            </Button>
          </div>
        )}
      </MonotoneNoiseContainer>

      {activeRank && (
        <HouseSelectPopup
          onClose={() => setActiveRank(null)}
          onSelect={(house: string) => {
            setSelectedHouses((prev) => ({
              ...prev,
              [activeRank]: house,
            }));

            setActiveRank(null);
          }}
        />
      )}
    </div>
  );
}
