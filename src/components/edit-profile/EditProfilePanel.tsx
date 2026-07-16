import { useQuery } from "@tanstack/react-query";

import rpkmLogo from "@assets/images/rpkm_logo.png";
import { NavigationMenu } from "@components/shared/NavigationMenu";
import { QueryProvider } from "@components/shared/QueryProvider";
import { getProfile } from "@lib/api/rpkm";
import { useT } from "@lib/i18n/useT";

import { AvatarEditor } from "./AvatarEditor";
import { HealthCard, PersonalCard, TravelCard } from "./SummaryCards";

function Overview() {
  const t = useT();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["rpkm-profile"],
    queryFn: getProfile,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <p className="text-muted-foreground">{t("editProfile.loading")}</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <p className="text-destructive">{t("editProfile.loadError")}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
      <div className="relative mt-6 shrink-0 px-6">
        <div className="absolute top-0 right-4 flex items-center gap-1">
          <NavigationMenu />
        </div>
        <img
          src={rpkmLogo.src}
          alt={t("register.logoAlt")}
          className="mx-auto h-auto w-28"
        />
        <h1 className="mt-2 text-center text-2xl font-bold text-foreground">
          {t("editProfile.heading")}
        </h1>
      </div>

      <div className="no-scrollbar mt-4 min-h-0 flex-1 overflow-y-auto px-6 pb-10">
        <AvatarEditor />
        <PersonalCard profile={data} />
        <HealthCard profile={data} />
        <TravelCard profile={data} />
      </div>
    </div>
  );
}

export function EditProfilePanel() {
  return (
    <QueryProvider>
      <Overview />
    </QueryProvider>
  );
}
