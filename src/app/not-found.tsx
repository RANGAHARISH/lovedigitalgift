import Link from "next/link";
import { Logo } from "@/components/site/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FFF5F8] via-[#FFF8FA] to-white">
      <div className="container-page py-6">
        <Logo />
      </div>
      <div className="container-page flex flex-1 flex-col items-center justify-center py-16 text-center">
        <p className="text-6xl">💔</p>
        <h1 className="mt-6 text-4xl sm:text-5xl">This page has wandered off</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
          The link may have expired, or the gift behind it was deleted. If someone sent you a gift, ask them for a fresh
          link.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-primary px-6 py-3">
            Back to home
          </Link>
          <Link href="/templates" className="btn-secondary px-6 py-3">
            Browse templates
          </Link>
        </div>
      </div>
    </div>
  );
}
