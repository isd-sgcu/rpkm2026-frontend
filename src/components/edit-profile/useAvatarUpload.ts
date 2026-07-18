import { useEffect, useRef, useState } from "react";

import { toast } from "sonner";

import { uploadAvatar } from "@lib/api/avatar";
import { APIError } from "@lib/client";
import { refreshSession } from "@lib/auth/session";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Shared pick/preview/upload logic for the profile photo — used by both the
 *  edit-profile page's AvatarEditor and the home id-card's inline avatar
 *  edit. Uploads via POST /v1/me/avatar and refreshes the session so
 *  `session.user.image` reflects the new photo everywhere. */
export function useAvatarUpload() {
  const previewRef = useRef<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
      if (!(err instanceof APIError && err.status === 401)) {
        toast.error("อัปโหลดรูปไม่สำเร็จ ลองใหม่อีกครั้ง");
      }
    } finally {
      setBusy(false);
    }
  };

  return { preview, busy, onPick };
}
