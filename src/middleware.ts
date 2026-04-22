import { NextResponse, type NextRequest } from "next/server";
const publicRoutes = ["/login", "/register", "/forgot-password"];
export function middleware(request: NextRequest) { const { pathname } = request.nextUrl; const isPublic = publicRoutes.some((route) => pathname.startsWith(route)); const token = request.cookies.get("nexware_access_token")?.value; if (!token && !isPublic) { const url = new URL("/login", request.url); url.searchParams.set("next", pathname); return NextResponse.redirect(url); } if (token && isPublic) return NextResponse.redirect(new URL("/dashboard", request.url)); return NextResponse.next(); }
export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"] };
