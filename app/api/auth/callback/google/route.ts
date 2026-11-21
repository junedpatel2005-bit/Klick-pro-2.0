import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/api/v1/auth/google";
  return NextResponse.redirect(url, { status: 307 });
}
