// PDPA (personal-data protection) policy copy for the consent screen.

import type { LocaleType } from "./i18n/locale";

export type PdpaBlock =
  | { kind: "p"; text: string }
  | { kind: "defs"; items: { term: string; definition: string }[] }
  | { kind: "list"; ordered?: boolean; items: PdpaListItem[] };

export interface PdpaListItem {
  text: string;
  children?: PdpaBlock[];
}

export interface PdpaSection {
  heading: string;
  blocks: PdpaBlock[];
}

export interface PdpaContent {
  title: string[];
  subtitle: string;
  intro: string[];
  sections: PdpaSection[];
  consentLabel: string;
  ui: { scrollDown: string; scrollUp: string; consentAction: string };
}

const TH: PdpaContent = {
  title: ["นโยบายคุ้มครอง", "ข้อมูลส่วนบุคคล"],
  subtitle: "โครงการ CU First Date 2026",
  intro: [
    "โครงการ CU First Date 2026 (“โครงการ ฯ ”) ได้ตระหนักถึงความสำคัญของการคุ้มครองข้อมูลส่วนบุคคลและดำรงไว้ซึ่งมาตรการในการรักษาสิทธิและความปลอดภัยในข้อมูลส่วนบุคคลตามมาตรฐานที่เหมาะสมและเป็นไปตามกฎหมายที่เกี่ยวข้อง",
    "จึงได้จัดทำและเผยแพร่นโยบายข้อมูลส่วนบุคคลฉบับนี้ให้กับนิสิตหรือบุคคลภายนอกที่เข้าร่วมกิจกรรมกับทางโครงการ ฯ เพื่อให้รับทราบและเข้าใจถึงนโยบายการคุ้มครองข้อมูลส่วนบุคคลรวมถึงสิทธิในข้อมูลส่วนบุคคล ทั้งนี้ ให้มีผลบังคับใช้กับนิสิตหรือบุคคลภายนอกที่เข้าร่วมกิจกรรมกับทางโครงการ ฯ โดยมีเนื้อหาดังต่อไปนี้",
  ],
  sections: [
    {
      heading: "คำนิยามภายในนโยบาย ฯ",
      blocks: [
        {
          kind: "defs",
          items: [
            {
              term: "“ข้อมูลส่วนบุคคล” (Personal Data)",
              definition:
                "หมายถึง ข้อมูลเกี่ยวกับบุคคลซึ่งทำให้สามารถระบุตัวตนบุคคลนั้นได้ ไม่ว่าทางตรงหรือทางอ้อม แต่ไม่รวมถึงข้อมูลของผู้ถึงแก่กรรมโดยเฉพาะ",
            },
            {
              term: "“ข้อมูลอ่อนไหว” (Sensitive Data)",
              definition:
                "หมายถึง ข้อมูลส่วนบุคคลเกี่ยวกับเชื้อชาติ เผ่าพันธุ์ ความเชื่อในลัทธิ ศาสนาหรือปรัชญา ความคิดเห็นทางการเมือง พฤติกรรมทางเพศ ประวัติอาชญากรรม ข้อมูลสุขภาพ ความพิการ ข้อมูลสหภาพแรงงาน ข้อมูลพันธุกรรม ข้อมูลชีวภาพ เช่น การสแกนลายนิ้วมือ การสแกนใบหน้า เป็นต้น หรือข้อมูลอื่นใดซึ่งกระทบต่อเจ้าของข้อมูลส่วนบุคคลในทำนองเดียวกันตามที่คณะกรรมการคุ้มครองข้อมูลส่วนบุคคลประกาศกำหนด",
            },
            {
              term: "“บุคคล”",
              definition:
                "หมายถึง ผู้ปฏิบัติงานภายใต้โครงการ ฯ และบุคคลทั่วไปที่ไม่มีหน้าที่ต้องปฏิบัติงานภายใต้โครงการ ฯ",
            },
            {
              term: "“สื่อ”",
              definition:
                "หมายถึง ช่องทางการสื่อสารที่นำเนื้อหาของผู้ส่งสาร ส่งไปยังผู้รับสารให้สามารถสื่อสารกันได้ตรงตามวัตถุประสงค์ที่ต้องการ",
            },
            {
              term: "“ภาพนิ่ง”",
              definition:
                "หมายถึง ภาพที่ไม่มีการเคลื่อนไหว ในที่นี้หมายความถึง ภาพถ่าย",
            },
            {
              term: "“เสียง”",
              definition:
                "หมายถึง สื่อที่ใช้หูในการสัมผัสโดยการรับฟัง เพื่อความเข้าใจหรือรู้ถึงจุดมุ่งหมายของสาร",
            },
            {
              term: "“วิดีโอ”",
              definition:
                "หมายถึง สื่อหรือการบันทึกภาพเคลื่อนไหวและเสียงที่จะถูกบันทึกหรือแสดงผ่านอุปกรณ์ต่าง ๆ เช่น กล้องถ่ายภาพ, สมาร์ทโฟน, คอมพิวเตอร์ หรือ ผ่านสื่อออนไลน์",
            },
            {
              term: "“ชื่อ - นามสกุล”",
              definition:
                "หมายถึง กลุ่มคำที่ได้รับการบันทึก หรือยืนยันโดยเอกสารราชการ หรือ เอกสารใด ๆ ในทำนองเดียวกัน ซึ่งมีวัตถุประสงค์เพื่อระบุถึงบุคคลใดบุคคลหนึ่งโดยจำเพาะ ทั้งนี้ ไม่ว่าจะเป็นภาษาไทย หรือ ภาษาอังกฤษ ก็ตาม",
            },
            {
              term: "“เลขประจำตัวนิสิต”",
              definition:
                "หมายถึง ข้อมูลอันประกอบไปด้วยตัวเลข 10 หลัก ซึ่งได้ออกให้โดยจุฬาลงกรณ์มหาวิทยาลัย เพื่อใช้ในการระบุถึงตัวนิสิตคนใดคนหนึ่งในจุฬาลงกรณ์มหาวิทยาลัย",
            },
            {
              term: "“หมายเลขโทรศัพท์”",
              definition:
                "หมายถึง ข้อมูลชุดหมายเลข อันกำหนดให้แก่โทรศัพท์มือถือ โทรศัพท์สำนักงาน หรือเครื่องมือสื่อสารใด ๆ ในทำนองเดียวกัน เพื่อใช้ในการติดต่อแก่บุคคลใดได้อย่างจำเพาะ",
            },
            {
              term: "“ช่องทางติดต่อฉุกเฉิน”",
              definition:
                "หมายถึง วิธีการใด ๆ ในการติดต่อบุคคลซึ่งบุคคลใดบุคคลหนึ่งกำหนดหรือมอบหมายให้สามารถติดต่อไปถึงได้ในกรณีมีเหตุการณ์ที่ไม่อาจควบคุมได้ หรือโดยประการที่น่าจะก่อให้เกิดความเสียหายใด ๆ แก่บุคคลนั้น",
            },
            {
              term: "“คณะ”",
              definition:
                "หมายถึง ส่วนงานของจุฬาลงกรณ์มหาวิทยาลัย อันมีหน้าที่จัดการเรียนการสอนให้แก่นิสิตในสังกัดแห่งคณะนั้น ทั้งนี้ ให้หมายความรวมถึง สำนักวิชา และส่วนงานที่อยู่ในระดับเดียวกันด้วย",
            },
            {
              term: "“มหาวิทยาลัย”",
              definition: "หมายถึง จุฬาลงกรณ์มหาวิทยาลัย",
            },
          ],
        },
      ],
    },
    {
      heading: "ข้อมูลส่วนบุคคลที่จะถูกจัดเก็บ",
      blocks: [
        {
          kind: "p",
          text: "ข้อมูลส่วนบุคคลที่ทางโครงการ ฯ จะเก็บรวบรวมจากท่าน ได้แก่ ภาพนิ่ง วิดีโอ เสียง ชื่อ - นามสกุล เลขประจำตัวนิสิต ชั้นปี คณะ/สาขาวิชา หมายเลขโทรศัพท์ ช่องทางติดต่อฉุกเฉิน และข้อมูลด้านสุขภาพ (โดยโครงการ ฯ จะจัดเก็บข้อมูลเท่าที่จำเป็นตามวัตถุประสงค์ของการประมวลผลข้อมูล ซึ่งแบ่งออกเป็น 2 ลักษณะ ดังนี้",
        },
        {
          kind: "list",
          items: [
            {
              text: "ข้อมูลส่วนบุคคลทั่วไป",
              children: [
                {
                  kind: "list",
                  items: [
                    {
                      text: "ข้อมูลส่วนตัว เช่น ชื่อ - นามสกุล เลขประจำตัวนิสิต ชั้นปี คณะ/สาขาวิชา",
                    },
                    {
                      text: "ข้อมูลติดต่อ เช่น หมายเลขโทรศัพท์ ช่องทางติดต่อฉุกเฉิน",
                    },
                  ],
                },
              ],
            },
            {
              text: "ข้อมูลอ่อนไหว",
              children: [
                {
                  kind: "list",
                  items: [
                    {
                      text: "ข้อมูลเกี่ยวกับสุขภาพ เช่น อาหารหรือยาที่มีอาการแพ้ โรคประจำตัว ยาประจำตัว ข้อจำกัดด้านร่างกายต่าง ๆ",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      heading: "วัตถุประสงค์และฐานในการประมวลผลข้อมูล",
      blocks: [
        { kind: "p", text: "วัตถุประสงค์ในการประมวลผลข้อมูล" },
        {
          kind: "p",
          text: "การจัดเก็บข้อมูลส่วนบุคคลเป็นไปเพื่อประโยชน์ต่อการดำเนินกิจกรรมให้เป็นไปตามระเบียบอย่างมีประสิทธิภาพและสอดคล้องกับหลักการคุ้มครองข้อมูลส่วนบุคคลตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 โดยโครงการ ฯ มีวัตถุประสงค์ในการเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของนิสิตหรือบุคคลภายนอก ดังนี้",
        },
        {
          kind: "list",
          items: [
            { text: "เพื่อการบริหารจัดการและแบ่งหน้าที่ในกิจกรรม" },
            {
              text: "เพื่อการติดต่อสื่อสารระหว่างทีมงานผ่านช่องทางออนไลน์และออฟไลน์",
            },
            {
              text: "เพื่อประโยชน์ในการประสานงานและดูแลความเรียบร้อยของกิจกรรม",
            },
            {
              text: "เพื่อการควบคุม ตรวจสอบ และติดตามความรับผิดชอบในแต่ละบทบาทของผู้ปฏิบัติงาน รวมถึงการบันทึกการมีส่วนร่วมและการประเมินผลการปฏิบัติงาน",
            },
            {
              text: "เพื่อความปลอดภัยของผู้เข้าร่วมกิจกรรม เช่น การจัดทำรายชื่อผู้รับผิดชอบในแต่ละพื้นที่ การติดตามการเคลื่อนไหวในกรณีฉุกเฉิน หรือเมื่อเกิดเหตุจำเป็นต้องประสานงานกับเจ้าหน้าที่หรือทีมงานของโครงการ ฯ",
            },
            {
              text: "เพื่อจัดทำรายงานและเอกสารประกอบกิจกรรม เช่น การจัดทำรายงานแก่มหาวิทยาลัย การบันทึกภาพกิจกรรม การออกหนังสือรับรองการมีส่วนร่วม รวมถึงเอกสารอื่น ๆ ที่ทางมหาวิทยาลัยเป็นผู้ออกให้",
            },
            {
              text: "เพื่อมาตรการป้องกันในการตรวจสอบย้อนหลัง และการดำเนินการตามนโยบายของโครงการให้สอดคล้องกับนโยบายของฝ่ายทรัพยากรบุคคล องค์การบริหารนิสิตจุฬาลงกรณ์มหาวิทยาลัย และฝ่ายวิจัยและพัฒนาองค์กร องค์การบริหารนิสิตจุฬาลงกรณ์มหาวิทยาลัย ในกรณีที่มีการร้องเรียนหรือพฤติกรรมที่ไม่เหมาะสม ซึ่งมีความจำเป็นต้องตรวจสอบโดยฝ่ายที่เกี่ยวข้อง",
            },
            { text: "เพื่อปฏิบัติตามกฎหมายและข้อบังคับที่เกี่ยวข้อง" },
          ],
        },
        {
          kind: "p",
          text: "โครงการจะดำเนินการเก็บรวบรวม ใช้ และเปิดเผยข้อมูลของนิสิตหรือบุคคลภายนอกเท่าที่จำเป็นเท่านั้น รวมไปถึงการรักษามาตรฐานความปลอดภัยของข้อมูลส่วนบุคคลอย่างเคร่งครัด โดยไม่ให้ข้อมูลถูกใช้ในลักษณะอันเป็นการละเมิดสิทธิเสรีภาพ หรือเพื่อวัตถุประสงค์อื่นใดโดยไม่ได้รับความยินยอมจากเจ้าของข้อมูล",
        },
        { kind: "p", text: "ฐานทางกฎหมายในการประมวลผลข้อมูล" },
        {
          kind: "p",
          text: "ตามมาตรา 24 แห่งพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ซึ่งวางหลังไว้ว่า การให้ความยินยอมเป็นฐานหลักในการประมวลผลข้อมูล แต่ในกรณีที่การประมวลผลไม่สามารถอิงจากฐานความยินยอมได้ ให้ดำเนินการด้วยฐานอื่น ๆ เช่น ฐานสัญญา ฐานประโยชน์อันชอบธรรม ฐานหน้าที่ตามกฎหมาย เป็นต้น ดังนั้น การประมวลผลข้อมูลส่วนบุคคลของท่านจึงอยู่ภายใต้ฐานทางกฎหมายตามพระราชบัญญัติข้างต้น โดยอาศัยฐานทางกฎหมายที่เกี่ยวข้อง ดังนี้",
        },
        {
          kind: "list",
          items: [
            {
              text: "ฐานสัญญา",
              children: [
                {
                  kind: "p",
                  text: "เพื่อดำเนินการตามคำขอของท่านก่อนเข้าทำสัญญา และเพื่อปฏิบัติตามสัญญาหรือข้อตกลงที่เกี่ยวข้องกับการการเข้าร่วมกิจกรรมของโครงการ การลงทะเบียน การติดต่อประสานงาน การระบุตัวตน และการให้บริการต่าง ๆ ที่เกี่ยวข้องกับโครงการ ทางโครงการจะประมวลผลข้อมูลส่วนบุคคลของท่านเท่าที่จำเป็นเท่านั้น ซึ่งการประมวลผลข้อมูลตามฐานสัญญานั้น ไม่จำเป็นต้องขอความยินยอมหากการประมวลผลข้อมูลอยู่ภายในขอบเขตที่จำเป็นและเกี่ยวข้องกับการปฏิบัติตามสัญญา",
                },
              ],
            },
            {
              text: "ฐานความยินยอม",
              children: [
                {
                  kind: "p",
                  text: "กรณีที่กฎหมายกำหนดให้ต้องได้รับความยินยอม หรือผู้ประมวลผลไม่มีฐานกฎหมายอื่นรับรอง ทางโครงการจะขอความยินยอมจากท่านก่อนการเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคล โดยท่านมีสิทธิถอนความยินยอมได้ตลอดเวลา ทั้งนี้ การถอนความยินยอมจะไม่กระทบต่อการประมวลผลข้อมูลที่ดำเนินการไปซึ่งได้กระทำโดยชอบด้วยกฎหมายก่อนการถอนความยินยอม",
                },
              ],
            },
            {
              text: "ฐานประโยชน์อันชอบธรรม",
              children: [
                {
                  kind: "p",
                  text: "เพื่อประโยชน์อันชอบธรรมและความจำเป็นของทางโครงการ ต้องไม่ขัดต่อสิทธิเสรีภาพขั้นพื้นฐานและประโยชน์ของท่าน การประมวลผลข้อมูลภายใต้ฐานนี้จึงครอบคลุมทั้งการรักษาความปลอดภัยของระบบสารสนเทศ การตรวจสอบการใช้งานระบบ การจัดการข้อร้องเรียน การบริหารความเสี่ยง การวิเคราะห์และประเมินผลการดำเนินงาน ตลอดการพัฒนาและปรับปรุงการดำเนินกิจกรรมของโครงการ",
                },
              ],
            },
            {
              text: "ฐานการปฏิบัติตามกฎหมาย",
              children: [
                {
                  kind: "p",
                  text: "เพื่อการปฏิบัติงานให้เป็นไปตามกฎ ระเบียบ ข้อบังคับ กฎหมาย หรือข้อกำหนดของหน่วยงานในมหาวิทยาลัย ทางโครงการจะประมวลผลข้อมูลส่วนบุคคลเท่าที่จำเป็น ภายใต้วัตถุประสงค์อันชอบด้วยกฎหมาย และดำเนินมาตรการป้องกันอย่างเหมาะสมในการคุ้มครองสิทธิเสรีภาพและประโยชน์ของท่านตามที่กฎหมายกำหนด",
                },
              ],
            },
            {
              text: "ฐานประโยชน์สำคัญต่อชีวิต",
              children: [
                {
                  kind: "p",
                  text: "เป็นกรณีที่การประมวลผลข้อมูลจำเป็นต่อการปกป้องผลประโยชน์สำคัญของเจ้าของข้อมูลหรือบุคคลอื่น เช่น ป้องกันอันตรายร้ายแรงต่อสุขภาพ ชีวิต ร่างกาย เป็นต้น ซึ่งจะใช้ฐานนี้เฉพาะในกรณีที่เจ้าของข้อมูลอยู่ในสภาวะที่ไม่สามารถให้ความยินยอมได้ และไม่มีวิธีอื่นที่สามารถปกป้องชีวิตบุคคลอื่นโดยไม่ต้องประมวลผลข้อมูลนี้แล้ว",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      heading: "แหล่งที่มาของข้อมูลส่วนบุคคล",
      blocks: [
        {
          kind: "p",
          text: "ทางโครงการ ฯ จะได้รับข้อมูลส่วนบุคคลของท่านจากช่องทางต่าง ๆ ได้แก่ แบบสอบถามของโครงการ ฯ แพลตฟอร์มออนไลน์ของโครงการ ฯ การบันทึกภาพนิ่ง วิดีโอ และ/หรือ เสียงจากผู้ปฏิบัติงานภายในโครงการ ฯ ณ วันที่ 18 กรกฎาคม พ.ศ. 2569 (วันงาน CU First Date 2026)",
        },
      ],
    },
    {
      heading: "การประมวลผลข้อมูลส่วนบุคคล",
      blocks: [
        {
          kind: "p",
          text: "เมื่อโครงการ ฯ ได้รับข้อมูลส่วนบุคคลของท่านจากแหล่งที่มาดังกล่าวแล้ว ทางโครงการ ฯ จะดำเนินการกับข้อมูลส่วนบุคคลของท่าน ดังนี้",
        },
        {
          kind: "list",
          items: [
            {
              text: "การประมวลผลข้อมูลส่วนบุคคลทั่วไป (General Personal Data Processing)",
              children: [
                {
                  kind: "p",
                  text: "ข้อมูลทั่วไปจะถูกจัดเก็บไว้ในระบบคลาวด์ (Cloud) หรือไดรฟ์ (Drive) ของโครงการ ฯ เพื่อวัตถุประสงค์ในการดำเนินงานของโครงการ ฯ และการบริหารงานภายใน โดยบุคคลที่สามารถเข้าถึงข้อมูลนี้ ได้แก่",
                },
                {
                  kind: "list",
                  items: [
                    { text: "ฝ่ายทรัพยากรบุคคล (HR)" },
                    { text: "ฝ่ายวิจัยและพัฒนา (R&D)" },
                    {
                      text: "ผู้ปฏิบัติงานที่เกี่ยวข้องตามความจำเป็น มีเหตุผลอันชอบธรรมและเหมาะสม ในการเข้าถึงข้อมูลดังกล่าว",
                    },
                  ],
                },
                {
                  kind: "p",
                  text: "การเปิดเผยข้อมูลต่อบุคคลภายนอก จะกระทำได้เฉพาะในกรณีที่ได้รับความยินยอมของเจ้าของข้อมูลส่วนบุคคล มีกฎหมายรองรับ หรือมีความจำเป็นตามวัตถุประสงค์ที่ชอบด้วยกฎหมายเท่านั้น",
                },
                {
                  kind: "p",
                  text: "การดำเนินการ ต้องไม่ละเมิดสิทธิเจ้าของข้อมูลส่วนบุคคล และต้องอยู่ภายใต้หลักความจำเป็นและความเหมาะสมของการใช้งานข้อมูลตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล",
                },
              ],
            },
            {
              text: "การประมวลผลข้อมูลอ่อนไหว (Sensitive Personal Data Processing)",
              children: [
                {
                  kind: "p",
                  text: "ข้อมูลอ่อนไหว จะถูกจัดเก็บแยกออกจากข้อมูลทั่วไป โดยมีมาตรการความปลอดภัยที่เข้มงวดมากขึ้น โดยผู้ที่สามารถเข้าถึงข้อมูลอ่อนไหวได้ ได้แก่",
                },
                {
                  kind: "list",
                  items: [
                    { text: "ประธานฝ่ายทรัพยากรบุคคล (HR)" },
                    {
                      text: "ผู้ได้รับมอบหมายอย่างเป็นทางการจากประธานฝ่ายทรัพยากรบุคคล",
                    },
                    {
                      text: "นิสิตปฏิบัติงาน เจ้าหน้าที่ หรือบุคคลอื่นใด ที่มีหน้าที่เกี่ยวข้องกับการปฐมพยาบาลโดยตรง โดยจะเข้าถึงข้อมูลอ่อนไหวของเจ้าของข้อมูลที่มีความจำเป็นต้องได้รับการปฐมพยาบาลเร่งด่วน ต่อเมื่อได้รับอนุญาตจากทางประธานฝ่ายทรัพยากรบุคคลสำหรับกรณีพิเศษเท่านั้น",
                    },
                  ],
                },
                {
                  kind: "p",
                  text: "การเปิดเผยข้อมูลอ่อนไหวจะต้องกระทำภายในระยะเวลา ไม่เกิน 7 วัน โดยหลังจากนั้นจะต้องมีการ ลบหรือทำลายข้อมูล ที่ได้เผยแพร่ออกไปทันที",
                },
                {
                  kind: "p",
                  text: "การเปิดเผยข้อมูลอ่อนไหวใด ๆ จะต้องดำเนินการภายใต้การควบคุมและกำกับดูแลอย่างเคร่งครัดโดยประธานฝ่ายทรัพยากรบุคคล หรือผู้ได้รับมอบหมายจากประธานฝ่ายทรัพยากรบุคคลเท่านั้น",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      heading: "การเก็บรักษาและระยะเวลาในการเก็บรักษาข้อมูลส่วนบุคคล",
      blocks: [
        {
          kind: "list",
          items: [
            {
              text: "การเก็บรักษาข้อมูลส่วนบุคคล",
              children: [
                {
                  kind: "list",
                  items: [
                    {
                      text: "การจัดเก็บ จะจัดเก็บเป็นในลักษณะแบบฟอร์มลงทะเบียน ระบบออนไลน์ต่าง ๆ ที่ดำเนินการในนามของโครงการ ฯ Excel Drive รวมถึงภาพถ่ายหรือภาพเคลื่อนไหวใด ๆ ที่ถูกจัดเก็บไว้โดยโครงการ ฯ",
                    },
                    {
                      text: "สถานที่จัดเก็บ จะเป็นการจัดเก็บไว้ใน Cloud หรือ Drive ของทางโครงการ ฯ ร่วมกับฝ่ายทรัพยากรบุคคลองค์การบริหารนิสิตจุฬาลงกรณ์มหาวิทยาลัย (HR) และฝ่ายวิจัยและพัฒนาองค์กรองค์การบริหารนิสิตจุฬาลงกรณ์มหาวิทยาลัย (R&D)",
                    },
                  ],
                },
              ],
            },
            {
              text: "ระยะเวลาในการเก็บรักษาข้อมูลส่วนบุคคล",
              children: [
                {
                  kind: "list",
                  items: [
                    {
                      text: "ระยะเวลาในการประมวลผลข้อมูลอยู่ที่ 270 วัน นับแต่วันที่ดำเนินการเก็บรวบรวมข้อมูลเข้าสู่ระบบ หรือวันงาน CU First Date 2026",
                    },
                    {
                      text: "เมื่อพ้นระยะเวลาการจัดเก็บ ทางโครงการ ฯ จะไม่มีสิทธิหรือไม่สามารถอ้างฐานในการประมวลผลข้อมูลส่วนบุคคลของท่าน และทางโครงการ ฯ จะดำเนินการทำลายข้อมูลส่วนบุคคลนั้นด้วยการลบข้อมูลส่วนบุคคลทั้งหมดจนข้อมูลนั้นไม่สามารถระบุถึงตัวตนเจ้าของข้อมูลส่วนบุคคลได้ และจะดำเนินการให้แล้วเสร็จภายใน 100 วันนับแต่วันสิ้นสุดระยะเวลาดังกล่าว",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      heading: "สิทธิของเจ้าของข้อมูลส่วนบุคคล",
      blocks: [
        {
          kind: "p",
          text: "พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 มีวัตถุประสงค์เพื่อให้ข้อมูลส่วนบุคคลของท่านอยู่ในความควบคุมของท่านได้มากขึ้น โดยท่านสามารถใช้สิทธิของท่านตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล ซึ่งมีรายละเอียดดังต่อไปนี้",
        },
        {
          kind: "list",
          items: [
            {
              text: "สิทธิในการเพิกถอนความยินยอม (Right to withdraw consent)",
              children: [
                {
                  kind: "p",
                  text: "ท่านมีสิทธิในการเพิกถอนความยินยอมในการประมวลผลข้อมูลส่วนบุคคลที่ท่านได้ให้ความยินยอมกับโครงการ ฯ ได้ ตลอดระยะเวลาที่ข้อมูลส่วนบุคคลของท่านอยู่กับโครงการ ฯ",
                },
              ],
            },
            {
              text: "สิทธิในการเข้าถึงข้อมูลส่วนบุคคล (Right to access)",
              children: [
                {
                  kind: "p",
                  text: "ท่านมีสิทธิในการเข้าถึงข้อมูลส่วนบุคคลของท่านและขอให้โครงการ ฯ ทำสำเนาข้อมูลส่วนบุคคลดังกล่าวให้แก่ท่านรวมถึงขอให้โครงการ ฯ เปิดเผยการได้มาซึ่งข้อมูลส่วนบุคคลที่ท่านไม่ไห้ความยินยอมต่อโครงการ ฯ ได้",
                },
              ],
            },
            {
              text: "สิทธิในการแก้ไขข้อมูลส่วนบุคคลให้ถูกต้อง (Right of rectification)",
              children: [
                {
                  kind: "p",
                  text: "ท่านมีสิทธิในการขอให้โครงการ ฯ แก้ไขข้อมูลที่ไม่ถูกต้อง หรือ เพิ่มเติมข้อมูลที่ไม่สมบูรณ์ได้",
                },
              ],
            },
            {
              text: "สิทธิในการลบข้อมูลส่วนบุคคล (Right to erasure)",
              children: [
                {
                  kind: "p",
                  text: "ท่านมีสิทธิในการขอให้โครงการ ฯ ทำการลบข้อมูลของท่านหลังจากครบกำหนดระยะเวลาที่ตกลงไว้ หรือหากท่านต้องการเพิกถอนความยินยอมได้",
                },
              ],
            },
            {
              text: "สิทธิในการระงับการใช้ข้อมูลส่วนบุคคล (Right to restriction of processing)",
              children: [
                {
                  kind: "p",
                  text: "ท่านมีสิทธิในการระงับการใช้ข้อมูลส่วนบุคคลของท่านชั่วคราวได้",
                },
              ],
            },
            {
              text: "สิทธิในการให้โอนย้ายข้อมูลส่วนบุคคล (Right to data portability)",
              children: [
                {
                  kind: "p",
                  text: "ท่านมีสิทธิในการโอนย้ายข้อมูลส่วนบุคคลของท่านที่ท่านให้ไว้กับโครงการ ฯ ในรูปแบบที่อ่านหรือใช้งานได้โดยทั่วไป ไปยังผู้ควบคุมข้อมูลรายอื่น หรือตัวท่านเองได้",
                },
              ],
            },
            {
              text: "สิทธิในการคัดค้านการประมวลผลข้อมูลส่วนบุคคล (Right to object)",
              children: [
                {
                  kind: "p",
                  text: "ท่านมีสิทธิในการคัดค้านการเก็บรวบรวม ใช้ ประเมินผล หรือเปิดเผยข้อมูลส่วนบุคคลของตนเองเมื่อใดก็ได้",
                },
              ],
            },
          ],
        },
        {
          kind: "p",
          text: "โดยท่านสามารถติดต่อมายังเจ้าหน้าที่ของโครงการ ฯ ได้ เพื่อดำเนินการยื่นคำร้องดำเนินการตามสิทธิข้างต้น (รายละเอียดการติดต่อปรากฏในหัวข้อ “ข้อมูลติดต่อของผู้ควบคุมข้อมูล” ด้านล่างนี้)",
        },
        {
          kind: "p",
          text: "ทั้งนี้ การใช้สิทธิดังกล่าวข้างต้นอาจมีการใช้ระยะเวลานานในการดำเนินการของทางโครงการ ฯ เพื่อดำเนินการให้สมประโยชน์ของท่านที่สุด",
        },
      ],
    },
    {
      heading: "ข้อมูลติดต่อของผู้ควบคุมข้อมูล",
      blocks: [
        {
          kind: "defs",
          items: [
            { term: "ชื่อ - นามสกุล", definition: "นายพัสกร ยืนยง" },
            {
              term: "ตำแหน่ง",
              definition: "ประธานฝ่ายพัฒนาระบบพัฒนาสารสนเทศ (ISD)",
            },
            {
              term: "สถานที่ติดต่อ",
              definition:
                "ชั้น 3 อาคารจุลจักรพงษ์ 254 ถนนพญาไท แขวงวังใหม่ เขตปทุมวัน กรุงเทพมหานคร 10330",
            },
            { term: "หมายเลขโทรศัพท์", definition: "064-952-7661" },
            { term: "อีเมล", definition: "isd@sgcu.in.th" },
          ],
        },
      ],
    },
  ],
  consentLabel: "ข้าพเจ้ายอมรับเงื่อนไขและยินยอมให้เปิดเผยข้อมูลส่วนบุคคล",
  ui: {
    scrollDown: "เลื่อนลงล่างสุด",
    scrollUp: "เลื่อนขึ้นบนสุด",
    consentAction: "รับทราบและยินยอม",
  },
};

const EN: PdpaContent = {
  title: ["Personal Data", "Protection Policy"],
  subtitle: "CU First Date 2026",
  intro: [
    "Since the importance of personal data protection and privacy is highly considered in the “CU First Date 2026” (Event) and must abide by the relevant regulations.",
    "Thus, this Personal Data Protection Policy (Policy) has been developed and endorsed for both students and outsiders who participate in the event to acknowledge and develop their understandings of the Personal Data Protection Policy as well as the right to access Personal Data for both students and outsiders who attended the event with the content stated below.",
  ],
  sections: [
    {
      heading: "Definition in this policy",
      blocks: [
        {
          kind: "defs",
          items: [
            {
              term: "“Personal Data”",
              definition:
                "means any information relating to a Person, which enables the identification of such Person, whether directly or indirectly, but not including the information of the deceased Persons in particular.",
            },
            {
              term: "“Sensitive Data”",
              definition:
                "means any personal data relating to ethnicities, races, beliefs in creed, religious or philosophy, political opinions, sexual behaviors, criminal records, health information, disabilities, information on labor unions, genetics information, biological information e.g. fingerprint scanning, face scanning etc., or other data which affects the data’s owner in other ways that the Personal Data Protection Commission has declared.",
            },
            {
              term: "“Persons”",
              definition:
                "means both staff in the event as well as the outsiders.",
            },
            {
              term: "“Media”",
              definition:
                "means communicable ways which convey contents of the senders to the receivers according to the purpose.",
            },
            {
              term: "“Photographs”",
              definition: "means images without a single action.",
            },
            {
              term: "“Voices”",
              definition: "means media which can be understood by hearing.",
            },
            {
              term: "“Videos”",
              definition:
                "means media or recording of both actions and sounds through gadgets such as cameras, smartphones, computers, or online media.",
            },
            {
              term: "“Name and Surname”",
              definition:
                "means words which have been recorded or assured by official documents or other relevant documents, to indicate a particular person regardless written in Thai or English.",
            },
            {
              term: "“Student ID”",
              definition:
                "means data consisting of 10-digit numbers authorized by Chulalongkorn University, used for indicating a particular Chulalongkorn University’s student.",
            },
            {
              term: "“Phone number”",
              definition:
                "means a series of numbers specified for a mobile phone, desk phone, or other device, used for communicating.",
            },
            {
              term: "“Emergency contact”",
              definition:
                "means a person who was specified by another person to reach out to them in many ways, in case there’s an uncontrollable or unexpected incident which could lead to a harmful situation for that person.",
            },
            {
              term: "“Faculty”",
              definition:
                "means Department of Chulalongkorn University, which focuses on providing an education for students of the faculty, as well as institute and other departments at the same level.",
            },
            {
              term: "“University”",
              definition: "means Chulalongkorn University",
            },
          ],
        },
      ],
    },
    {
      heading: "Data to be stored",
      blocks: [
        {
          kind: "p",
          text: "The event will collect, within the necessary objectives, the Personal Data including Photographs, Videos, Voices, Name and Surnames, Student ID, Academic year, Faculties, Phone number, Emergency Contacts, and health information, which can be classified as follows:",
        },
        {
          kind: "list",
          items: [
            {
              text: "Personal data",
              children: [
                {
                  kind: "list",
                  items: [
                    {
                      text: "Personal data i.e. Name and Surnames, Student IDs, Academic year, Faculties",
                    },
                    {
                      text: "Contact list i.e. Phone numbers, Emergency contacts",
                    },
                  ],
                },
              ],
            },
            {
              text: "Sensitive data",
              children: [
                {
                  kind: "list",
                  items: [
                    {
                      text: "Health information i.e. food or medicines allergies, congenital disorders, physical limitations",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      heading: "Objective and legal basis for the Personal Data collection",
      blocks: [
        { kind: "p", text: "Objective for the Personal Data collection" },
        {
          kind: "p",
          text: "To ensure that the event can run smoothly, effectively as well as according to the Personal Data Protection Act B.E. 2562. The event would love to inform the objective of collection, usage, and disclosure of Personal Data which belongs to both students and outsiders as stated below.",
        },
        {
          kind: "list",
          items: [
            { text: "To manage and separate tasks throughout the event." },
            {
              text: "To communicate amongst staff both online and off-line, to coordinate and assure that the event can run smoothly.",
            },
            {
              text: "To control, examine and follow up on all the responsibilities of each role, as well as participation records, work evaluation, and follow up in case there are reports or unexpected incidents.",
            },
            {
              text: "To ensure safety for every participant, for instance, making a contact list of the staff in each operating area, following up in emergency circumstances, or in case the staff are needed to be reached out to.",
            },
            {
              text: "To make reports and other documents which are relevant to the event i.e. making reports to the University, taking Photographs throughout the Project, making participation certifications or other documents that need to be authorized by the University.",
            },
            {
              text: "To retrospectively check and operate work according to the Project Policy, as well as corresponding with the Human Resources department of the Student Government of Chulalongkorn University and the Research and Development department of the Student Government of Chulalongkorn University (if necessary). In case there are reports or inappropriate behaviors which need to be examined by the relevant departments.",
            },
          ],
        },
        {
          kind: "p",
          text: "The event shall compile, use and disclose data only as necessary, the security of Personal Data will be kept strictly. Furthermore, the event would not conduct any data usage in a way that can violate rights or other objectives without consent.",
        },
        { kind: "p", text: "Legal Basis for Processing Personal Data" },
        {
          kind: "p",
          text: "Pursuant to Section 24 of the Personal Data Protection Act B.E. 2562 (2019), consent is generally recognized as a principal legal basis for the processing of personal data. However, where the processing cannot be based on consent, other lawful bases may be relied upon, including contractual necessity, legitimate interests, compliance with legal obligations, and other grounds prescribed by law. Accordingly, the processing of your personal data by the Project is carried out in accordance with the aforementioned Act and is based on the following legal grounds:",
        },
        {
          kind: "list",
          items: [
            {
              text: "Contractual Basis",
              children: [
                {
                  kind: "p",
                  text: "For the purpose of taking steps at your request prior to entering into a contract and for performing contractual obligations or agreements relating to your participation in the Project, including registration, communication and coordination, identity verification, and the provision of services associated with the Project, the Project shall process your personal data only to the extent necessary. Processing under the contractual basis does not require your consent, provided that such processing is necessary and directly related to the performance of the contract.",
                },
              ],
            },
            {
              text: "Consent Basis",
              children: [
                {
                  kind: "p",
                  text: "Where consent is required by law, or where no other lawful basis is applicable, the Project shall obtain your consent prior to the collection, use, or disclosure of your personal data. You have the right to withdraw your consent at any time. Such withdrawal shall not affect the lawfulness of any processing carried out on the basis of consent before its withdrawal.",
                },
              ],
            },
            {
              text: "Legitimate Interests Basis",
              children: [
                {
                  kind: "p",
                  text: "The Project may process your personal data where such processing is necessary for the legitimate interests pursued by the Project, provided that such interests do not override your fundamental rights, freedoms, and interests. Processing under this basis includes, without limitation, maintaining information security, monitoring system usage, handling complaints, risk management, conducting analyses and performance evaluations, as well as developing and improving the Project’s operations and activities.",
                },
              ],
            },
            {
              text: "Legal Obligation Basis",
              children: [
                {
                  kind: "p",
                  text: "For the purpose of complying with applicable laws, regulations, rules, university requirements, and other binding obligations, the Project shall process your personal data only to the extent necessary and for lawful purposes. Appropriate safeguards shall be implemented to protect your rights, freedoms, and interests in accordance with applicable laws.",
                },
              ],
            },
            {
              text: "Vital Interests Basis",
              children: [
                {
                  kind: "p",
                  text: "Processing may be carried out where it is necessary to protect the vital interests of the data subject or another person, such as preventing serious threats to life, health, or physical safety. This legal basis shall only be relied upon in circumstances where the data subject is incapable of giving consent and no other means are available to safeguard such vital interests without processing the personal data concerned.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      heading: "Sources of personal data",
      blocks: [
        {
          kind: "p",
          text: "The event shall receive Personal Data through various ways such as event questionnaires, event’s social network platform, a recording of Videos, Photographs, Voices of the event staff on 18/07/2026 (or the event day)",
        },
      ],
    },
    {
      heading: "Personal Data processing",
      blocks: [
        {
          kind: "p",
          text: "After receiving Personal Data from all the sources stated above, the event shall process your Personal Data as stated below.",
        },
        {
          kind: "list",
          items: [
            {
              text: "General Personal Data Processing",
              children: [
                {
                  kind: "p",
                  text: "General Personal Data shall be kept in the Cloud/Drive of the event, for event operation and internal management purposes. People who are authorized to access these data are as follows:",
                },
                {
                  kind: "list",
                  items: [
                    { text: "Human Resources department (HR)" },
                    { text: "Research and development department (R&D)" },
                    {
                      text: "Other relevant staff according to the necessity and reasonable reasons to access this data.",
                    },
                  ],
                },
                {
                  kind: "p",
                  text: "Disclosure of the Personal Data to outsiders is allowed only in crucial and legally accepted circumstances.",
                },
                {
                  kind: "p",
                  text: "The process must not violate the Personal Data subject and must comply with the principle of necessity and appropriation of data usage according to the Personal Data Protection Act.",
                },
              ],
            },
            {
              text: "Sensitive Personal Data Processing",
              children: [
                {
                  kind: "p",
                  text: "Sensitive Personal Data shall be kept separately from General Personal Data, with an increased security measure. People who are exclusively authorized to access sensitive personal data are as follows:",
                },
                {
                  kind: "list",
                  items: [
                    { text: "Head of Human Resources department (HR)" },
                    {
                      text: "Staff who are officially assigned from Head of Human Resources department",
                    },
                    {
                      text: "Operating students, staff, or other people who are directly relevant to giving first-aid can access after receiving permission by Head of Human Resources occasionally",
                    },
                  ],
                },
                {
                  kind: "p",
                  text: "Sensitive Personal Data disclosure must be done within 7 days, and deleting or eliminating the disclosed data must be done after data disclosure immediately.",
                },
                {
                  kind: "p",
                  text: "Any Sensitive Personal Data disclosure must be under the control and supervised strictly by the Head of Human Resources department or staff who are assigned from the Head of Human Resources department.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      heading: "Storage, and Retention Period of Personal Data",
      blocks: [
        {
          kind: "list",
          items: [
            {
              text: "Storage of Personal Data",
              children: [
                {
                  kind: "p",
                  text: "Data controller shall store your Personal Data as follows:",
                },
                {
                  kind: "list",
                  items: [
                    {
                      text: "The storage will be on a registration form, another online system operating by the name of the event, Excel, Drive as well as Photographs or Videos stored by the name of the event.",
                    },
                    {
                      text: "The data storage location is the Drive of the event, with the Human Resources department of the Student Government of Chulalongkorn University and the Research and Development department of the Student Government of Chulalongkorn University.",
                    },
                  ],
                },
              ],
            },
            {
              text: "Retention Period of Personal Data",
              children: [
                {
                  kind: "list",
                  items: [
                    {
                      text: "The time of the data processing is 270 days, since storing data into the system (on the CU First Date event day).",
                    },
                    {
                      text: "After passing the storage period, which the event has either rights or appropriate claims to processing those Personal Data anymore, the event will process an elimination of those Personal Data by deleting all Personal Data until reaching the Personal Data subject is impeccable and must be done within 100 days.",
                    },
                    {
                      text: "Moreover, to assure your benefits, the process stated above might take some time.",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      heading: "Rights of the personal data subject",
      blocks: [
        {
          kind: "p",
          text: "The Personal Data Protection Act B.E. 2562 (2019) has the main objective to make Personal Data more controllable, meanwhile data subject shall exercise your rights according to the Personal Data Protection Act B.E. 2562 (2019) as follows.",
        },
        {
          kind: "list",
          items: [
            {
              text: "Right to withdraw consent",
              children: [
                {
                  kind: "p",
                  text: "The data subject shall withdraw consent to processing Personal Data which was given prior to the event anytime that the event still possesses those data.",
                },
              ],
            },
            {
              text: "Right to access",
              children: [
                {
                  kind: "p",
                  text: "The data subject shall access the Personal Data and be able to request a copy of the Personal Data, as well as how they obtain the Personal Data for which the data subject did not give its consent.",
                },
              ],
            },
            {
              text: "Right of rectification",
              children: [
                {
                  kind: "p",
                  text: "The subject of data shall request the project to edit the incorrect information or add incomplete information.",
                },
              ],
            },
            {
              text: "Right to erasure",
              children: [
                {
                  kind: "p",
                  text: "The data subject shall request the event to erase your Personal Data with supporting reasons.",
                },
              ],
            },
            {
              text: "Right to restriction of processing",
              children: [
                {
                  kind: "p",
                  text: "The data subject shall restrict the usage of Personal Data with supporting reasons.",
                },
              ],
            },
            {
              text: "Right to data portability",
              children: [
                {
                  kind: "p",
                  text: "The data subject shall transfer Personal Data which was given to the event to another data controller or the data subject themselves with supporting reasons.",
                },
              ],
            },
            {
              text: "Right to object",
              children: [
                {
                  kind: "p",
                  text: "The data subject shall object to the data processing.",
                },
              ],
            },
          ],
        },
        {
          kind: "p",
          text: "The data subject shall contact the staffs of the project for proceeding to file a petition to exercise rights stated above (contacting details as mentioned in “contact us” below)",
        },
        {
          kind: "p",
          text: "Furthermore, to assure your benefits, exercising these rights might take some time.",
        },
      ],
    },
    {
      heading: "Contact us",
      blocks: [
        {
          kind: "defs",
          items: [
            { term: "Name & surname", definition: "Mr. Phatsakorn Yuenyong" },
            {
              term: "Position",
              definition: "Head of Information System Development (ISD)",
            },
            {
              term: "Address",
              definition:
                "3rd Floor, Chulachakrabongse Building, 254 Phayathai Road, Wang Mai Subdistrict, Pathum Wan District, Bangkok 10330, Thailand",
            },
            { term: "Telephone", definition: "+66 64-952-7661" },
            { term: "Email", definition: "isd@sgcu.in.th" },
          ],
        },
      ],
    },
  ],
  consentLabel:
    "I accept the terms and consent to the disclosure of my personal data",
  ui: {
    scrollDown: "Scroll to bottom",
    scrollUp: "Scroll to top",
    consentAction: "Acknowledge and consent",
  },
};

export const PDPA_CONTENT: Record<LocaleType, PdpaContent> = { th: TH, en: EN };
