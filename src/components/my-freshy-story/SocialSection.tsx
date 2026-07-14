import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import { GiftIcon } from "lucide-react";
import { useT } from "@lib/i18n/useT";
import { getImageUrl } from "@lib/function";
import ListChip from "./ListChip";
export default function SocialSection() {
  const t = useT();
  const InstagramIconUrl = getImageUrl("@assets/images/Instagram.svg");
  const TikTokIconUrl = getImageUrl("@assets/images/TikTok.svg");

  return (
    <MonotoneNoiseContainer className="grow bg-rpkm-red border rounded-t-4xl flex flex-col p-4 gap-4 mt-6">
      <MonotoneNoiseContainer className="bg-rpkm-beige border rounded-4xl flex flex-col p-4">
        <h2 className="text-xl font-bold flex items-baseline gap-2">
          IG Story – Add Yours <img alt="" src={InstagramIconUrl} />
        </h2>
        <p className="mt-2">{t("myfreshystory.header.description")}</p>
        <div className="flex items-center gap-1 my-4">
          <GiftIcon color="#E65325" className="inline" />{" "}
          {t("myfreshystory.igstory.gift")}
        </div>
        <div>
          <p className="font-bold">{t("myfreshystory.igstory.howto")}</p>
          <div className="flex flex-col gap-2 pt-3 w-full text-center">
            <ListChip>{t("myfreshystory.igstory.finish")}</ListChip>
            <ListChip>{t("myfreshystory.igstory.share")}</ListChip>
            <ListChip>{t("myfreshystory.igstory.announce")}</ListChip>
          </div>
        </div>
      </MonotoneNoiseContainer>
      <MonotoneNoiseContainer className="bg-rpkm-beige border rounded-4xl flex flex-col p-4">
        <h2 className="text-xl font-bold flex items-baseline gap-2">
          Reels / TikTok <img alt="" src={TikTokIconUrl} />
        </h2>
        <p className="mt-2">{t("myfreshystory.reelstiktok.description")}</p>
        <div className="my-2">
          <p className="font-bold mb-1">
            {t("myfreshystory.reelstiktok.activity")}
          </p>
          <div className="flex flex-wrap justify-center gap-1 text-sm">
            <ListChip>Chula Jigsaw Journey</ListChip>
            <ListChip>Chula QR Quest</ListChip>
            <ListChip>Field Trip</ListChip>
          </div>
        </div>
        <div className="mt-2">
          <p className="font-bold">
            {t("myfreshystory.reelstiktok.rules.title")}
          </p>
          <p className="mb-2">
            {t("myfreshystory.reelstiktok.rules.description")}
          </p>
          <div className="flex flex-wrap gap-2 w-full text-sm text-center">
            <ListChip>#jigsawjourneyxrubpuenkaomai2026</ListChip>
            <ListChip>#CSRxrubpuenkaomai2026</ListChip>
            <ListChip>#CSRxmyfreshystory</ListChip>
          </div>
        </div>
      </MonotoneNoiseContainer>
    </MonotoneNoiseContainer>
  );
}
