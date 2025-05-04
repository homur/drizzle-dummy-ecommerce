import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
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

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"; // Ensure this env var is set

// Password validation function
function isPasswordSecure(password: string): boolean {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  // const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password); // Removed

  return (
    password.length >= minLength && hasUppercase && hasLowercase && hasNumber
    // && hasSpecialChar // Removed
  );
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate basic input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check password complexity
    if (!isPasswordSecure(password)) {
      return NextResponse.json(
        {
          error:
            "Password does not meet security requirements. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.",
        },
        { status: 400 }
      );
    }

    // Check if user already exists but isn't verified
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      if (!existingUser.emailVerified) {
        // Generate new verification token
        const verificationToken = randomBytes(32).toString("hex");
        const hashedToken = createHash("sha256")
          .update(verificationToken)
          .digest("hex");

        // Update user with new token
        await db
          .update(users)
          .set({
            verificationToken: hashedToken,
            verificationTokenExpires: new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ), // 24 hours
          })
          .where(eq(users.id, existingUser.id));

        try {
          // Send new verification email
          if (!resend) {
            throw new Error("Email service is not configured");
          }
          await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Verify your email address",
            html: `
              <h1>Welcome to Drizzle Dummy!</h1>
              <p>Please verify your email address by clicking the link below:</p>
              <a href="${appUrl}/verify-email?token=${verificationToken}">Verify Email</a>
              <p>This link will expire in 24 hours.</p>
            `,
          });
        } catch (emailError) {
          console.error("Failed to send verification email:", emailError);
          return NextResponse.json(
            {
              error:
                "Failed to send verification email. Please try again later.",
              details:
                emailError instanceof Error
                  ? emailError.message
                  : "Email service is currently unavailable.",
            },
            { status: 503 }
          );
        }

        return NextResponse.json(
          { message: "Verification email resent. Please check your inbox." },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        verificationToken: hashedToken,
        verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        emailVerified: false,
      })
      .returning();

    try {
      // Send verification email
      if (!resend) {
        throw new Error("Email service is not configured");
      }
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Verify your email address",
        html: `
          <h1>Welcome to Drizzle Dummy!</h1>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${appUrl}/verify-email?token=${verificationToken}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Delete the user since we couldn't send the verification email
      await db.delete(users).where(eq(users.id, newUser.id));
      return NextResponse.json(
        {
          error: "Failed to send verification email. Please try again later.",
          details:
            emailError instanceof Error
              ? emailError.message
              : "Email service is currently unavailable.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Registration successful. Please check your email to verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
