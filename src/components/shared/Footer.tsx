import isdLogo from "@assets/images/isd_logo.png";
import อบจLogo from "@assets/images/อบจ.png";
import instagramIcon from "@assets/images/instagram_icon.svg";
import pot1Image from "@assets/images/artboard_15.svg";
import pot2Image from "@assets/images/artboard_16.svg";
import hillImage from "@assets/images/bottom_landing.svg";
import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";

export type FooterVariant = "default" | "landing";

function DefaultDecoration() {
  return (
    <div className="w-full sm:max-w-140 mx-auto overflow-x-clip sm:overflow-x-visible relative flex justify-center">
      <img
        src={houseImage.src}
        alt="decoration"
        className="min-w-[40vw] w-132 max-w-[103vw] absolute bottom-0 translate-y-[15%] z-1"
      />
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
  );
}

function LandingDecoration() {
  return (
    <div className="relative mt-[-16.92%] aspect-402/200 w-full overflow-hidden">
      <img
        src={hillImage.src}
        alt=""
        className="absolute inset-x-0 top-[58.5%] w-full"
      />
      <img
        src={pot2Image.src}
        alt="decoration"
        className="absolute bottom-0 left-0 w-[80%] translate-x-[-40%] translate-y-[40%]"
      />
      <img
        src={pot2Image.src}
        alt="decoration"
        className="absolute right-0 bottom-0 w-[80%] translate-x-1/2 translate-y-[40%]"
      />
    </div>
  );
}

export function Footer({ variant = "default" }: { variant?: FooterVariant }) {
  const landing = variant === "landing";

  return (
    // The landing's decoration reaches up past the footer into main, which is z-1, so
    // this has to outrank it or main's background paints over the planters.
    <footer
      className={`w-full overflow-x-clip relative ${landing ? "z-2" : "z-0"}`}
    >
      {landing ? <LandingDecoration /> : <DefaultDecoration />}
      <MonotoneNoiseContainer
        className={`bg-rpkm-green/79 flex flex-col items-center text-center gap-3 px-4 pt-11 pb-6 ${
          landing ? "border-t" : ""
        }`}
      >
        <div className="flex gap-3">
          <img src={isdLogo.src} alt="isd logo" className="size-11" />
          <img src={อบจLogo.src} alt="อบจ logo" className="size-11" />
        </div>
        <span className="">
          พัฒนาโดยฝ่ายพัฒนาระบบสารสนเทศ <br />
          องค์การบริหารสโมสรนิสิตจุฬาลงกรณ์มหาวิทยาลัย
        </span>
        <hr className="w-20" />
        <span className="text-xs md:text-sm">
          Developed by Information System Development {"<ISD>"}, <br />
          Student Government Chulalongkorn University
        </span>
      </MonotoneNoiseContainer>
      <section className="border-t bg-[#D3F3FF] px-4 pt-2.5 pb-2 flex flex-col items-center">
        <h3 className="text-lg font-bold"> Contact us </h3>
        <div className="flex text-center gap-7 text-xs mt-0.5">
          <a
            className="flex flex-col items-center gap-1"
            href="https://isd.sgcu.in.th/"
          >
            <img src={isdLogo.src} alt="isd logo" className="size-7" />
            <span>Website</span>
          </a>
          <a
            className="flex flex-col items-center gap-1"
            href="https://www.instagram.com/isd.sgcu/"
          >
            <img src={instagramIcon.src} alt="instagram" className="size-7" />
            <span>Instagram</span>
          </a>
        </div>
      </section>
    </footer>
  );
}
