import Link from "next/link";
import { ExternalLink, Truck } from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";

interface AdminShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function AdminShell({ title, description, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-apple-bg">
      <header className="sticky top-0 z-40 border-b border-apple-border bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin/models" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-apple-text text-white">
                <Truck size={15} strokeWidth={1.8} />
              </span>
              <span className="text-sm font-semibold">媒体管理后台</span>
            </Link>
            <span className="hidden text-xs text-apple-subtext sm:inline">万里商用车</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 rounded-full border border-apple-border bg-white px-4 py-1.5 text-sm text-apple-text transition-colors hover:bg-apple-hover"
            >
              <ExternalLink size={13} />
              查看前台
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-2 text-sm text-apple-subtext">{description}</p> : null}
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
