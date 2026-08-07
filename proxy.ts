import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOGIN_COOKIE = "teachly_ai_logged_in";
const TOKEN_COOKIE = "teachly_ai_token";
const LOGIN_API_BASE_URL = process.env.NEXT_PUBLIC_LOGIN_API_URL ?? "https://cadapi.theteachly.com";
const VERIFY_TOKEN_URL =
  process.env.NEXT_PUBLIC_VERIFY_TOKEN_URL ??
  `${LOGIN_API_BASE_URL.replace(/\/+$/, "")}/auth/verify-token`;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

type VerifyTokenResponse = {
  token?: unknown;
};

async function verifyToken(token: string): Promise<string | null> {
  const response = await fetch(VERIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as VerifyTokenResponse | null;
  if (!response.ok || typeof data?.token !== "string" || !data.token.trim()) {
    return null;
  }

  return data.token.trim();
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

  if (token) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.searchParams.delete("token");

    try {
      const verifiedToken = await verifyToken(token);

      if (verifiedToken) {
        const response = NextResponse.redirect(redirectUrl);
        setAuthCookies(response, verifiedToken);
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
