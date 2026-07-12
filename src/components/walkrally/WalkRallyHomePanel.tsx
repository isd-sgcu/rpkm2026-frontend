import { Plus } from "lucide-react";
import { useT } from "@lib/i18n/useT";
import { MonotoneNoise } from "@components/shared/MonotoneNoise";
import { RegisteredActivityCard } from "@components/walkrally/RegisteredActivityCard";

const ACCENT_ORANGE = "#e65325";

// TODO: replace with real user/auth data
const mockProfile = {
  studentId: "690282282",
  name: "คิตตี้ คุกิมิยะ",
  faculty: "คณะวิศวกรรมศาสตร์",
  points: 0,
};

// TODO: replace with real registration data
const mockRegisteredActivities = [
  {
    id: "lookchoop",
    name: "Lookchoop",
    description:
      "ปั้นความสนุก แต่งแต้มสีสันกับ Workshop ลูกชุบ ที่จะเปลี่ยนถั่วกวนธรรมดา",
    round: 1,
    start: "12:00",
    end: "12:30",
    ticketNumber: "12",
    imageName: "lookchoop.png",
    accentColor: "#e65325",
  },
  {
    id: "cu-museum",
    name: "Chulalongkorn University Museum",
    description:
      "หอประวัติศาสตร์และองค์ความรู้ ที่สร้างคุณค่าเพื่อสังคม จากอดีตสู่ปัจจุบัน",
    round: 4,
    start: "14:20",
    end: "14:50",
    ticketNumber: "08",
    imageName: "cumuseum.png",
    accentColor: "#5fa667",
  },
  {
    id: "mini-games",
    name: "Mini Games",
    description:
      "ร่วมสนุกกับ 1 ใน 6 บอร์ดเกม พร้อมสร้างมิตรภาพผ่านทุกทุกกิจกรรม",
    round: 2,
    start: "12:35",
    end: "13:05",
    ticketNumber: "05",
    accentColor: "#8b688d",
  },
];

export function WalkRallyHomePanel() {
  const t = useT();

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-[4.5cqw] flex h-10 items-center justify-center text-xl font-bold text-foreground sm:top-4.5">
        {t("walkrally.home.title")}
      </div>

      <div className="flex flex-col gap-8 px-4">
        <div className="relative isolate flex min-h-28 items-center gap-3 overflow-hidden rounded-3xl border border-black bg-background p-3">
          <MonotoneNoise className="absolute inset-0 -z-1 pointer-events-none" />

          <div
            className="relative isolate size-16 shrink-0 overflow-hidden rounded-full border border-black p-1"
            style={{ backgroundColor: ACCENT_ORANGE }}
          >
            <MonotoneNoise className="absolute inset-0 -z-1 pointer-events-none" />
            <div className="size-full overflow-hidden rounded-full border border-black bg-muted" />
          </div>

          <div className="min-w-0 flex-1">
            <span className="inline-block text-sm rounded-full border border-black bg-rpkm-light-pink px-2 py-0.5 text-[0.65rem] font-bold text-foreground">
              {mockProfile.studentId}
            </span>
            <div className="mt-3 truncate text-xl font-bold text-foreground">
              {mockProfile.name}
            </div>
            <div className="truncate text-base text-muted-foreground">
              {mockProfile.faculty}
            </div>
          </div>

          <div
            className="relative isolate shrink-0 overflow-hidden rounded-2xl border border-black p-1"
            style={{ backgroundColor: ACCENT_ORANGE }}
          >
            <MonotoneNoise className="absolute inset-0 -z-1 pointer-events-none" />
            <div className="flex flex-col items-center justify-center gap-0.5 rounded-xl border border-black bg-rpkm-green px-3 py-2 text-background">
              <span className="text-[0.6rem] font-bold">
                {t("walkrally.home.pointsLabel")}
              </span>
              <span className="text-2xl leading-none font-bold">
                {mockProfile.points}
              </span>
              <span className="text-[0.6rem] font-bold">
                {t("walkrally.home.pointsUnit")}
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground">
          {t("walkrally.home.registeredTitle")}
        </h2>

        {mockRegisteredActivities.length > 0 ? (
          <div className="flex flex-col gap-3">
            {mockRegisteredActivities.map((activity) => (
              <RegisteredActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center min-h-50 justify-center gap-4 rounded-3xl border border-black bg-rpkm-beige p-6 text-center">
            <p className="text-xl text-foreground">
              {t("walkrally.home.emptyState")}
            </p>
          </div>
        )}

        <a
          href="/walkrally/events"
          className="relative isolate flex items-center gap-2 self-center overflow-hidden rounded-full border-2 border-black bg-[#e65325] py-1.5 pr-5 pl-1.5 font-bold text-background"
        >
          <MonotoneNoise className="absolute inset-0 -z-1 pointer-events-none" />
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black bg-white p-0.5">
            <div className="flex size-full items-center justify-center rounded-full border border-black bg-rpkm-beige">
              <Plus className="size-4 text-foreground" strokeWidth={3} />
            </div>
          </div>
          {t("walkrally.home.addActivity")}
        </a>
      </div>
    </>
  );
}
