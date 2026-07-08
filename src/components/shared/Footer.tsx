import isdLogo from "@assets/images/isd_logo.svg";
import อบจLogo from "@assets/images/อบจ.svg";
import instagramIcon from "@assets/images/instagram_icon.svg";
import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";

export function Footer() {
  return (
    <footer className="w-full">
      <MonotoneNoiseContainer className="bg-rpkm-green/79 flex flex-col items-center text-center gap-3 p-4 pb-7 pt-12">
        <div className="flex gap-3">
          <img src={isdLogo.src} alt="isd logo" className="size-11" />
          {/* TODO(ongsalt): find better อบจ logo, bitmap is fine. */}
          <img src={อบจLogo.src} alt="อบจ logo" className="size-11" />
        </div>
        <span className="">
          พัฒนาโดยฝ่ายพัฒนาระบบสารสนเทศ <br />
          องค์การบริหารสโมสรนิสิตจุฬาลงกรณ์มหาวิทยาลัย
        </span>
        <hr className="w-22" />
        <span className="text-xs md:text-sm">
          Developed by Information System Development {"<ISD>"}, <br />
          Student Government Chulalongkorn University
        </span>
      </MonotoneNoiseContainer>
      <section className="border-t bg-[#D3F3FF] p-4 flex flex-col items-center">
        <h3 className="text-lg font-bold"> Contact us </h3>
        <div className="grid grid-cols-2 text-center gap-1 text-xs mt-2">
          <a
            className="flex flex-col items-center gap-1"
            href="https://isd.sgcu.in.th/"
          >
            <img src={isdLogo.src} alt="isd logo" className="size-8" />
            <span>Website</span>
          </a>
          {/* TODO(ongsalt): ig ไหนหว่า */}
          <a
            className="flex flex-col items-center gap-1"
            href="https://isd.sgcu.in.th/"
          >
            <img src={instagramIcon.src} alt="isd logo" className="size-8" />
            <span>Instagram</span>
          </a>
        </div>
      </section>
    </footer>
  );
}
