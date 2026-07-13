import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import { GiftIcon } from "lucide-react";
import { useT } from "@lib/i18n/useT";
import { getImageUrl } from "@lib/function";
export default function SocialSection() {
  const t = useT();
  const InstagramIconUrl = getImageUrl("@assets/images/Instagram.svg");
  const TikTokIconUrl = getImageUrl("@assets/images/TikTok.svg");

  return (
    <MonotoneNoiseContainer className="grow bg-rpkm-red border rounded-t-4xl flex flex-col p-4 gap-4 mt-6">
      <MonotoneNoiseContainer className="bg-[#FFFAC9] border rounded-4xl flex flex-col p-4">
        <h2 className="text-xl font-bold flex items-baseline gap-2">
          IG Story – Add Yours <img alt="" src={InstagramIconUrl} />
        </h2>
        <p className="mt-2">{t("myfreshystory.header.description")}</p>
        <div className="flex items-center gap-1 my-4">
          <GiftIcon color="#E65325" className="inline" />{" "}
          {t("myfreshystory.igstory.gift")}
        </div>
        <div>
          <p className="fontSocialCardContainer-bold">
            {t("myfreshystory.igstory.howto")}
          </p>
          <div className="flex flex-col gap-2 pt-3 w-full text-center *:bg-[#D7F4FF] *:py-1 *:border *:rounded-4xl">
            <MonotoneNoiseContainer>
              {t("myfreshystory.igstory.finish")}
            </MonotoneNoiseContainer>
            <MonotoneNoiseContainer>
              {t("myfreshystory.igstory.share")}
            </MonotoneNoiseContainer>
            <MonotoneNoiseContainer>
              {t("myfreshystory.igstory.announce")}
            </MonotoneNoiseContainer>
          </div>
        </div>
      </MonotoneNoiseContainer>
      <MonotoneNoiseContainer className="bg-[#FFFAC9] border rounded-4xl flex flex-col p-4">
        <h2 className="text-xl font-bold flex items-baseline gap-2">
          Reels / TikTok <img alt="" src={TikTokIconUrl} />
        </h2>
        <p className="mt-2">{t("myfreshystory.reelstiktok.description")}</p>
        <div className="flex flex-wrap gap-4 my-4">
          <div>
            <p className="font-bold">
              {t("myfreshystory.reelstiktok.activity")}
            </p>
            <ul className="pl-4 list-disc">
              <li>Chula Jigsaw Journey</li>
              <li>Chula QR Quest</li>
              <li>Field Trip</li>
            </ul>
          </div>
          <div>
            <p className="font-bold">
              {t("myfreshystory.reelstiktok.rules.title")}
            </p>
            <ul className="pl-4 list-disc">
              <li>{t("myfreshystory.reelstiktok.rules.length")}</li>
              <li>{t("myfreshystory.reelstiktok.rules.public")}</li>
              <li>{t("myfreshystory.reelstiktok.rules.hastag")}</li>
            </ul>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap justify-center gap-2 w-full text-sm text-center *:bg-[#D7F4FF] *:px-2 *:py-1 *:border *:rounded-4xl">
            <MonotoneNoiseContainer>
              #jigsawjourneyxrubpuenkaomai2026
            </MonotoneNoiseContainer>
            <MonotoneNoiseContainer>
              #CSRxrubpuenkaomai2026
            </MonotoneNoiseContainer>
            <MonotoneNoiseContainer>
              {" "}
              #CSRxmyfreshystory{" "}
            </MonotoneNoiseContainer>
          </div>
        </div>
      </MonotoneNoiseContainer>
    </MonotoneNoiseContainer>
  );
}
