import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, verifySession } from "@/lib/auth";

/**
 * Gate the admin workspace. Any request to /dashboard (or a sub-route) without a
 * valid signed session cookie is redirected to /login, which then returns here
 * via the `next` query param. The public site and its /api/v1/* data endpoints
 * are intentionally NOT matched, so they keep working for visitors.
 */
export async function middleware(req: NextRequest) {
  const key = process.env.DASHBOARD_PASSWORD ?? "";
  const cookie = req.cookies.get(AUTH_COOKIE)?.value;
  if (await verifySession(cookie, key)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
