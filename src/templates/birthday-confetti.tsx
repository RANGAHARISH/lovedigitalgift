"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { TemplateRenderProps } from "./types";
import { Balloons, Confetti } from "./shared/effects";
import { PhotoCarousel, Reveal, Stage, photosOf } from "./shared/primitives";

function Candle({ lit }: { lit: boolean }) {
  return (
    <div className="flex flex-col items-center">
      {lit ? (
        <motion.span
          className="h-3.5 w-2.5 rounded-full bg-gradient-to-t from-amber-500 via-amber-300 to-yellow-100 shadow-[0_0_16px_rgba(255,190,80,0.9)]"
          animate={{ scale: [1, 1.18, 1], opacity: [1, 0.85, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <span className="h-3.5 w-2.5 rounded-full bg-neutral-300/70" />
      )}
      <span className="mt-1 h-9 w-1.5 rounded-full bg-gradient-to-b from-pink-200 to-pink-400" />
    </div>
  );
}

export default function BirthdayConfetti({ content, accent = "#D7263D" }: TemplateRenderProps) {
  const name = String(content.name || "Birthday Star");
  const age = String(content.age || "").trim();
  const message = String(content.message || "");
  const wish = String(content.wish || "");
  const from = String(content.from || "");
  const photos = photosOf(content.photos);

  const [ageShown, setAgeShown] = useState(false);
  const [blown, setBlown] = useState(false);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FFF2F7] via-[#FFE9F0] to-[#FFF8F6] text-neutral-900">
      <Confetti />
      <Balloons />
      <Balloons />

      <Stage>
        <Reveal className="flex flex-col items-center">
          <span className="rounded-full bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A4122A] shadow-sm">
            🎂 It&apos;s your special day
          </span>
          <h1 className="mt-6 text-5xl leading-[1.05] sm:text-7xl">
            Happy Birthday
            <br />
            <span style={{ color: accent }}>{name}</span>
          </h1>

          {age ? (
            <button
              type="button"
              onClick={() => setAgeShown((v) => !v)}
              className="mt-7 rounded-full border border-white bg-white/80 px-5 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5"
            >
              {ageShown ? `🎈 You're ${age}!` : "Tap to reveal the magic number 🎈"}
            </button>
          ) : null}

          <p className="mt-7 max-w-md text-base leading-relaxed text-neutral-600 sm:text-lg">{message}</p>

          <motion.div
            className="mt-10 text-3xl"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            🎉 🎁 🥳
          </motion.div>
        </Reveal>
      </Stage>

      {photos.length > 0 ? (
        <Stage className="bg-white/40">
          <Reveal className="flex w-full flex-col items-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400">Our favourite moments</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">A few memories with you</h2>
            <PhotoCarousel photos={photos} accent={accent} className="mt-8" />
          </Reveal>
        </Stage>
      ) : null}

      <Stage>
        <Reveal className="flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl">Make a wish</h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-500">
            Close your eyes, think of something wonderful, then blow out the candles.
          </p>

          <div className="relative mt-14 w-64 select-none sm:w-72">
            <div className="absolute -top-8 left-1/2 flex -translate-x-1/2 gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <Candle key={i} lit={!blown} />
              ))}
            </div>
            <div className="h-10 rounded-t-2xl bg-gradient-to-b from-[#FFF8FA] to-[#FFDCE3]" />
            <div className="mt-1 h-14 rounded-md bg-gradient-to-b from-[#FFC7D3] to-[#FF9FB0]" />
            <div className="mt-1 h-16 rounded-b-[1.6rem] bg-gradient-to-b from-[#FFB2C1] to-[#F25470] shadow-soft" />
            <div className="mx-auto mt-2 h-2 w-56 rounded-full bg-black/10 blur-sm" />
          </div>

          <button
            type="button"
            onClick={() => setBlown(true)}
            className="mt-10 rounded-full px-7 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 disabled:opacity-70"
            style={{ backgroundColor: accent }}
            disabled={blown}
          >
            {blown ? "Wish made ✨" : "Blow the candles 🎂"}
          </button>

          <AnimatePresence>
            {blown ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex flex-col items-center"
              >
                <Confetti count={50} />
                <p className="font-display text-2xl" style={{ color: accent }}>
                  May every wish come true 💫
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Reveal>
      </Stage>

      <Stage className="bg-white/50">
        <Reveal className="flex max-w-lg flex-col items-center">
          <div className="text-4xl">💌</div>
          <p className="mt-6 font-display text-2xl leading-relaxed text-neutral-800 sm:text-3xl">{wish}</p>
          {from ? <p className="mt-8 text-sm uppercase tracking-[0.24em] text-neutral-400">with love, {from}</p> : null}
        </Reveal>
      </Stage>
    </div>
  );
}
