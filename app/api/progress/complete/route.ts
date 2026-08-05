import { NextResponse } from "next/server";
import { completeTopics } from "@/lib/progress-store";

interface CompleteProgressBody {
  topicKeys?: unknown;
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

  let body: CompleteProgressBody;
  try {
    body = (await request.json()) as CompleteProgressBody;
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  if (!Array.isArray(body.topicKeys)) {
    return NextResponse.json({ message: "topicKeys must be an array" }, { status: 400 });
  }

  const topicKeys = body.topicKeys.filter(
    (key): key is string => typeof key === "string" && key.trim().length > 0,
  );
  if (topicKeys.length !== body.topicKeys.length) {
    return NextResponse.json(
      { message: "topicKeys must contain only non-empty strings" },
      { status: 400 },
    );
  }

  return NextResponse.json({ ...completeTopics(userId, topicKeys), applied: true });
}
