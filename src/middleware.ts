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

  // Get the session ID from the cookie
  const sessionId = request.cookies.get("sessionId")?.value;
  console.log("Session ID present:", !!sessionId);

  try {
    // If user is authenticated and tries to access public paths, redirect to home
    if (isPublicPath && sessionId) {
      console.log(
        "Authenticated user trying to access public path, redirecting to home"
      );
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If user is not authenticated and tries to access protected paths, redirect to login
    if (isProtectedPath && !sessionId) {
      console.log(
        "Unauthenticated user trying to access protected path, redirecting to login"
      );
      const loginUrl = new URL("/login", request.url);
      // Add the current path as a redirect parameter
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    console.log("Middleware allowing access to:", pathname);
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // If there's an error, redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("sessionId");
    return response;
  }
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
