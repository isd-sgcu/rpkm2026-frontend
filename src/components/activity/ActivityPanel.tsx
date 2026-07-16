import { FieldTripCard, type FieldTripActivity } from "./ActivityCard";

// Add more cards later by appending activities to this list.
const activities: FieldTripActivity[] = [
  {
    id: "field-trip-1",
    title: "Field Trip",
    description:
      "ออกสำรวจจุฬาฯ ผ่าน 3 เส้นทางที่ออกแบบมาให้คุณได้เรียนรู้ ทั้งประวัติศาสตร์ ชุมชน และสิ่งแวดล้อม",
    registrationText: "เปิดลงทะเบียน 18 - 20 ก.ค. 69 หรือจนกว่าจะเต็ม",
    activityText:
      "กิจกรรมตั้งแต่วันที่ 22-29 ก.ค. 69\n(เวลาเข้าร่วมขึ้นอยู่กับเส้นทางที่เลือก)",
    detailsUrl: "./activity/fieldtrip",
  },
  {
    id: "field-trip-2",
    title: "Field Trip 2",
    description:
      "เรียนรู้เรื่องราวและประวัติศาสตร์ของจุฬาฯ ผ่าน Workshop พิพิธภัณฑ์ และกิจกรรมบอร์ดเกม\nโดยมีรุ่นพี่ร่วมพาออกสำรวจและทำกิจกรรมไปด้วยกัน",
    registrationText:
      "เปิดลงทะเบียน  22–29 ก.ค. 69\nและเปิดรับ Walk-in ตามจำนวนที่เหลือในวันงาน",
    activityText: "กิจกรรมวันที่ 31 ก.ค. 69 12:00-16:00 น.",
    detailsUrl: "../walkrally",
  },
];

const ActivityPanel = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[301px]">
        <header className="relative z-10 text-center">
          <h1 className="text-3xl font-bold">ลงทะเบียนกิจกรรม</h1>
        </header>
        <section className="relative z-10 mt-8 grid gap-6 flex justify-center items-center">
          {activities.map((activity) => (
            <FieldTripCard key={activity.id} activity={activity} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default ActivityPanel;
