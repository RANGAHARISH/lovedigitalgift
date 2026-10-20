"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { TemplateRenderProps } from "./types";
import { Confetti, FloatingHearts } from "./shared/effects";
import { Photo, Reveal, Stage, Typewriter, photosOf } from "./shared/primitives";

export default function LoveLetter({ content, accent = "#D7263D" }: TemplateRenderProps) {
  const to = String(content.to || "");
  const from = String(content.from || "");
  const letter = String(content.letter || "");
  const question = String(content.question || "");
  const photos = photosOf(content.photos);

  const [opened, setOpened] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });

  const dodge = () => {
    setNoOffset({
      x: -130 + Math.random() * 220,
      y: -80 + Math.random() * 150,
    });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FFF3F6] via-[#FFE9EE] to-[#FFF3F6] text-neutral-900">
      <FloatingHearts count={14} />

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div key="closed" exit={{ opacity: 0, scale: 0.96 }} className="relative z-10">
            <Stage>
              <Reveal className="flex flex-col items-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400">a letter for you</p>
                <h1 className="mt-4 text-3xl sm:text-5xl">
                  {to ? `Dear ${to},` : "Someone left you a letter"}
                </h1>
                <p className="mt-3 max-w-sm text-sm text-neutral-500">
                  It has been waiting patiently. Tap the envelope to unfold it.
                </p>

                <motion.button
                  type="button"
                  onClick={() => setOpened(true)}
                  aria-label="Open the letter"
                  className="relative mt-12 h-52 w-full max-w-sm focus:outline-none"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-white shadow-soft" />
                  <div className="absolute inset-x-0 bottom-0 h-36 rounded-b-2xl bg-gradient-to-b from-[#FFD9E0] to-[#FFBFCC]" />
                  <div
                    className="absolute inset-x-0 bottom-0 z-10 h-24"
                    style={{
                      clipPath: "polygon(0 100%, 50% 28%, 100% 100%)",
                      backgroundColor: "#FFC9D4",
                    }}
                  />
                  <motion.div
                    className="absolute inset-x-0 top-0 z-20 h-28 origin-top"
                    animate={{ rotateX: 0 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div
                      className="h-full w-full"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                        backgroundColor: "#FFB0BE",
                      }}
                    />
                  </motion.div>
                  <div
                    className="absolute left-1/2 top-1/2 z-30 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xl text-white shadow-soft"
                    style={{ backgroundColor: accent }}
                  >
                    ❤
                  </div>
                  <span className="absolute inset-x-0 bottom-4 z-30 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90">
                    tap to open
                  </span>
                </motion.button>
              </Reveal>
            </Stage>
          </motion.div>
        ) : (
          <motion.div key="opened" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative z-10">
            <Stage>
              <div className="mx-auto w-full max-w-xl rounded-[2rem] border border-[#F8E3E8] bg-[#FFFCFB] p-8 text-left shadow-soft sm:p-12">
                <p className="font-display text-sm uppercase tracking-[0.28em] text-neutral-400">
                  {to ? `Dear ${to}` : "Dearest you"}
                </p>
                <Typewriter
                  text={letter}
                  speed={22}
                  className="mt-6 min-h-[9rem] font-display text-xl leading-relaxed text-neutral-800 sm:text-2xl"
                />
                {from ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(6, letter.length * 0.022 + 0.8) }}
                    className="mt-8 text-right font-display text-xl italic"
                    style={{ color: accent }}
                  >
                    — {from}
                  </motion.p>
                ) : null}
              </div>
            </Stage>

            {photos.length > 0 ? (
              <Stage className="py-10">
                <Reveal className="w-full max-w-2xl">
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {photos.slice(0, 6).map((photo, index) => (
                      <div
                        key={`${photo.url}-${index}`}
                        className="overflow-hidden rounded-xl border-[3px] border-white bg-white shadow-softer"
                        style={{ transform: `rotate(${index % 2 ? 1.5 : -1.5}deg)` }}
                      >
                        <Photo src={photo.url} alt={photo.caption} className="aspect-square w-full" />
                      </div>
                    ))}
                  </div>
                </Reveal>
              </Stage>
            ) : null}

            {question ? (
              <Stage>
                <Reveal className="flex flex-col items-center">
                  <h2 className="max-w-md text-3xl leading-snug sm:text-4xl">{question}</h2>
                  <div className="relative mt-12 flex min-h-[64px] w-full max-w-sm items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setAnswered(true)}
                      className="rounded-full px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
                      style={{ backgroundColor: accent }}
                    >
                      Yes 💖
                    </button>
                    <motion.button
                      type="button"
                      onMouseEnter={dodge}
                      onFocus={dodge}
                      onClick={dodge}
                      animate={{ x: noOffset.x, y: noOffset.y }}
                      transition={{ type: "spring", stiffness: 320, damping: 18 }}
                      className="rounded-full border border-neutral-300 bg-white px-8 py-3 text-sm font-semibold text-neutral-500"
                    >
                      No
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {answered ? (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-14 flex flex-col items-center"
                      >
                        <Confetti count={55} />
                        <p className="font-display text-3xl" style={{ color: accent }}>
                          I knew it 💞
                        </p>
                        <p className="mt-2 text-sm text-neutral-500">You just made this the best day ever.</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </Reveal>
              </Stage>
            ) : (
              <Stage className="py-10">
                <Reveal className="flex max-w-lg flex-col items-center">
                  <p className="font-display text-2xl italic leading-relaxed" style={{ color: accent }}>
                    some words are too big for a text message
                  </p>
                  <span className="mt-6 text-2xl">💌</span>
                </Reveal>
              </Stage>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
