import { API } from "@lib/client";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
};

export type GetSessionResponse = {
  user: SessionUser;
  session: {
    id: string;
    expiresAt: string;
    token: string;
  };
} | null;

export function getSession() {
  return API.get<GetSessionResponse>("/v1/auth/get-session");
}

export type SignInSocialResponse = {
  url: string;
  redirect: boolean;
};

export function signInWithGoogle(callbackURL: string) {
  return API.post<SignInSocialResponse>("/v1/auth/sign-in/social", {
    provider: "google",
    callbackURL,
  });
}

export function signOut() {
  return API.post<{ success: boolean }>("/v1/auth/sign-out");
}
