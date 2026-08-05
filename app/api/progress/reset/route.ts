import { NextResponse } from "next/server";
import { resetProgress } from "@/lib/progress-store";

interface ResetProgressBody {
  confirm?: unknown;
}

function getUserId(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;

  const token = authorization.slice("Bearer ".length).trim();
  return token || null;
}

export async function POST(request: Request) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ message: "Authentication is required" }, { status: 401 });
  }

  let body: ResetProgressBody;
  try {
    body = (await request.json()) as ResetProgressBody;
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  if (body.confirm !== true) {
    return NextResponse.json({ message: "Reset confirmation is required" }, { status: 400 });
  }

  return NextResponse.json({ ...resetProgress(userId), applied: true });
}
