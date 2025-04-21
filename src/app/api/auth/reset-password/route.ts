import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createHash } from 'crypto';

// Re-use or import password validation function from register route
function isPasswordSecure(password: string): boolean {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return (
        password.length >= minLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber
    );
}

export async function POST(request: Request) {
  try {
    const { token, password, confirmPassword } = await request.json();

    // Basic validation
    if (!token || !password || !confirmPassword) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
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

    // Hash the raw token received from the client
    const hashedToken = createHash('sha256').update(token).digest('hex');

    // Find user by hashed token and check expiry
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.resetPasswordToken, hashedToken),
          gt(users.resetPasswordTokenExpires, new Date()) // Check if token is not expired
        )
      )
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired password reset token." }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear reset token fields
    await db
      .update(users)
      .set({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Potentially: Log the user in by creating a session?
    // Or just confirm success and let them log in manually.
    
    return NextResponse.json({ message: "Password reset successfully." });

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error during password reset." }, { status: 500 });
  }
} 