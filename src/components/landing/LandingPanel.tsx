import topLanding from "@assets/images/top_landing.svg";
import centerLanding from "@assets/images/center_landing.svg";
import { Button } from "@components/ui/button";
import { MonotoneNoise } from "@components/shared/MonotoneNoise";

export function LandingPanel({ staff = false }: { staff?: boolean }) {
  return (
    <div className="relative flex w-full flex-col self-start overflow-x-clip bg-background pb-20.5">
      {/* noise ? */}
      <MonotoneNoise
        noiseColor="rgba(0 0 0 / 0.25)"
        className="pointer-events-none absolute inset-0 -z-1"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-1 flex justify-between">
        <img src={topLanding.src} alt="" className="w-32" />
        <img src={topLanding.src} alt="" className="w-32 -scale-x-100" />
      </div>

      {/* staff header */}
      {staff && (
        <div className="relative z-2 pt-24 text-center">
          <p className="text-2xl/9">RPKM</p>
          <p className="text-2xl/9 font-bold">For Staff</p>
        </div>
      )}

      <div className={`relative z-2 px-4 ${staff ? "mt-10" : "mt-28"}`}>
        <div className="@container relative mx-auto w-full max-w-92.5">
          <img
            src={centerLanding.src}
            alt="รับเพื่อน ก้าวใหม่"
            className="w-full"
          />
          <a
            href="/login"
            className="absolute inset-x-0 bottom-[6.28%] flex justify-center"
          >
            <Button
              variant="default"
              size="xl"
              className="h-[13.24cqw] w-[54.9cqw] px-0 text-[5.55cqw]"
            >
              เข้าสู่ระบบ
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
