import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import Logo from "@assets/images/house/house_group_logo.svg";
import SendIcon from "@assets/icons/send.svg";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

// type GroupProps = {
//   group_id: string;
//   group_name: string;
// };

export default function Group() {
  return (
    <MonotoneNoiseContainer
      noise={{
        noiseSize: 0.7,
        noiseDensity: 20,
        noiseColor: "rgba(0 0 0 / 0.59)",
        noiseSeed: 7087,
      }}
      className="flex w-full flex-col items-center gap-6 rounded-[29px] border border-foreground bg-[#f1aacc] px-8 py-5"
    >
      <img
        src={Logo.src}
        alt="จับกลุ่มคู่หู"
        width={109}
        height={75}
        className="mx-auto"
      />

      <Button
        type="button"
        size="xl"
        className="h-17.5 w-[85%] rounded-full border-foreground text-2xl"
      >
        สร้างห้อง
      </Button>

      <div className="relative w-full">
        <Input
          placeholder="โปรดกรอกรหัสห้อง"
          className="h-13.5 rounded-full border-foreground bg-background px-13 text-center"
        />
        <button
          type="button"
          aria-label="เข้าร่วมห้อง"
          className="absolute top-1/2 right-4 -translate-y-1/2"
        >
          <img src={SendIcon.src} alt="" className="size-6" />
        </button>
      </div>
    </MonotoneNoiseContainer>
  );
}
