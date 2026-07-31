import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOGIN_COOKIE = "teachly_ai_logged_in";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.nextUrl.searchParams.get("token"));
  const isLoggedIn = request.cookies.get(LOGIN_COOKIE)?.value === "true";

  if (!isLoggedIn && pathname !== "/login" && !hasToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
  ],
};
