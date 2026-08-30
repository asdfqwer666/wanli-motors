"use client";

import { useState } from "react";
import { KeyRound, Loader2, ShieldAlert } from "lucide-react";

interface LoginFormProps {
  configured: boolean;
}

export default function LoginForm({ configured }: LoginFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "登录失败，请稍后重试。");
        return;
      }
      window.location.href = "/admin/models";
    } catch {
      setError("网络异常，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-apple-bg px-6">
      <div className="w-full max-w-sm rounded-3xl border border-apple-border bg-apple-card p-8 shadow-appleHover">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-apple-text text-white">
            <KeyRound size={20} strokeWidth={1.8} />
          </span>
          <h1 className="mt-4 text-xl font-semibold">媒体管理后台</h1>
          <p className="mt-1 text-sm text-apple-subtext">万里商用车 · 车型媒体管理系统</p>
        </div>

        {!configured ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
            <p className="flex items-start gap-2">
              <ShieldAlert size={16} className="mt-0.5 shrink-0" />
              服务端尚未配置 ADMIN_PASSWORD 与 ADMIN_SESSION_SECRET 环境变量，登录功能已拒绝。请在 .env.local
              或部署环境中完成配置后重启服务。
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-password" className="text-sm font-medium">
                管理密码
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入后台管理密码"
                className="mt-1.5 w-full rounded-xl border border-apple-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20"
              />
            </div>

            {error ? (
              <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-apple-blue py-2.5 text-sm font-medium text-white transition-colors hover:bg-apple-blueHover disabled:opacity-60"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              登录后台
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-apple-subtext">
          会话有效期 12 小时 · 基于 HttpOnly Cookie 签名验证
        </p>
      </div>
    </div>
  );
}
