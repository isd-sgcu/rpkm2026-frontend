import { Loader2 } from "lucide-react";

import { useAccessGuard } from "@lib/auth/useAccessGuard";

type Props = {
  pathname: string;
};

export function AuthGuard({ pathname }: Props) {
  const { ready } = useAccessGuard(pathname);

  if (ready) return null;

  return (
    <div className="fixed inset-0 z-9999 grid place-items-center bg-background">
      <Loader2 className="size-8 animate-spin text-foreground" />
    </div>
  );
}
