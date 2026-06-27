import { createAuthClient } from "better-auth/client";
const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const authClient = createAuthClient({
  baseURL: API_URL.replace("/api", ""),
});
export const handleGithub = async (signUp: boolean = false) => {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: BASE_URL,
    requestSignUp: signUp,
  });
};

export const handleGoogle = async (signUp: boolean = false) => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: BASE_URL,
    requestSignUp: signUp,
  });
};
