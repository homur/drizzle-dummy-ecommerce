import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public paths that don't require authentication
const publicPaths = ["/login", "/register", "/orders/lookup"];

// Define paths that require authentication
const protectedPaths = ["/profile", "/orders"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Middleware processing path:", pathname);

  // Skip middleware for API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check if the path is public
  const isPublicPath = publicPaths.includes(pathname);
  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some((path) => {
    // For /orders, only match exact path or /orders/ followed by something other than 'lookup'
    if (path === "/orders") {
      return (
        pathname === path ||
        (pathname.startsWith("/orders/") &&
          !pathname.startsWith("/orders/lookup"))
      );
    }
    return pathname.startsWith(path);
  });

  // Get the Supabase access token from the cookie
  const accessToken = request.cookies.get("sb-access-token")?.value;
  console.log("Access token present:", !!accessToken);

  // If there's an access token but we're on a public path, clear it
  if (isPublicPath && accessToken) {
    console.log("Clearing access token cookie on public path");
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("sb-access-token");
    return response;
  }

  // If there's no access token and we're on a protected path, redirect to login
  if (isProtectedPath && !accessToken) {
    console.log("No access token, redirecting to login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If we have an access token, let the API routes handle validation
  console.log("Middleware allowing access to:", pathname);
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
