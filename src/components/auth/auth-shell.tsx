import { Suspense } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { LogoMark } from "@/components/site/logo";

export function AuthShell({
  title,
  subtitle,
  children,
  eyebrow,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  eyebrow: string;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] bg-white lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#D7263D] via-[#E2455C] to-[#FF8FA3] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 bottom-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <Link href="/" className="relative inline-flex items-center gap-2.5 text-sm font-semibold text-white/95">
          <LogoMark tone="light" className="h-8 w-8 rounded-[0.7rem]" />
          whishmydear.com
        </Link>

        <div className="relative">
          <p className="text-[34px]">💌</p>
          <h2 className="mt-5 max-w-sm font-display text-[2rem] leading-[1.15]">
            A gift they can open again and again.
          </h2>
          <ul className="mt-8 space-y-3 text-[13.5px] text-white/85">
            {[
              "20+ interactive templates",
              "Your photos, your music, your words",
              "One link, or a QR code you can print",
              "Free to create, unlimited sharing",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[11px] tracking-[0.06em] text-white/65">© 2026 whishmydear.com. All rights reserved.</p>
      </div>

      <div className="flex items-center justify-center px-5 py-16 sm:px-10">
        <div className="w-full max-w-sm">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 text-[2rem] leading-tight">{title}</h1>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-[11px] leading-relaxed text-muted">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline decoration-brand/30 underline-offset-2 hover:text-brand-dark">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline decoration-brand/30 underline-offset-2 hover:text-brand-dark">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export function AuthShellSkeleton() {
  return (
    <div className="mx-auto w-full max-w-sm space-y-4">
      <div className="h-12 animate-pulse rounded-2xl bg-brand-soft/60" />
      <div className="h-12 animate-pulse rounded-2xl bg-brand-soft/60" />
      <div className="h-12 animate-pulse rounded-full bg-brand-soft/60" />
    </div>
  );
}

export function AuthSuspense({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<AuthShellSkeleton />}>{children}</Suspense>;
}
