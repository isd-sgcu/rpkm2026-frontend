import { Button } from "@components/ui/button";
import { HOUSES } from "../../consts/house";

type HouseSelectPopupProps = {
  onClose: () => void;
  onSelect: (house: string) => void;
};

export default function HouseSelectPopup({
  onClose,
  onSelect,
}: HouseSelectPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Select a House</h2>

        <div className="flex flex-col gap-3 mb-6 max-h-[60vh] overflow-y-auto">
          {HOUSES.map((house) => (
            <Button
              key={house.id}
              variant="outline"
              className="w-full text-left justify-start"
              onClick={() => onSelect(house.name.th)}
            >
              {house.name.th}
            </Button>
          ))}
        </div>

        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </div>
  );
}
