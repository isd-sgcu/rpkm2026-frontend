import { API } from "@lib/client";

type SuccessResponse<T> = {
  success: true;
  data: T;
};

/** Uploads a new profile picture (jpeg/png/webp ≤15MB — the backend
 *  recompresses to a 512×512 webp) and returns its public URL. The session's
 *  `user.image` is updated server-side; call `refreshSession()` after. */
export async function uploadAvatar(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await API.post<SuccessResponse<{ url: string }>>(
    "/v1/me/avatar",
    form,
  );
  return res.data.url;
}
