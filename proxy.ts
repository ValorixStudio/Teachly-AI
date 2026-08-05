import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOGIN_COOKIE = "teachly_ai_logged_in";
const TOKEN_COOKIE = "teachly_ai_token";
const VERIFY_TOKEN_URL = "https://cadapi.theteachly.com//auth/verify-token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

async function verifyToken(token: string) {
  const response = await fetch(VERIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });

  return response.ok;
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(LOGIN_COOKIE);
  response.cookies.delete(TOKEN_COOKIE);
}

function setAuthCookies(response: NextResponse, token: string) {
  response.cookies.set(LOGIN_COOKIE, "true", {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  response.cookies.set(TOKEN_COOKIE, token, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.nextUrl.searchParams.get("token")?.trim() ?? "";
  const storedToken = request.cookies.get(TOKEN_COOKIE)?.value;
  const isLoggedIn =
    request.cookies.get(LOGIN_COOKIE)?.value === "true" && Boolean(storedToken);

  if (token && isLoggedIn && storedToken === token) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.searchParams.delete("token");
    return NextResponse.redirect(redirectUrl);
  }

  if (token) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.searchParams.delete("token");

    try {
      const isValidToken = await verifyToken(token);

      if (isValidToken) {
        const response = NextResponse.redirect(redirectUrl);
        setAuthCookies(response, token);
        return response;
      }
    } catch {
      // Fall through to the login redirect below.
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "Token verification failed");
    const response = NextResponse.redirect(loginUrl);
    clearAuthCookies(response);
    return response;
  }

  if (!isLoggedIn && pathname !== "/login") {
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
