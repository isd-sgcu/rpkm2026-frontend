import { useRef } from "react";

import { useSession } from "@lib/auth/useSession";

import { EditPencil } from "./EditPencil";
import { useAvatarUpload } from "./useAvatarUpload";

/**
 * Profile-photo box. Better Auth seeds `user.image` from the Google account;
 * the pencil replaces it via POST /v1/me/avatar (backend recompresses to a
 * ≤512px webp and updates the session user).
 */
export function AvatarEditor() {
  const session = useSession();
  const image = session.status === "authenticated" ? session.user.image : null;

  const inputRef = useRef<HTMLInputElement>(null);
  const { preview, busy, onPick } = useAvatarUpload();

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
