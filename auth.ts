import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./auth.db"),
  secret: process.env.BETTER_AUTH_SECRET ?? "",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      accessType: "offline",
      prompt: "select_account",
      getUserInfo: async (token) => {
        const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });
        const profile = await response.json();

        // Check authorization BEFORE creating the user
        const allowedEmail: string | undefined = process.env.ALLOWED_EMAIL;
        if (allowedEmail && String(profile.email).toLowerCase() !== allowedEmail.toLowerCase()) {
          throw new APIError("UNAUTHORIZED", {
            message: "No tienes permiso para acceder a esta aplicación.",
          });
        }

        return {
          user: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            emailVerified: profile.verified_email,
          },
          data: profile,
        };
      },
    },
  },

  emailVerification: {
    sendVerificationEmail: async (data, url): Promise<void> => {
      console.log(`Verification email would be sent to ${data.user.email}: ${url}`);
    },
  },
});
