import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/config";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label={`${SITE_NAME} home`}>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D7263D] to-[#FF8FA3] text-white shadow-soft transition group-hover:-rotate-6">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path
            d="M12 20.5c-4.6-3.1-7.5-5.9-7.5-9.2A4.3 4.3 0 0 1 12 8.6a4.3 4.3 0 0 1 7.5 2.7c0 3.3-2.9 6.1-7.5 9.2Z"
            fill="currentColor"
            opacity=".95"
          />
          <path d="M3.6 11.2h16.8v2H3.6z" fill="#fff" opacity=".85" />
          <path d="M12 11.2c-1.9 0-3.1-1-3.1-2.4h2c0 .3.5.6 1.1.6s1.1-.3 1.1-.6h2c0 1.4-1.2 2.4-3.1 2.4Z" fill="#fff" opacity=".85" />
        </svg>
        <span className="absolute -right-1 -top-1 text-[10px]" aria-hidden>
          ✨
        </span>
      </span>
      {showText ? (
        <span className="text-[17px] font-semibold tracking-tight text-ink">
          Love<span className="text-brand">Digital</span>Gift
        </span>
      ) : null}
    </Link>
  );
}
