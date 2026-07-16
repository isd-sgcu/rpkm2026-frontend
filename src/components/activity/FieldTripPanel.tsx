import { CalendarDays } from "lucide-react";

import { FieldTripCard, type FieldTrip } from "./FieldTripCard";

// One entry per card. `color` is the outer/behind layer colour — change it per
// card. `data` is the card content. Swap the placeholder text + registerUrl.
const fieldTrips: { color: string; data: FieldTrip }[] = [
  {
    color: "#6ABF73",
    data: {
      id: "eco",
      title: "เส้นทางรักษ์โลก",
      description:
        "พาไปสำรวจเหล่าพืชพรรณภายในจุฬาฯ ซึมซับพื้นที่สีเขียว รวมไปถึงศึกษาวิธีการจัดการขยะที่เกิดขึ้นเพื่อเสริมสร้างการตระหนักรู้ในด้านสิ่งแวดล้อมและนำไปสู่ความยั่งยืน\n \
        มาสัมผัสสิ่งแวดล้อมของจุฬาฯ ชื่นชมธรรมชาติและดูแลทรัพยากรอย่างยั่งยืนไปด้วยกันตามวันเวลาที่กำหนดนะ!\n\n \
        ป.ล. เส้นทางรักษ์โลก ประกอบด้วยเส้นทางย่อยอีก 2 เส้นทาง ได้แก่ Plantwalk (เดินสำรวจต้นไม้ในจุฬาฯ) \
        และ Trashvenger (สำรวจการจัดการขยะภายในจุฬาฯ)\n\n \
        สามารถเลือกเข้าร่วมได้ทั้ง 2 เส้นทางย่อย (เส้นทางย่อยละ 1 ครั้งเท่านั้น) ",
      routes: [
        {
          name: "Plant Walk",
          date: "22-23 กรกฎาคม 69",
          time: "8:30-11:00 น.",
          location: "วันที่22: อาคารมหิตลาธิเบศร\nวันที่23: อาคารจามจุรี 5",
          registerUrl: "https://forms.gle/m4y6pyWxjZzU18Si7", // TODO: Plant Walk link
        },
        {
          name: "Trashvenger",
          date: "24 กรกฎาคม 69\n27 กรกฎาคม 69",
          time: "8:30-11:00 น.",
          location: "โรงอาหารสำนักงานมหาวิทยาลัย",
          registerUrl: "https://forms.gle/SEHikkUfS1AtM6WP6 ", // TODO: Trashvenger link
        },
      ],
    },
  },
  {
    color: "#73AA7A",
    data: {
      id: "samyan",
      title: "เส้นทางชุมชนสามย่าน",
      description:
        "ชวนออกไปสำรวจอีกมิติหนึ่งของชีวิตรอบรั้วมหาวิทยาลัย ไม่ว่าจะเป็นร้านอร่อยหลังเลิกเรียน สถานที่พักผ่อน พื้นที่แห่งความเชื่อและการมูเตลู \
        รวมถึงเรื่องราวของชุมชนสามย่านโดยรอบที่จะค่อย ๆ กลายเป็นความทรงจำสำคัญในช่วงชีวิตนิสิตของทุกคน \
        \n\nมาออกเดินทางไปค้นพบเสน่ห์ของชุมชนรอบจุฬาฯได้ตามวันเวลาที่กำหนด <3",
      routes: [
        {
          date: "22-25 กรกฎาคม 69",
          time: "15:30-18:00 น.",
          location: "โรงอาหารคณะพาณิชยศาสตร์และการบัญชี (อาคารมหิตลาธิเบศร)",
        },
      ],
      registerUrl: "https://forms.gle/NNYTJkRN1Cuid3us7 ",
    },
  },
  {
    color: "#638C68",
    data: {
      id: "campus",
      title: "เส้นทางจุฬาฯ",
      description:
        "มาร่วมกันร้อยเรียงเรื่องราวบทใหม่ไปพร้อมกันผ่านการสำรวจมหาวิทยาลัย สัมผัสเส้นทางที่เต็มไปด้วยเกร็ดความรู้ด้านประวัติศาสตร์ \
        สถาปัตยกรรม และเรื่องราวเล็ก ๆ ที่ซ่อนอยู่รอบรั้วจุฬาฯ เพราะก้าวเดินต่อจากนี้จะเต็มไปด้วยเรื่องราวมากมายที่รอให้ทุกคนได้ออกไปค้นพบ! \
        \n\nถ้าอยากรู้ว่าจุฬาฯ อบอุ่นแค่ไหน ลองมาออกเดินทางเก็บเกี่ยวความประทับใจไปด้วยกันได้ตามวันเวลาที่กำหนดได้เลย~ ",
      routes: [
        {
          date: "25-29 กรกฎาคม 69",
          time: "8:30-11:00 น.",
          location: "โรงอาหารคณะพาณิชยศาสตร์และการบัญชี (อาคารมหิตลาธิเบศร)",
        },
      ],
      registerUrl: "https://forms.gle/t2Rc3aBZPDGwNZtd7",
    },
  },
];

const FieldTripPanel = () => {
  return (
    <>
      <div className="w-full flex items-left">
        <header className="relative z-10 text-left">
          <h1 className="text-2xl font-bold">Field Trip</h1>
          <p className="text-xs font-normal my-1 leading-normal">
            ออกสำรวจจุฬาฯ ผ่าน 3 เส้นทางที่ออกแบบมาให้คูณได้เรียนรู้
            ทั้งประวัติศาสตร์
            <br />
            ชุมชน และสิ่งแวดล้อม
          </p>
          <div className="flex flex-col items-left">
            <p className="flex items-start gap-1 text-xs font-normal leading-normal">
              <CalendarDays className="size-[18px] shrink-0 text-black" />
              เปิดลงทะเบียน 18-20 ก.ค. 69 หรือจนกว่าจะเต็ม
              <br />
            </p>
            <p className="flex items-start gap-1 text-xs font-normal leading-normal">
              <CalendarDays className="mt-1.5 size-[18px] shrink-0 text-black" />
              กิจกรรมตั้งแต่วันที่ 22-29 ก.ค. 69 <br />{" "}
              (เวลาเข้าร่วมขึ้นอยู่กับเส้นทางที่เลือก)
            </p>
          </div>
        </header>
      </div>
      <div className="w-full flex items-left my-[15px]">
        <header className="relative z-10 text-left">
          <h1 className="text-xl font-bold">เลือกเส้นทางที่สนใจ</h1>
          <p className="flex items-start gap-1 text-xs font-normal leading-normal">
            หมายเหตุ: ใน 1 เส้นทางไม่สามารถเข้าร่วมมากกว่า 1 รอบได้
            <br />
            และทุกกิจกรรมมีวันละ 1 รอบ
          </p>
        </header>
      </div>

      {/* Three cards, each a different colour. */}
      <div className="flex w-full flex-col items-center gap-6 pb-8">
        {fieldTrips.map(({ color, data }) => (
          <FieldTripCard key={data.id} fieldTrip={data} color={color} />
        ))}
      </div>
    </>
  );
};

export default FieldTripPanel;
