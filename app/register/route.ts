import { type NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/signup";
  return NextResponse.redirect(url, { status: 308 });
}
