import { redirect } from "next/navigation";
import { isAuthConfigured, isAdminAuthenticated } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "后台登录",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  // 已登录用户直接进入总览；未登录停留在本页，绝不产生重定向死循环
  if (isAdminAuthenticated()) {
    redirect("/admin/models");
  }

  return <LoginForm configured={isAuthConfigured()} />;
}
