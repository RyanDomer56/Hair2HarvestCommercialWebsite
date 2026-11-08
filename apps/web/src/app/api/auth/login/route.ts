import { NextResponse } from "next/server";
import { AUTH_COOKIE, createSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const key = process.env.DASHBOARD_PASSWORD ?? "";
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };

  if (!key || password !== key) {
    return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
  }

  const session = await createSession(key);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, session, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
