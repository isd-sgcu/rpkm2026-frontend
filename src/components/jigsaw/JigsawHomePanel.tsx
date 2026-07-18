import { ScanLine, CalendarDays, CircleAlert } from "lucide-react";

import { JigsawPanel } from "./JigsawPanel";

/**
 * Home panel for the jigsaw activity: the bilingual header, the interactive
 * collection panel, and the link to the scan page.
 */
export function JigsawHomePanel() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <header className="flex flex-col items-center text-center">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold">กิจกรรมสะสมจิกซอร์</h1>
          <h1 className="text-3xl font-bold">Chula Jigsaw Journey</h1>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-base font-bold">สะสมชิ้นส่วน Digital Jigsaw</h2>
          <h2 className="text-base font-bold">
            จากสถานที่สำคัญรอบจุฬาฯ พร้อมรับรางวัลเมื่อสะสมครบ
          </h2>
        </div>
        <div className="flex flex-col items-center">
          <p className="flex items-start gap-1 text-base font-normal">
            <CalendarDays className="mt-0.5 size-[18px] shrink-0 text-black" />
            20 กรกฎาคม - 3 สิงหาคม
          </p>
          <p className="flex items-start gap-1 text-base font-normal">
            <CircleAlert className="mt-0.5 size-[18px] shrink-0 text-black" />
            เข้าร่วมเฉพาะนิสิตชั้นปี 1 หรือรหัส CU110
          </p>
        </div>
      </header>

      <a
        href="/jigsaw/placeinfo"
        className="flex w-[159px] h-[33px] items-center justify-center gap-[8px] rounded-lg border border-foreground p-[16px] text-center font-bold size-base bg-rpkm-yellow"
      >
        รายละเอียดสถานที่
      </a>

      <JigsawPanel />

      <a
        href="/jigsaw/scan"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-solid border-gray-400 py-3 text-center font-bold"
      >
        <ScanLine className="size-24px" />
        สแกนเพื่อรับชิ้นส่วน
      </a>
    </div>
  );
}
