import { getAuthInstance } from "@/lib/infrastructure/auth/better-auth.config";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const auth = getAuthInstance();
  return auth.handler(request);
}

export async function POST(request: NextRequest) {
  const auth = getAuthInstance();
  return auth.handler(request);
}
