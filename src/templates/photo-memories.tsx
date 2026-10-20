"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { TemplateRenderProps } from "./types";
import { FloatingHearts } from "./shared/effects";
import { Photo, Reveal, Stage, photosOf } from "./shared/primitives";

export default function PhotoMemories({ content, accent = "#D7263D" }: TemplateRenderProps) {
  const title = String(content.title || "Our favourite memories");
  const subtitle = String(content.subtitle || "");
  const message = String(content.message || "");
  const from = String(content.from || "");
  const photos = photosOf(content.photos);

  const [index, setIndex] = useState(0);
  const [seen, setSeen] = useState(1);

  const next = () => {
    setIndex((current) => {
      const nextIndex = Math.min(current + 1, Math.max(photos.length - 1, 0));
      setSeen((value) => Math.max(value, nextIndex + 1));
      return nextIndex;
    });
  };

  const previous = () => setIndex((current) => Math.max(current - 1, 0));

  const stack = photos.slice(index, index + 3);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FFF6F8] via-[#FFF8F6] to-[#FFF2F5] text-neutral-900">
      <FloatingHearts count={9} />

      <Stage>
        <Reveal className="flex flex-col items-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400">a little photo album</span>
          <h1 className="mt-5 max-w-xl text-4xl leading-tight sm:text-6xl">{title}</h1>
          {subtitle ? <p className="mt-4 max-w-md text-sm text-neutral-500 sm:text-base">{subtitle}</p> : null}
          <p className="mt-10 animate-bob text-xs uppercase tracking-[0.24em] text-neutral-400">swipe the polaroids</p>
        </Reveal>
      </Stage>

      {photos.length > 0 ? (
        <Stage className="bg-white/40">
          <div className="relative mx-auto h-[430px] w-[286px] sm:h-[470px] sm:w-[330px]">
            {stack.map((photo, depth) => (
              <motion.figure
                key={`${photo.url}-${index + depth}`}
                className="absolute inset-0 rounded-[1.4rem] bg-white p-3 pb-14 shadow-[0_18px_40px_rgba(58,13,22,0.16)]"
                style={{ zIndex: 30 - depth }}
                initial={false}
                animate={{
                  rotate: [-3.5, 2.5, 5][depth] ?? 5,
                  y: depth * 12,
                  scale: 1 - depth * 0.045,
                }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                drag={depth === 0 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70) next();
                  if (info.offset.x > 70) previous();
                }}
              >
                <div className="h-full w-full overflow-hidden rounded-lg bg-neutral-100">
                  <Photo src={photo.url} alt={photo.caption} className="h-full w-full" />
                </div>
                <figcaption className="absolute inset-x-4 bottom-4 truncate text-center font-display text-sm italic text-neutral-600">
                  {photo.caption || `memory ${index + depth + 1}`}
                </figcaption>
              </motion.figure>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-5">
            <button
              type="button"
              onClick={previous}
              disabled={index === 0}
              className="rounded-full bg-white px-4 py-2 text-sm shadow-sm transition disabled:opacity-40"
              aria-label="Previous memory"
            >
              ←
            </button>
            <span className="text-xs uppercase tracking-[0.22em] text-neutral-400">
              {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={next}
              disabled={index >= photos.length - 1}
              className="rounded-full px-4 py-2 text-sm text-white shadow-soft transition disabled:opacity-40"
              style={{ backgroundColor: accent }}
              aria-label="Next memory"
            >
              →
            </button>
          </div>
        </Stage>
      ) : (
        <Stage>
          <p className="text-sm text-neutral-500">Add photos while editing to fill this album.</p>
        </Stage>
      )}

      <Stage>
        <Reveal className="mx-auto max-w-lg">
          <p className="font-display text-2xl leading-relaxed text-neutral-800 sm:text-3xl">{message}</p>
          {from ? <p className="mt-8 text-xs uppercase tracking-[0.28em] text-neutral-400">— {from}</p> : null}
          <div className="mt-10 text-xl">📸 💛</div>
        </Reveal>
      </Stage>
    </div>
  );
}
