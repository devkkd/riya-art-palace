import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_token";

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function isValidToken(token) {
  const secret = getSecretKey();
  if (!secret || !token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (pathname.startsWith("/admin/dashboard")) {
    const valid = await isValidToken(token);
    if (!valid) {
      const response = NextResponse.redirect(new URL("/admin", request.url));
      if (token) response.cookies.delete(COOKIE_NAME);
      return response;
    }
    return NextResponse.next();
  }

  if (pathname === "/admin") {
    const valid = await isValidToken(token);
    if (valid) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/dashboard/:path*"],
};
