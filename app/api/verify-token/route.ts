import { NextResponse } from "next/server";

interface VerifyTokenRequestBody {
  token?: unknown;
}

const VERIFY_TOKEN_URL = "http://localhost:4010/auth/verify-token";

export async function POST(request: Request) {
  let body: VerifyTokenRequestBody;

  try {
    body = (await request.json()) as VerifyTokenRequestBody;
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token.trim() : "";

  if (!token) {
    return NextResponse.json({ message: "Token is required" }, { status: 400 });
  }

  try {
    const response = await fetch(VERIFY_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : { message: await response.text().catch(() => "") };

    return NextResponse.json(data ?? {}, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to token verification API" },
      { status: 502 },
    );
  }
}
