import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE_NAME = "wl_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 小时

export function isAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSessionToken(): string | null {
  if (!isAuthConfigured()) return null;
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload, process.env.ADMIN_SESSION_SECRET!)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !process.env.ADMIN_SESSION_SECRET) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload, process.env.ADMIN_SESSION_SECRET);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export function checkAdminPassword(input: string): boolean {
  if (!process.env.ADMIN_PASSWORD) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(process.env.ADMIN_PASSWORD);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function isAdminAuthenticated(): boolean {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

/** 后台受保护页面统一入口：未登录重定向到独立登录页（登录页自身不调用，避免死循环） */
export function requireAdmin(): void {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }
}
