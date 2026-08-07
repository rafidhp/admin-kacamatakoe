import { middlewareAuth } from "@/server/auth";
import { NextResponse } from "next/server";

export default middlewareAuth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};