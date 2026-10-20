import Link from "next/link";
import { FloatingHearts } from "@/templates/shared/effects";

export function FinalCTA() {
  return (
    <section className="bg-white pb-20 pt-4 sm:pb-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#D7263D] via-[#E2455C] to-[#FF8FA3] px-6 py-16 text-center shadow-soft sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <FloatingHearts count={14} />
          </div>
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-8 h-48 w-48 rounded-full bg-white/15 blur-2xl" />

          <div className="relative">
            <p className="text-[28px]">💝</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-[2rem] leading-[1.1] text-white sm:text-[3.15rem]">
              Ready to Create Something Unforgettable?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[14px] leading-relaxed text-white/85 sm:text-[15px]">
              Join hundreds of people who have made their loved ones smile with a beautiful digital gift.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/templates"
                className="btn w-full bg-white px-8 py-4 text-[15px] text-brand-dark shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
              >
                Browse Templates
              </Link>
              <Link
                href="/dashboard"
                className="btn w-full border border-white/45 px-8 py-4 text-[15px] text-white transition hover:border-white/70 hover:bg-white/10 sm:w-auto"
              >
                My Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
