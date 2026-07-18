import { useEffect, useRef, useState } from "react";

import { toast } from "sonner";

import { uploadAvatar } from "@lib/api/avatar";
import { APIError } from "@lib/client";
import { refreshSession } from "@lib/auth/session";
import { useSession } from "@lib/auth/useSession";

import { EditPencil } from "./EditPencil";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Profile-photo box. Better Auth seeds `user.image` from the Google account;
 * the pencil replaces it via POST /v1/me/avatar (backend recompresses to a
 * ≤512px webp and updates the session user).
 */
export function AvatarEditor() {
  const session = useSession();
  const image = session.status === "authenticated" ? session.user.image : null;

  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Revoke the outstanding preview blob on unmount.
  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  const onPick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_UPLOAD_BYTES) {
      toast.error("ไฟล์ต้องเป็น JPEG/PNG/WebP และไม่เกิน 15MB");
      return;
    }

    // Kept until the next pick/unmount (revoking on success would flash while
    // the remote image loads); the previous blob is revoked here so repeated
    // picks don't leak.
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const localUrl = URL.createObjectURL(file);
    previewRef.current = localUrl;
    setPreview(localUrl);
    setBusy(true);
    try {
      await uploadAvatar(file);
      await refreshSession();
    } catch (err) {
      setPreview(null);
      URL.revokeObjectURL(localUrl);
      if (previewRef.current === localUrl) previewRef.current = null;
      // A 401 already redirects to /landing (client.ts) — no "try again" toast.
      if (!(err instanceof APIError && err.status === 401)) {
        toast.error("อัปโหลดรูปไม่สำเร็จ ลองใหม่อีกครั้ง");
      }
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
