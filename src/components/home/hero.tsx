"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { FloatingHearts } from "@/templates/shared/effects";

const TICKS = [
  "No design skills needed",
  "Mobile-friendly templates",
  "Share via link or customizable QR code",
  "Upload your own photos & music",
];

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[276px] sm:w-[310px]">
      <div className="absolute -inset-10 -z-10 rounded-full bg-gradient-to-br from-[#FFD1DA] via-[#FFE0E6] to-[#FFDDE4] opacity-70 blur-3xl" />

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-[2.6rem] border-[9px] border-[#2B1A20] bg-[#2B1A20] shadow-[0_30px_80px_rgba(58,13,22,0.28)]"
      >
        <div className="relative h-[540px] overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#FFF2F7] via-[#FFE6EC] to-[#FFF1F3]">
          <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-[#2B1A20]" />

          <div className="absolute inset-0 opacity-70">
            {["❤️", "💗", "💖", "✨"].map((emoji, index) => (
              <motion.span
                key={emoji}
                className="absolute text-lg"
                style={{
                  left: `${[12, 78, 22, 70][index]}%`,
                  top: `${[18, 26, 70, 78][index]}%`,
                }}
                animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>

          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
            <motion.div
              animate={{ y: [0, -9, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl drop-shadow-sm"
            >
              🎂
            </motion.div>
            <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.28em] text-brand-dark">a gift for sophie</p>
            <h3 className="mt-2 font-display text-[26px] leading-tight text-ink">
              Happy Birthday,
              <br />
              Sophie
            </h3>
            <p className="mt-2 text-[11px] text-muted">There is a whole little world inside this link.</p>

            <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#D7263D] to-[#F2546B] px-5 py-2.5 text-[11px] font-semibold text-white shadow-[0_10px_24px_rgba(215,38,61,0.35)]">
              Tap to open your gift 🎁
            </span>

            <div className="mt-7 flex items-center gap-1.5">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className={`h-1.5 rounded-full ${dot === 0 ? "w-5 bg-brand" : "w-1.5 bg-brand/30"}`}
                />
              ))}
            </div>

            <div className="absolute bottom-4 flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[9px] text-muted backdrop-blur">
              🎵 Romantic Piano · playing
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute -left-8 top-24 hidden rounded-2xl border border-white bg-white/95 px-3.5 py-2.5 text-left shadow-soft sm:block"
      >
        <p className="text-[10px] font-semibold text-ink">💌 &quot;she cried happy tears&quot;</p>
        <p className="text-[9px] text-muted">— Josh B.</p>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute -right-6 bottom-28 hidden rounded-2xl border border-white bg-white/95 px-3.5 py-2.5 shadow-soft sm:block"
      >
        <p className="text-[10px] font-semibold text-ink">📱 Scan the QR</p>
        <p className="text-[9px] text-muted">heart or square</p>
      </motion.div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FFF8FA] to-white">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#FFD9E0] opacity-50 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-[#FFE0E6] opacity-60 blur-3xl" />

      <div className="container-page relative grid items-center gap-14 pb-20 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-20">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white/80 px-4 py-1.5 text-xs font-medium text-brand-dark shadow-sm backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
            Create beautiful digital gifts ✨
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="mt-6 text-[2.6rem] leading-[1.06] sm:text-6xl lg:text-[4.1rem]"
          >
            Share Love Beautifully
            <br />
            <span className="text-gradient">with a Digital Gift</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Create interactive gift websites for your most cherished moments. Add photos, music, and a heartfelt message
            to build a digital keepsake that lasts forever.
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-7 grid max-w-lg gap-2.5 sm:grid-cols-2"
          >
            {TICKS.map((tick) => (
              <li key={tick} className="flex items-start gap-2.5 text-sm text-ink/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {tick}
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link href="/templates" className="btn-primary px-8 py-3.5 text-base">
              Create Your Gift Now
            </Link>
            <a href="#how-it-works" className="btn-secondary px-7 py-3.5 text-base">
              How to Create Your Gift
            </a>
          </motion.div>

          <div className="mt-10 flex items-center gap-3 text-xs text-muted">
            <div className="flex -space-x-2">
              {["🎂", "💕", "💍", "🎓"].map((emoji) => (
                <span
                  key={emoji}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-soft text-sm"
                >
                  {emoji}
                </span>
              ))}
            </div>
            <p>
              <span className="font-semibold text-ink">2,000+ gifts</span> sent to very happy people
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
            <FloatingHearts count={9} />
          </div>
          <PhoneMockup />
        </motion.div>
      </div>

      <a
        href="#how-it-works"
        className="relative mx-auto mb-8 flex w-fit flex-col items-center gap-1 text-[10px] uppercase tracking-[0.3em] text-muted transition hover:text-brand"
      >
        Scroll
        <ChevronDown className="h-4 w-4 animate-bob" />
      </a>
    </section>
  );
}
