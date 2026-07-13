import isdLogo from "@assets/images/isd_logo.png";
import อบจLogo from "@assets/images/อบจ.png";
import instagramIcon from "@assets/images/instagram_icon.svg";
import pot1Image from "@assets/images/artboard_15.svg";
import pot2Image from "@assets/images/artboard_16.svg";
import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";

export function Footer() {
  return (
    <footer className="w-full overflow-x-clip relative z-0">
      <div className="w-full sm:max-w-140 mx-auto overflow-x-clip sm:overflow-x-visible relative flex justify-center">
        <img
          src={pot2Image.src}
          alt="decoration"
          className="w-42 sm:w-54 absolute left-0 bottom-0 rotate-23 translate-x-[-40%] translate-y-[48%] z-1"
        />
        <img
          src={pot1Image.src}
          alt="decoration"
          className="w-42 sm:w-54 absolute right-0 bottom-0 translate-x-[37%] sm:translate-x-[52%] translate-y-[37%] z-1"
        />
      </div>
      <MonotoneNoiseContainer className="bg-rpkm-green/79 flex flex-col items-center text-center gap-3 p-4 pb-7 pt-12">
        <div className="flex gap-3">
          <img src={isdLogo.src} alt="isd logo" className="size-11" />
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
          <a
            className="flex flex-col items-center gap-1"
            href="https://www.instagram.com/isd.sgcu/"
          >
            <img src={instagramIcon.src} alt="isd logo" className="size-8" />
            <span>Instagram</span>
          </a>
        </div>
      </section>
    </footer>
  );
}
