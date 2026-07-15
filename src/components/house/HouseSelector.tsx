import houseicon from "@assets/icons/house_orange.svg";
import selectHouseIcon from "@assets/icons/house_select.svg";
import type { RankingHouses } from "./Ranking";
// import { useState } from "react";
import { HOUSES } from "../../consts/house";

type HouseSelectorProps = {
  rank: keyof RankingHouses;
  index: number;
  selectedHouses: RankingHouses;
  onChangeHouse: (rank: keyof RankingHouses) => void;
};

export default function HouseSelector({
  rank,
  index,
  selectedHouses,
  onChangeHouse,
}: HouseSelectorProps) {
  //   const [selectedHouse, setSelectedHouse] = useState<string | null>(
  //     selectedHouses[rank],
  //   );
  const houseData = HOUSES.find(
    (house) => house.name.th === selectedHouses[rank],
  );
  const size = houseData?.size.toLowerCase();

  return (
    <div
      key={rank}
      className="flex items-center justify-center bg-white border border-black rounded-full p-3"
      onClick={() => onChangeHouse(rank)}
    >
      {selectedHouses[rank] ? (
        <div className="flex flex-col items-center">
          <h2
            className={`text-black text-lg ${
              index === 0 ? "font-bold" : "font-normal"
            }`}
          >
            {selectedHouses[rank]}
          </h2>
          <span className="flex flex-row gap-2 text-rpkm-red text-sm">
            <img src={houseicon.src} alt="house" className="w-4 h-4" /> หมู่บ้าน{" "}
            {size}
          </span>
        </div>
      ) : (
        <img
          src={selectHouseIcon.src}
          alt="select house"
          className="w-12 h-12"
        />
      )}
    </div>
  );
}
