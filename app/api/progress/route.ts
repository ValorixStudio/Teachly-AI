import { NextResponse } from "next/server";
import { getProgress } from "@/lib/progress-store";

function getUserId(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;

  const token = authorization.slice("Bearer ".length).trim();
  return token || null;
}

export async function GET(request: Request) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ message: "Authentication is required" }, { status: 401 });
  }

  return NextResponse.json(getProgress(userId));
}
