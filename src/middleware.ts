import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  // Skip middleware for login page
  if (request.nextUrl.pathname === "/cms/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("cms_token")?.value;

  if (!token) {
    // Redirect to login if no token is present
    return NextResponse.redirect(new URL("/cms/login", request.url));
  }

  try {
    // Verify the token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );
    await jwtVerify(token, secret);

    return NextResponse.next();
  } catch (error) {
    // Token is invalid or expired
    console.error("Token is invalid or expired:", error);
    return NextResponse.redirect(new URL("/cms/login", request.url));
  }
}

export const config = {
  matcher: ["/cms", "/cms/:path*"],
};
