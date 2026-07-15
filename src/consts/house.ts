export type House = {
  id: string;
  name: {
    th: string;
    en: string;
  };
  description: {
    th: string;
    en: string;
  };
  size: "S" | "M" | "L" | "XL" | "XXL";
  logoUrl: string;
  link: {
    facebook: string | null;
    instagram: string | null;
    tiktok: string | null;
  };
};

export const HOUSES: House[] = [
  {
    id: "1",
    name: {
      th: "บ้านคุณหนู",
      en: "Baankhunnoo",
    },
    description: {
      th: "บ้านคุณหนูบ้าน ไซส์ S แสนอบอุ่น เน้นเล่นเกม ไม่เน้นสัน",
      en: "Baankhunnoo size S Cozy pure game vibes",
    },
    size: "S",
    logoUrl: "/house/BaanKhunnoo.webp",
    link: {
      facebook: null,
      instagram:
        "https://www.instagram.com/baankhunnoo_official?igsh=c3N3aWExeHhyMW1i",
      tiktok: null,
    },
  },
  {
    id: "2",
    name: {
      th: "บ้านโคะ",
      en: "Baankoh",
    },
    description: {
      th: "โคะเด็ด ซีเคร็ตจุฬา",
      en: "Once Koh, Always Koh",
    },
    size: "S",
    logoUrl: "/house/BaanKoh.webp",
    link: {
      facebook: "https://www.facebook.com/baan.k.chula?",
      instagram:
        "https://www.instagram.com/baankohchula?igsh=MWFsZG8wZWRoMmZ0aQ==",
      tiktok: null,
    },
  },
  {
    id: "3",
    name: {
      th: "บ้านดัง",
      en: "Baandung",
    },
    description: {
      th: "“บ้านดัง” ไม่ปังได้ไง ศูนย์รวมคนเท่ คูล มีไสตล์ ถึงจะบ้านเล็กแต่ก็เด็ดนะค้าบบบ",
      en: "How could 'Baan Dang‘ NOT be a hit? It's THE spot for cool, stylish people. Sure, it's a small house — but it's still amazing!!",
    },
    size: "S",
    logoUrl: "/house/BaanDung.webp",
    link: {
      facebook: null,
      instagram:
        "https://www.instagram.com/baandung.official?igsh=cmI4Y3pmY21tNWoy&utm_source=qr",
      tiktok: null,
    },
  },
  {
    id: "4",
    name: {
      th: "บ้านเยิ้ม",
      en: "Baanyerm",
    },
    description: {
      th: "อยากเยิ้มมาเติม(เพื่อน)กับพี่ แล้วมาเยิ้มไปด้วยกัน",
      en: "Get high on the vibe, get close at the yerm",
    },
    size: "S",
    logoUrl: "/house/BaanYerm.webp",
    link: {
      facebook: null,
      instagram:
        "https://www.instagram.com/baanyerm.chula?igsh=MXAwcjRtY3BzMmpheg%3D%3D&utm_source=qr",
      tiktok: "https://www.tiktok.com/@baanyermm?_r=1&_t=ZS-97fs0SuBuAK",
    },
  },
  {
    id: "5",
    name: {
      th: "บ้านรุม",
      en: "BAANROOM",
    },
    description: {
      th: "รวมพลคนโก๊ะ ชอบเล่นกีฬา ขำขันเฮฮา สัมพันธ์มิตรไมตรี",
      en: "A gathering of clumsy but sports-loving people, full of fun and laughter, fostering deep bonds of friendship.",
    },
    size: "S",
    logoUrl: "/house/BaanRoom.webp",
    link: {
      facebook: null,
      instagram:
        "https://www.instagram.com/baanroomchula?igsh=MTV1ZmRuOXI1cTN5aw%3D%3D&utm_source=qr",
      tiktok: null,
    },
  },
  {
    id: "6",
    name: {
      th: "บ้านหรอย",
      en: "BaanRhoy",
    },
    description: {
      th: "บ้านหรอย หรอยทุกโมเมนต์ อบอุ่นทุกความทรงจำ แล้วเจอกันในบ้านที่หรอยที่สุด",
      en: "BaanRhoy — Where every moment is Rhoy, and every memory feels like home. See you at the Rhoy-est home of all.",
    },
    size: "S",
    logoUrl: "/house/BaanRhoy.webp",
    link: {
      facebook: null,
      instagram: "https://www.instagram.com/baanrhoy.chula/",
      tiktok: "https://www.tiktok.com/@baanrhoy.chula",
    },
  },
  {
    id: "7",
    name: {
      th: "บ้านหลายใจ",
      en: "BaanLaijai",
    },
    description: {
      th: "บ้านนี้คนไม่ล้นเพราะขาดคนอย่างเธอ🫪 บ้านหลายใจรักใครรักจริง",
      en: "This house is never full, it's just empty without you🫪",
    },
    size: "S",
    logoUrl: "/house/BaanLaijai.webp",
    link: {
      facebook: null,
      instagram: "https://www.instagram.com/baanlaijai/",
      tiktok: null,
    },
  },
  {
    id: "8",
    name: {
      th: "บ้านอากาเป้",
      en: "Bannagape",
    },
    description: {
      th: "ท่ามกลางความสับสนวุ่นวายในท้องทะเลอันกว้างใหญ่ที่เรียกว่าจุฬาฯ เรืออากาเป้ลำนี้จะพาเฟรชชี่ทุกคนออกล่องเรือไปพร้อมกับมิตรภาพครั้งใหม่!",
      en: "Amidst the crashing waves of chaos and confusion across the great sea of Chula, the ship called Agape welcomes freshies aboard, setting sail on a journey to discover new friendships!",
    },
    size: "S",
    logoUrl: "/house/BaanAgape.webp",
    link: {
      facebook: null,
      instagram:
        "https://www.instagram.com/baanagapechula?igsh=ZmxqZnJiY3g2NGZu",
      tiktok: null,
    },
  },
  {
    id: "9",
    name: {
      th: "บ้านโบ้",
      en: "BaanBoe",
    },
    description: {
      th: "ไม่ว่าคุณจะเป็นโบ้สายพันธุ์ไหน โบ้กินเก่ง โบ้ร้องเพลง หรือโบ้สายสุขภาพ บ้านโบ้ของเราพร้อมอ้าแขนต้อนรับคุณเสมอ",
      en: "welcome every lost puppies back to baan boe!",
    },
    size: "S",
    logoUrl: "/house/BaanBoe.webp",
    link: {
      facebook: null,
      instagram:
        "https://www.instagram.com/baanboe?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      tiktok: "https://www.tiktok.com/@baanboe?_r=1&_t=ZS-97fm637SeW4",
    },
  },
  {
    id: "10",
    name: {
      th: "บ้านอะอึ๋ม",
      en: "BaanA-Aum",
    },
    description: {
      th: "สู่ความเวิ้งว้างอันไกลโพ้นน! บ้านอะอึ๋มเปิดกล่องของเล่น ขนาดกำลังดี สนุกไม่พัก รักน้องๆอย่างทั่วถึง มาหากันเยอะๆน้า🚀",
      en: "To infinity and beyond! A-AUM’s toy box is open, Perfectly sized and non-stop fun. Come join us🚀",
    },
    size: "M",
    logoUrl: "/house/BaanA-Aum.webp",
    link: {
      facebook: null,
      instagram: "https://www.instagram.com/baanaaum.official",
      tiktok: "https://www.tiktok.com/@baanaaum1995?_r=1&_t=ZS-97pU2MmZLfd",
    },
  },
  {
    id: "11",
    name: {
      th: "บ้านคิดส์",
      en: "BaanKidZ",
    },
    description: {
      th: "ไม่ใช่แค่บ้าน แต่เป็นครอบครัว มาเป็นครอบครัวคิดส์ เหนียวแน่นหนึบกันเถอะ",
      en: "Join for the FUN, stay for the FAMILY. Be part of the KIDZ family!",
    },
    size: "M",
    logoUrl: "/house/BaanKidz.webp",
    link: {
      facebook: "https://www.facebook.com/share/14d7T4ZEMJa/?mibextid=wwXIfr",
      instagram:
        "https://www.instagram.com/baankids.official?igsh=MTl0ZzAyNmxzMHNvOA==",
      tiktok:
        "https://www.tiktok.com/@baankids.official0?_r=1&_t=ZS-97pPIN0m1Ym",
    },
  },
  {
    id: "12",
    name: {
      th: "บ้านนอก",
      en: "Baan Nork",
    },
    description: {
      th: "ติดจุฬาอย่าลืมมาขึ้นบ้านนอกขนส่ง ขนส่งหนึ่งเดียวที่จะพาท่องจุฬา ที่เหลียวสู จนต้องร้องอ๊าห์ เตรียมตั๋วให้พร้อมแล้วมาร้องอิ๊ย๊าห์ไปด้วยกันนน",
      en: "Nothing beat a jet 2 u holiday and right now u can come Baannork per person.",
    },
    size: "M",
    logoUrl: "/house/BaanNork.webp",
    link: {
      facebook: null,
      instagram:
        "https://www.instagram.com/baannork.chula?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      tiktok:
        "https://www.tiktok.com/@baannork.chula?is_from_webapp=1&sender_device=pc",
    },
  },
  {
    id: "13",
    name: {
      th: "บ้านโจ๊ะเด๊ะ ฮือซา",
      en: "BaanJodeh Huesa",
    },
    description: {
      th: "รับน้องแค่สามวัน แต่เยียวยากันไปตลอดสี่ปีที่บ้านโจ๊ะเด๊ะฮือซา",
      en: "“FreshmeFreshmen festival lasts just three days, but the healing vibes at Baan Jodeh Huesa last all four years!",
    },
    size: "L",
    logoUrl: "/house/BaanJodeh.webp",
    link: {
      facebook: null,
      instagram: "https://www.instagram.com/jodeh_official",
      tiktok: "https://www.tiktok.com/@jodeh_official?_r=1&_t=ZS-97poy1b1MMz",
    },
  },
  {
    id: "14",
    name: {
      th: "บ้านเอช้วน",
      en: "BaanA-chuan",
    },
    description: {
      th: "มังกรตระหง่าน  สันทนาการพลิ้วไหว เสียงกลองดังสนั่นถึงใจ “เอช้วน” ยิ่งใหญ่ในปฐพี",
      en: "Dragons stand majestic, cheers flow with grace. Drums thunder through every heart, as A-chuan reigns supreme across the land.",
    },
    size: "L",
    logoUrl: "/house/BaanAchuan.webp",
    link: {
      facebook: "https://www.facebook.com/baanachuan/?locale=th_TH",
      instagram:
        "https://www.instagram.com/baanachuan_official?igsh=cGpwZTRyOHB3c3Zy&utm_source=qr",
      tiktok:
        "https://www.tiktok.com/@baanachuan.offici?_r=1&_t=ZS-97flsWNsT7i",
    },
  },
  {
    id: "15",
    name: {
      th: "บ้านเฮา",
      en: "Baanhaaw",
    },
    description: {
      th: "อยู่กับเฮาไม่มีเหงา เพราะเราพร้อมปาร์ตี้ รอน้องๆมาม่วนจอยกันที่บ้านเฮา #ชิวๆสไตล์เฮา",
      en: "Come as freshmen, leave as family. Let’s make BAANHAAW the loudest party of all time",
    },
    size: "L",
    logoUrl: "/house/BaanHaaw.webp",
    link: {
      facebook: null,
      instagram: "https://www.instagram.com/baan.haaw",
      tiktok: "https://www.tiktok.com/@baanhaaw?_r=1&_t=ZS-97q9glQu6Wv",
    },
  },
  {
    id: "16",
    name: {
      th: "บ้านสด",
      en: "baansod",
    },
    description: {
      th: "อยากเจอชินจังต้องมาบ้านสดมาบ้านสดไม่โสดกลับไป มาบ้านสดไม่โสดกลับไปมาบ้านสดไม่โสดกลับไป",
      en: "Hello ! Fresh house for freshy Thank you !",
    },
    size: "XL",
    logoUrl: "/house/BaanSod.webp",
    link: {
      facebook: null,
      instagram:
        "https://www.instagram.com/baansod.official?igsh=MTgyczByamxsZGZxZQ==",
      tiktok: "https://www.tiktok.com/@baansod.official?_r=1&_t=ZS-97pVNObCFJC",
    },
  },
  {
    id: "17",
    name: {
      th: "บ้านคุ้ม",
      en: "Baan Koom",
    },
    description: {
      th: "บ้านคุ้ม บ้านที่มีการสันทนาการเป็นเอกลักษณ์ที่สุดในจุฬาฯ เปี่ยมด้วยความอลังการ ยิ่งใหญ่ และอบอุ่นด้วยรักจากทั่วทุกสารทิศ",
      en: "Baan Koom -- Chula's most distinct house with unique recreational activities. We are ready to welcome all freshies with greatness, great fun, and great love from our members.",
    },
    size: "XL",
    logoUrl: "/house/BaanKoom.webp",
    link: {
      facebook: null,
      instagram: "https://www.instagram.com/baankoom.chula",
      tiktok: "https://www.tiktok.com/@baankoom.chula?_r=1&_t=ZS-97pwD8l07us",
    },
  },
  {
    id: "18",
    name: {
      th: "บ้านโจ๋",
      en: "Baan Jo+",
    },
    description: {
      th: "เพราะความจริงมีเพียงหนึ่งเดียว.. บ้านที่ใช่อาจเป็นบ้านโจ๋!",
      en: "There is only one truth.. Baan Jo+ is where you belong!",
    },
    size: "XL",
    logoUrl: "/house/BaanJo+.webp",
    link: {
      facebook: null,
      instagram:
        "https://www.instagram.com/baanjochula?igsh=MXdrdDBnMHRkNHlvbg%3D%3D&utm_source=qr",
      tiktok: "https://www.tiktok.com/@baanjochula2025?_r=1&_t=ZS-97pr8PAu1aO",
    },
  },
  {
    id: "19",
    name: {
      th: "บ้านโซ้ยตี๋หลีหมวย",
      en: "Baan Soeitee Lheemouy",
    },
    description: {
      th: "🗝️ม่านโรงละครสุดยิ่งใหญ่เปิดขึ้นแล้ว ขอเชิญสุภาพบุรุษและสุภาพสตรีทุกท่านร่วมไขปริศนา และรังสรรค์บทละครชิ้นเอกไปด้วยกันที่บ้านโซ้ยตี๋หลีหมวย🧧",
      en: "Ladies and gentlemen, the curtains rise at Soeitee the Grand Theatre. Step into a world of mystery and compose a timeless masterpiece with us. 💌You’re all invited to Baan Soeitee Lheemouy!",
    },
    size: "XL",
    logoUrl: "/house/BaanSoeiteelheemouy.webp",
    link: {
      facebook: null,
      instagram:
        "https://www.instagram.com/baansoeiteelheemouy?igsh=cHJqMGlua3E1cGdx&utm_source=qr",
      tiktok:
        "https://www.tiktok.com/@baansoeiteelheemouy?_r=1&_t=ZS-97pHgBx1Glg",
    },
  },
  {
    id: "20",
    name: {
      th: "บ้านแจ๋ว",
      en: "BAAN JAEW",
    },
    description: {
      th: "สวัสดีครับชาวแจ๋ว พร้อมจะแจ๋วกันหรือยังง เพราะเราเชื่อว่าทุกคนแจ๋ว 💙👍🏻",
      en: "Hello Jaew people! Are you ready to be Jaew? Because we believe that everyone is Jaew💙👍🏻",
    },
    size: "XL",
    logoUrl: "/house/BaanJaew.webp",
    link: {
      facebook: null,
      instagram: "https://www.instagram.com/baanjaew?igsh=MWcxYW5pcnQzYzdobQ==",
      tiktok: "https://www.tiktok.com/@baanjaew?_r=1&_t=ZS-97fmSVJgLa8",
    },
  },
  {
    id: "21",
    name: {
      th: "บ้านยิ้ม",
      en: "Baanyim",
    },
    description: {
      th: "บ้านหลังใหญ่เเต่ใจใกล้กัน ผูกพันกันกว่า 24 ปีไม่ต้องมีหรอกลักยิ้มแค่มาบ้านยิ้มพี่ก็รักแล้ว #ติดจุฬามาบ้านยิ้ม",
      en: "A big home where hearts are always close.24 years of laughter, memories, and lasting bonds.You bring the smile, we'll bring the family.",
    },
    size: "XXL",
    logoUrl: "/house/BaanYim.webp",
    link: {
      facebook: null,
      instagram: "https://www.instagram.com/baanyimchula",
      tiktok: "https://www.tiktok.com/@baanyimcu?_r=1&_t=ZS-97hg60hBnUr",
    },
  },
  {
    id: "22",
    name: {
      th: "บ้านแรงส์",
      en: "BaanRANGS",
    },
    description: {
      en: "บ้านแรงส์ บ้านที่สืบทอดความทรงจำ และมิตรภาพมากว่า 26 ปี ผ่านกิจกรรมอันเป็นเอกลักษณ์ ความสนุก และคอมมูนิตี้ที่ส่งต่อมิตรภาพจากรุ่นสู่รุ่น",
      th: "Baanrangs is a home of warmth, friendship, and unforgettable memories that make the beginning of your CU journey even more meaningful throughout the year.",
    },
    size: "XXL",
    logoUrl: "/house/BaanRangs.webp",
    link: {
      facebook: null,
      instagram:
        "https://www.instagram.com/baanrangs.official?igsh=MTRibm02NnRxcGZvMw==",
      tiktok:
        "https://www.tiktok.com/@baanrangs.official?_r=1&_t=ZS-97kPYDDqkVz",
    },
  },
];

export function getHouseById(id: string): House | undefined {
  return HOUSES.find((house) => house.id === id);
}
