import { useRef, useState } from "react";

import { toast } from "sonner";

import { uploadAvatar } from "@lib/api/avatar";
import { refreshSession } from "@lib/auth/session";
import { useSession } from "@lib/auth/useSession";

import { EditPencil } from "./EditPencil";

/**
 * Profile-photo box. Better Auth seeds `user.image` from the Google account;
 * the pencil replaces it via POST /v1/me/avatar (backend recompresses to a
 * 512×512 webp and updates the session user).
 */
export function AvatarEditor() {
  const session = useSession();
  const image = session.status === "authenticated" ? session.user.image : null;

  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onPick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    // ponytail: object URL kept until the next pick/unmount — one tiny blob,
    // revoking on success would flash while the remote image loads.
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setBusy(true);
    try {
      await uploadAvatar(file);
      await refreshSession();
    } catch {
      setPreview(null);
      URL.revokeObjectURL(localUrl);
      toast.error("อัปโหลดรูปไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative mx-auto w-40">
      <div className="aspect-square w-40 overflow-hidden rounded-2xl bg-rpkm-grey">
        {(preview ?? image) && (
          <img
            src={preview ?? image ?? undefined}
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        aria-label="แก้ไขรูปโปรไฟล์"
        className="bg-muted absolute -right-2 -bottom-2 grid size-11 place-items-center rounded-full disabled:opacity-50"
      >
        <EditPencil />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onPick}
      />
    </div>
  );
}
