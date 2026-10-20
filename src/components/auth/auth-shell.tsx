import { Suspense } from "react";
import Link from "next/link";
import { Check, Heart } from "lucide-react";

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

        <Link href="/" className="relative inline-flex items-center gap-2 text-sm font-semibold text-white/90">
          <Heart className="h-4 w-4 fill-current" />
          LoveDigitalGift
        </Link>

        <div className="relative">
          <p className="text-4xl">💌</p>
          <h2 className="mt-5 max-w-sm font-display text-3xl leading-snug">
            A gift they can open again and again.
          </h2>
          <ul className="mt-8 space-y-3 text-sm text-white/85">
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

        <p className="relative text-xs text-white/70">© 2026 LoveDigitalGift. All rights reserved.</p>
      </div>

      <div className="flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="w-full max-w-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">{eyebrow}</p>
          <h1 className="mt-3 text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-[11px] leading-relaxed text-muted">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline hover:text-brand-dark">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-brand-dark">
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
