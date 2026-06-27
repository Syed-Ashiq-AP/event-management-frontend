import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8000",
});
export const handleGithub = async (signUp: boolean = false) => {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: "http://localhost:5173/",
    requestSignUp: signUp,
  });
};

export const handleGoogle = async (signUp: boolean = false) => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "http://localhost:5173/",
    requestSignUp: signUp,
  });
};
