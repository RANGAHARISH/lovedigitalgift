"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { TemplateRenderProps } from "./types";
import { FloatingHearts } from "./shared/effects";
import { Photo, Reveal, Stage, photosOf } from "./shared/primitives";
import { parseMemory } from "@/lib/utils";

export default function AnniversaryTimeline({ content, accent = "#D7263D" }: TemplateRenderProps) {
  const names = String(content.names || "");
  const since = String(content.since || "");
  const headline = String(content.headline || "");
  const letter = String(content.letter || "");
  const from = String(content.from || "");
  const milestones: string[] = Array.isArray(content.milestones)
    ? content.milestones.map((item: unknown) => String(item || "")).filter(Boolean)
    : [];
  const photos = photosOf(content.photos);

  const [stats, setStats] = useState<{ years: number; days: number } | null>(null);

  useEffect(() => {
    if (!since) return;
    const start = new Date(`${since}T00:00:00`);
    if (Number.isNaN(start.getTime())) return;
    const diff = Date.now() - start.getTime();
    if (diff < 0) return;
    const years = Math.floor(diff / (365.2425 * 86_400_000));
    const days = Math.floor((diff - years * 365.2425 * 86_400_000) / 86_400_000);
    setStats({ years, days });
  }, [since]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FFF8FA] via-[#FFF2F6] to-[#FFF4F6] text-neutral-900">
      <FloatingHearts count={12} />

      <Stage>
        <Reveal className="flex flex-col items-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400">our story</span>
          <h1 className="mt-5 text-4xl leading-tight sm:text-6xl">{headline}</h1>
          {names ? <p className="mt-4 font-display text-2xl italic" style={{ color: accent }}>{names}</p> : null}

          {stats ? (
            <div className="mt-10 flex items-stretch gap-3">
              <div className="min-w-[104px] rounded-3xl bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
                <div className="font-display text-4xl font-semibold" style={{ color: accent }}>
                  {stats.years}
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">years</div>
              </div>
              <div className="min-w-[104px] rounded-3xl bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
                <div className="font-display text-4xl font-semibold" style={{ color: accent }}>
                  {stats.days}
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">days</div>
              </div>
            </div>
          ) : null}
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-neutral-400">of us, and counting</p>

          <motion.div
            className="mt-12 text-2xl"
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            ❤️
          </motion.div>
          <p className="mt-8 text-sm text-neutral-400">scroll to walk through our memories</p>
        </Reveal>
      </Stage>

      {milestones.length > 0 ? (
        <Stage className="items-stretch bg-white/40">
          <div className="mx-auto w-full max-w-2xl">
            <Reveal>
              <h2 className="text-center text-3xl sm:text-4xl">The moments that made us</h2>
            </Reveal>
            <div className="relative mt-12 pl-8 sm:pl-0">
              <div className="absolute bottom-0 left-3 top-0 w-px bg-gradient-to-b from-transparent via-[#FFC2CE] to-transparent sm:left-1/2" />
              <div className="space-y-8">
                {milestones.map((milestone, index) => {
                  const memory = parseMemory(milestone);
                  const right = index % 2 === 1;
                  return (
                    <motion.div
                      key={`${milestone}-${index}`}
                      initial={{ opacity: 0, y: 26 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.55 }}
                      className={`relative sm:w-1/2 ${right ? "sm:ml-auto sm:pl-10" : "sm:pr-10 sm:text-right"}`}
                    >
                      <span
                        className={`absolute left-[-1.55rem] top-5 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-white sm:left-auto ${
                          right ? "sm:-left-[0.46rem]" : "sm:-right-[0.46rem]"
                        }`}
                        style={{ backgroundColor: accent }}
                      />
                      <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-softer">
                        {memory.date ? (
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>
                            {memory.date}
                          </p>
                        ) : null}
                        <p className="mt-1 text-sm leading-relaxed text-neutral-600">{memory.text}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </Stage>
      ) : null}

      {photos.length > 0 ? (
        <Stage>
          <Reveal className="w-full max-w-3xl">
            <h2 className="text-3xl sm:text-4xl">Us, in pictures</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {photos.map((photo, index) => (
                <motion.figure
                  key={`${photo.url}-${index}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className={index % 5 === 0 ? "col-span-2 row-span-2 sm:col-span-1" : ""}
                >
                  <div className="overflow-hidden rounded-2xl border-4 border-white bg-white shadow-softer">
                    <Photo src={photo.url} alt={photo.caption} className="aspect-square w-full" />
                  </div>
                  {photo.caption ? <figcaption className="mt-2 text-xs text-neutral-500">{photo.caption}</figcaption> : null}
                </motion.figure>
              ))}
            </div>
          </Reveal>
        </Stage>
      ) : null}

      <Stage className="bg-white/60">
        <Reveal className="mx-auto max-w-xl">
          <div className="rounded-[2rem] border border-[#FFE0E7] bg-[#FFFCFC] p-8 shadow-soft sm:p-12">
            <p className="font-display text-2xl leading-relaxed text-neutral-800 sm:text-[1.7rem]">{letter}</p>
            {from ? (
              <p className="mt-8 text-right font-display text-xl italic" style={{ color: accent }}>
                — {from}
              </p>
            ) : null}
          </div>
        </Reveal>
      </Stage>
    </div>
  );
}
