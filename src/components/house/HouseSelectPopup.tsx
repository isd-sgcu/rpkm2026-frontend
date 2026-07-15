import { Button } from "@components/ui/button";
import { HOUSES } from "../../consts/house";
import { useState } from "react";
import { Search } from "lucide-react";
import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";

type HouseSelectPopupProps = {
  onClose: () => void;
  onSelect: (house: string) => void;
};

export default function HouseSelectPopup({
  onClose,
  onSelect,
}: HouseSelectPopupProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState<
    "S" | "M" | "L" | "XL" | "XXL"
  >("S");

  const housesInSelectedSize = HOUSES.filter(
    (house) => house.size === selectedSize,
  );

  const filteredHouses = HOUSES.filter((house) => {
    const matchesSearchTh = house.name.th
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesSearchEn = house.name.en
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesSize = house.size === selectedSize;

    return (matchesSearchTh || matchesSearchEn) && matchesSize;
  });
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 gap-5 px-4">
      <div className="flex flex-col justify-center items-center bg-rpkm-beige rounded-4xl border shadow-lg max-w-md w-full">
        {/* search */}
        <div className="relative my-5 w-[70%]">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border bg-white py-2 pl-4 pr-10"
          />

          <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="w-full">
          {/* select size */}
          <div className="flex gap-2 justify-center">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedSize(size as typeof selectedSize)}
                className="w-12 text-rpkm-red rounded-b-none text-lg rounded-t-xl"
              >
                {size.toUpperCase()}
              </Button>
            ))}
          </div>

          {/* list */}
          <div className="flex h-[60vh] flex-col rounded-b-xl bg-rpkm-red p-6 border rounded-4xl">
            {/* Top 20% */}
            <div className="flex-2 border-b border-white/30 pb-4">
              <h2 className="text-2xl font-bold text-white">
                Size {selectedSize}
              </h2>

              <p className="mt-2 text-rpkm-yellow">
                {housesInSelectedSize.length} houses available
              </p>
            </div>

            {/* Bottom 80% */}
            <div className="mt-4 flex-8 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {filteredHouses.map((house) => (
                  <Button
                    key={house.id}
                    variant="outline"
                    className="h-fit p-3 flex-col items-center justify-center bg-rpkm-beige rounded-xl"
                    onClick={() => onSelect(house.name.th)}
                  >
                    <div className="relative">
                      {/* Logo */}
                      <img
                        src={house.logoUrl}
                        alt={house.name.th}
                        className="mb-2 w-full object-contain border rounded-xl"
                      />

                      <MonotoneNoiseContainer className="absolute -translate-y-full w-full border rounded-full bg-rpkm-green font-normal">
                        <span className="text-rpkm-beige">12</span>
                        <span className="text-white">/150</span>
                      </MonotoneNoiseContainer>
                    </div>

                    {/* Name */}
                    <span className="text-center text-sm">{house.name.th}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button
        size="xl"
        onClick={onClose}
        className="w-fit bg-rpkm-red text-white rounded-xl"
      >
        Close
      </Button>
    </div>
  );
}
