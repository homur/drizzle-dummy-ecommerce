import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { Resend } from 'resend';
import { randomBytes, createHash } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; // Ensure this env var is set

// Password validation function
function isPasswordSecure(password: string): boolean {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    // const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password); // Removed

    return (
        password.length >= minLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber
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
    
    // *** Add password complexity validation ***
    if (!isPasswordSecure(password)) {
      return NextResponse.json(
        {
          error:
            "Password does not meet security requirements. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.", // Updated error message
        },
        { status: 400 }
      );
    }
    // --- End password validation ---

    // Check if user already exists but isn't verified
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json(
        { error: "Email already registered and verified" },
        { status: 400 }
      );
    }

    // If user exists but is not verified, potentially resend email or handle differently?
    // For now, we'll prevent registering again if *any* user exists with that email.
     if (existingUser) {
       return NextResponse.json(
         { error: "Email already registered. Check your email for verification link or request a new one." },
         { status: 400 }
       );
     }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const rawToken = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(rawToken).digest('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Create user with verification token
    // Note: We are not returning the user data anymore after creation in this flow
    await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        verificationToken: hashedToken,
        verificationTokenExpires: tokenExpires,
        // emailVerified defaults to false
      });
      // You might want to get the newUser ID if needed for logging, but not sending back to client

    // Send verification email
    const verificationUrl = `${appUrl}/verify-email?token=${rawToken}`;

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev', // Replace with your verified sender domain
            to: email,
            subject: 'Verify Your Email Address',
            html: `<p>Hi ${name},</p><p>Please click the link below to verify your email address:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p><p>This link will expire in 24 hours.</p>`
            // Alternatively use React components for emails if you have them set up
            // react: <VerificationEmail name={name} verificationUrl={verificationUrl} />
        });
    } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
        // Important: Decide how to handle this.
        // Option 1: Delete the user created above (rollback)
        // Option 2: Return an error but keep the user (they need to request verification again later)
        // Option 3: Log the error and proceed (user won't get email immediately)
        // For now, returning a generic server error, but user exists in DB unverified.
         return NextResponse.json(
           { error: "User registered, but failed to send verification email. Please contact support or try requesting verification again later." },
           { status: 500 } // Or maybe 201 with a specific message
         );
    }


    // Return success message instead of user data
    return NextResponse.json({ message: "Registration successful. Please check your email to verify your account." }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    // Handle potential database errors or other unexpected issues
    if (error instanceof Error && error.message.includes('duplicate key value violates unique constraint')) {
       // This might happen in a race condition if check+insert isn't atomic enough
       return NextResponse.json(
         { error: "Email already registered." },
         { status: 400 }
       );
    }
    return NextResponse.json(
      { error: "Internal server error during registration." },
      { status: 500 }
    );
  }
}
