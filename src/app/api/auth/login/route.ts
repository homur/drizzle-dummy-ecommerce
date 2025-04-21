import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, sessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { rateLimiter } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";

    // Check rate limit
    if (rateLimiter.isRateLimited(`login:${ip}`)) {
      const remainingTime = rateLimiter.getRemainingTime(`login:${ip}`);
      return NextResponse.json(
        {
          error: "Too many login attempts. Please try again later.",
          retryAfter: Math.ceil(remainingTime / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(remainingTime / 1000).toString(),
          },
        }
      );
    }

    console.log("Login request received");
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const [foundUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!foundUser) {
      console.log("User not found during login attempt for:", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, foundUser.password);

    if (!isValidPassword) {
      console.log("Invalid password during login attempt for:", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!foundUser.emailVerified) {
      console.log("Login attempt failed: Email not verified for:", email);
      return NextResponse.json(
        { error: "Email not verified. Please check your email for the verification link." },
        { status: 403 }
      );
    }

    // Generate a secure random session ID
    const sessionId = randomBytes(32).toString("hex");

    // Create a new session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await db.insert(sessions).values({
      id: sessionId,
      userId: foundUser.id,
      expiresAt,
    });

    // Create response with user data (excluding password)
    const { password: _, ...userWithoutPassword } = foundUser;
    const response = NextResponse.json(userWithoutPassword);

    // Set the session cookie with secure settings
    response.cookies.set({
      name: "sessionId",
      value: sessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    console.log("Session created and cookie set successfully");
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
