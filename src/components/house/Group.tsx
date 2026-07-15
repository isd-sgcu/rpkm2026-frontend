import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
// import Image from "astro/components/Image.astro";
import Logo from "@assets/images/house/house_group_logo.svg";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

// type GroupProps = {
//   group_id: string;
//   group_name: string;
// };

export default function Group() {
  return (
    <div>
      <MonotoneNoiseContainer className="flex flex-col items-center bg-rpkm-light-pink rounded-4xl border px-10 py-6 gap-5">
        <img src={Logo.src} alt="Group Logo" className="mx-auto" />
        <Button type="button" size="xl" className="w-[80%] py-10 text-xl">
          สร้างห้อง
        </Button>

        <div className="flex flex-row items-center border-black w-full border-2 py-5 px-5 bg-white rounded-full">
          <Input placeholder="โปรดกรอกรหัสห้อง" className="text-lg flex-1" />

          {/* <img 
            src={SendIcon.src}
            alt="Send Icon"
            className="w-10 h-10"
          /> */}
        </div>
      </MonotoneNoiseContainer>
    </div>
  );
}
