import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, checkAdminPassword, createSessionToken, isAuthConfigured } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let password = "";
  try {
    const body = await req.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  if (!isAuthConfigured()) {
    return NextResponse.json(
      { error: "后台未配置 ADMIN_PASSWORD / ADMIN_SESSION_SECRET 环境变量，登录已拒绝。" },
      { status: 503 }
    );
  }

  if (!password || !checkAdminPassword(password)) {
    return NextResponse.json({ error: "密码错误，请重试。" }, { status: 401 });
  }

  const token = createSessionToken();
  if (!token) {
    return NextResponse.json({ error: "会话签发失败，请检查服务端密钥配置。" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 12 * 60 * 60
  });
  return res;
}
