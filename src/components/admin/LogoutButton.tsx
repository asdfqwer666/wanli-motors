"use client";

import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <button
      type="button"
      onClick={logout}
      className="inline-flex items-center gap-1.5 rounded-full border border-apple-border bg-white px-4 py-1.5 text-sm text-apple-text transition-colors hover:bg-apple-hover"
    >
      <LogOut size={14} />
      退出登录
    </button>
  );
}
