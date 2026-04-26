import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = new Set([
  "/",
  "/login",
  "/register",
  "/dashboard",
  "/map",
  "/emergency",
  "/education",
]);

const ADMIN_ROUTES = new Set(["/admin"]);
const USER_ROUTES = new Set(["/user"]);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.has(pathname) || 
                        pathname.startsWith("/dashboard") ||
                        pathname.startsWith("/map") ||
                        pathname.startsWith("/emergency") ||
                        pathname.startsWith("/education");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get tokens from cookies (stored by login flow)
  const accessToken = request.cookies.get("ews_access_token")?.value;
  
  // Get user data from cookies or localStorage (middleware runs on server, so check headers)
  const userDataHeader = request.headers.get("x-user-role");
  
  // If no token, redirect to login
  if (!accessToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Route protection based on role (requires role to be passed via header or query param)
  // Note: For client-side protection, consider using the useAuth hook in components
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
