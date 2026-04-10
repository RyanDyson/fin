import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";
import { Resend } from "resend";
import { env } from "@/env";
import { db } from "@/server/db";

const resend = new Resend(env.RESEND_API_KEY);
const fromEmail = env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

function getBaseURL(): string {
  // Explicit config always wins (set this in Vercel dashboard to your deployment URL)
  if (env.BETTER_AUTH_URL) return env.BETTER_AUTH_URL;
  // VERCEL_URL is injected automatically but without a protocol
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3100";
}

export const auth = betterAuth({
  baseURL: getBaseURL(),
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click the link below to reset your password:</p><p><a href="${url}">Reset Password</a></p><p>This link expires in 1 hour.</p>`,
      });
    },
  },
  socialProviders: {
    github: {
      clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ user, otp }) {
          await resend.emails.send({
            from: fromEmail,
            to: user.email,
            subject: "Your verification code",
            html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 5 minutes.</p>`,
          });
        },
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
