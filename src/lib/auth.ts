import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { env } from "@/env";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true, // This replaces the default email verification
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`Sending OTP to ${email}: ${otp} (type: ${type})`);

        let subject: string;
        let html: string;

        if (type === "email-verification") {
          subject = "Verify your QuickCourt account";
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; text-align: center;">Welcome to QuickCourt!</h2>
              <p style="color: #666; font-size: 16px;">Thank you for signing up. Please verify your email address with the code below:</p>
              <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                <h1 style="color: #333; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you didn't create an account, please ignore this email.</p>
              <p style="color: #666; font-size: 14px;">Best regards,<br>The QuickCourt Team</p>
            </div>
          `;
        } else if (type === "forget-password") {
          subject = "Reset your QuickCourt password";
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; text-align: center;">Password Reset</h2>
              <p style="color: #666; font-size: 16px;">Please use the verification code below to reset your password:</p>
              <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                <h1 style="color: #333; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you didn't request a password reset, please ignore this email.</p>
              <p style="color: #666; font-size: 14px;">Best regards,<br>The QuickCourt Team</p>
            </div>
          `;
        } else {
          subject = "QuickCourt verification code";
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; text-align: center;">Verification Code</h2>
              <p style="color: #666; font-size: 16px;">Please use the verification code below:</p>
              <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                <h1 style="color: #333; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
              <p style="color: #666; font-size: 14px;">Best regards,<br>The QuickCourt Team</p>
            </div>
          `;
        }

        try {
          console.log(`Attempting to send email via Resend to: ${email}`);
          const result = await resend.emails.send({
            from: "QuickCourt <noreply@krishkoria.com>",
            to: [email],
            subject,
            html,
          });
          console.log("Email sent successfully:", result);
        } catch (error) {
          console.error("Failed to send OTP email:", error);
          // Log the full error details for debugging
          if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
          }
          throw new Error("Failed to send verification email");
        }
      },
      otpLength: 6,
      expiresIn: 600, // 10 minutes
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
});
