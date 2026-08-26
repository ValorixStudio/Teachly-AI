import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOGIN_COOKIE = "teachly_ai_logged_in";
const TOKEN_COOKIE = "teachly_ai_token";
const PROFILE_COOKIE = "teachly_ai_profile_data";

const VERIFY_TOKEN_URL =
  process.env.NEXT_PUBLIC_VERIFY_TOKEN_URL ??
  "https://apifuturexcamp.theteachly.com/token/verify-token";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const PROFILE_COOKIE_MAX_AGE = 60;

type VerifyResponse = {
  success?: boolean;
  access_token?: string;
  [key: string]: unknown;
};

async function verifyAndFetchProfile(token: string): Promise<VerifyResponse | null> {
  const response = await fetch(VERIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = (await response.json().catch(() => null)) as VerifyResponse | null;
  if (!data?.success || typeof data.access_token !== "string" || !data.access_token.trim()) {
    return null;
  }

  return data;
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(LOGIN_COOKIE);
  response.cookies.delete(TOKEN_COOKIE);
  response.cookies.delete(PROFILE_COOKIE);
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

function setProfileCookie(response: NextResponse, profile: VerifyResponse) {
  response.cookies.set(PROFILE_COOKIE, JSON.stringify(profile), {
    path: "/",
    maxAge: PROFILE_COOKIE_MAX_AGE,
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
      const profile = await verifyAndFetchProfile(token);

      if (profile) {
        const response = NextResponse.redirect(redirectUrl);
        setAuthCookies(response, profile.access_token as string);
        setProfileCookie(response, profile);
        return response;
      }
    } catch {
      // fall through to login redirect below
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