import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import { GiftIcon } from "lucide-react";
import { useT } from "@lib/i18n/useT";
import { getImageUrl } from "@lib/function";
import ListChip from "./ListChip";
export default function SocialSection() {
  const t = useT();
  const InstagramIconUrl = getImageUrl("instagram_orange.svg");
  const TikTokIconUrl = getImageUrl("tiktok_orange.svg");

  return (
    <MonotoneNoiseContainer className="grow bg-rpkm-red border rounded-t-4xl flex flex-col p-4 gap-4 mt-6">
      <MonotoneNoiseContainer className="bg-rpkm-beige border rounded-4xl flex flex-col p-4">
        <div>
          <a
            href="https://www.instagram.com/rubpuenkaomai2026"
            target="_blank"
            rel="noreferrer"
            className="text-xl font-bold flex items-center gap-2 w-fit"
          >
            IG Story – Add Yours{" "}
            <img
              className="-translate-0.5"
              width={24}
              alt=""
              src={InstagramIconUrl}
            />
          </a>
          <p className="text-sm">instagram : rubpuenkaomai2026</p>
        </div>
        <p className="mt-2">{t("myfreshystory.header.description")}</p>
        <div className="flex items-center gap-1 my-4">
          <GiftIcon color="#E65325" className="inline" />{" "}
          {t("myfreshystory.igstory.gift")}
        </div>
        <div>
          <p className="font-bold">{t("myfreshystory.igstory.howto")}</p>
          <ul className="pl-4 pt-2 list-disc">
            <li>{t("myfreshystory.igstory.finish")}</li>
            <li>{t("myfreshystory.igstory.share")}</li>
            <li>{t("myfreshystory.igstory.announce")}</li>
          </ul>
        </div>
      </MonotoneNoiseContainer>
      <MonotoneNoiseContainer className="bg-rpkm-beige border rounded-4xl flex flex-col p-4">
        <a
          href="https://www.tiktok.com/@rubpuenkaomai2026"
          target="_blank"
          rel="noreferrer"
          className="text-xl font-bold flex items-center gap-2 w-fit"
        >
          Reels / TikTok{" "}
          <img
            className="-translate-0.5"
            width={24}
            alt=""
            src={TikTokIconUrl}
          />
        </a>
        <p className="mt-2">{t("myfreshystory.reelstiktok.description")}</p>
        <div className="flex flex-wrap gap-4 my-4 text-sm">
          <div className="min-w-1/2">
            <p className="font-bold">
              {t("myfreshystory.reelstiktok.activity")}
            </p>
            <ul className="pl-4 list-disc">
              <li>Chula Jigsaw Journey</li>
              <li>Chula QR Quest</li>
              <li>Field Trip</li>
            </ul>
          </div>
          <div className="w-max">
            <p className="font-bold">
              {t("myfreshystory.reelstiktok.rules.title")}
            </p>
            <ul className="pl-4 list-disc">
              <li>{t("myfreshystory.reelstiktok.rules.length")}</li>
              <li>{t("myfreshystory.reelstiktok.rules.public")}</li>
              <li>{t("myfreshystory.reelstiktok.rules.hashtag")}</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 w-full text-sm text-center">
          <ListChip>#jigsawjourneyxrubpuenkaomai2026</ListChip>
          <ListChip>#CSRxrubpuenkaomai2026</ListChip>
          <ListChip>#CSRxmyfreshystory</ListChip>
        </div>
      </MonotoneNoiseContainer>
    </MonotoneNoiseContainer>
  );
}
