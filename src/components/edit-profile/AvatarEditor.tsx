import { useSession } from "@lib/auth/useSession";

/**
 * Profile-photo box. The photo comes from the Google account the user signed in
 * with — Better Auth stores it on the session as `user.image`, so it is
 * read-only: the backend has no avatar upload endpoint yet, which is why there
 * is no edit pencil here.
 */
export function AvatarEditor() {
  const session = useSession();
  const image = session.status === "authenticated" ? session.user.image : null;

  return (
    <div className="relative mx-auto w-40">
      <div className="aspect-square w-40 overflow-hidden rounded-2xl bg-rpkm-grey">
        {image && (
          <img
            src={image}
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
