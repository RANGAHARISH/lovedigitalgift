"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export type NavUser = { id: string; email: string; name: string | null };

export function Navbar({ user }: { user: NavUser | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const initial = (user?.name || user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-brand/10 bg-white/75 backdrop-blur-xl supports-[backdrop-filter]:bg-white/65">
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-0.5 rounded-full border border-brand/10 bg-white/50 p-1 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-[13px] font-medium tracking-[0.01em] transition",
                pathname === link.href
                  ? "bg-white text-brand-dark shadow-sm"
                  : "text-muted hover:text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-brand/15 bg-white/80 py-1.5 pl-1.5 pr-3 text-sm font-medium shadow-sm transition hover:border-brand/35"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#D7263D] to-[#FF8FA3] text-xs font-bold text-white">
                  {initial}
                </span>
                <span className="max-w-[110px] truncate">{user.name || user.email.split("@")[0]}</span>
                <ChevronDown className="h-4 w-4 text-muted" />
              </button>
              {menuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-brand/10 bg-white p-1.5 shadow-soft"
                >
                  <p className="truncate px-3 py-2 text-xs text-muted">{user.email}</p>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink hover:bg-brand-soft/60"
                    role="menuitem"
                  >
                    <LayoutDashboard className="h-4 w-4 text-brand" /> Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={signOut}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink hover:bg-brand-soft/60"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4 text-brand" /> Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-ghost !px-4">
                Sign in
              </Link>
              <Link href="/templates" className="btn-primary group !px-5 !py-2.5">
                Create a gift
                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/15 bg-white text-ink md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-brand/10 bg-white px-5 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-brand-soft/60"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                type="button"
                onClick={signOut}
                className="mt-1 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-brand-dark hover:bg-brand-soft/60"
              >
                Sign out
              </button>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                <Link href="/login" className="btn-secondary w-full">
                  Sign in
                </Link>
                <Link href="/templates" className="btn-primary w-full">
                  Create a gift
                </Link>
              </div>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
