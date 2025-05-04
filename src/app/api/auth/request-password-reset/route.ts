import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { randomBytes, createHash } from "crypto";

let resend: Resend | null = null;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.error("Failed to initialize Resend:", error);
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // IMPORTANT: Always return a success-like response even if user not found
    // This prevents email enumeration attacks.
    if (!user || !user.emailVerified) {
      console.log(
        `Password reset requested for non-existent or unverified email: ${email}`
      );
      return NextResponse.json({
        message:
          "If an account with this email exists and is verified, a password reset link has been sent.",
      });
    }

    // Generate a raw token and a hashed token
    const rawToken = randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256").update(rawToken).digest("hex");
    const tokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store the hashed token and expiry in the database
    await db
      .update(users)
      .set({
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpires: tokenExpires,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Send the password reset email with the raw token
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

    try {
      if (!resend) {
        throw new Error("Email service is not configured");
      }
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset Your Password",
        html: `
          <h1>Password Reset Request</h1>
          <p>Hi ${user.name || "there"},</p>
          <p>You requested a password reset. Click the link below to set a new password:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link is valid for 1 hour. If you didn't request this, please ignore this email.</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Clear the token we just set since we couldn't send the email
      await db
        .update(users)
        .set({
          resetPasswordToken: null,
          resetPasswordTokenExpires: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      return NextResponse.json(
        {
          error: "Failed to send password reset email. Please try again later.",
          details:
            emailError instanceof Error
              ? emailError.message
              : "Email service is currently unavailable.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      message:
        "If an account with this email exists and is verified, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Request password reset error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
