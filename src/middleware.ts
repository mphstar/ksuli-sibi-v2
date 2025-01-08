import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import saveVisitor from "./services/visitor";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/_next") || pathname.endsWith(".ico")) {
    return NextResponse.next();
  }

  // Tampilkan log hanya untuk permintaan pertama
  if (!request.headers.get("referer")) {
    // console.log("Request to:", pathname);
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/:path*", // Semua route matcher: "/:path*", // Semua route
};
