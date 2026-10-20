"use client";

import { motion } from "framer-motion";
import type { TemplateRenderProps } from "./types";
import { Confetti, Fireworks, FloatingHearts, Snow } from "./shared/effects";
import { Countdown, Photo, Reveal, Stage, photosOf } from "./shared/primitives";

type EffectKind = "confetti" | "snow" | "fireworks" | "hearts";

/**
 * Background classes are declared here (not passed in) so Tailwind can see them.
 * `content.theme` selects one of these palettes.
 */
const BACKGROUNDS: Record<string, string> = {
  warm: "from-[#FFF5F7] via-[#FFF8FA] to-[#FFF0F4]",
  violet: "from-[#FFF0F4] via-[#FFF8F6] to-[#FFF3F6]",
  snow: "from-[#FFF5F7] via-[#FFFFFF] to-[#FFF4F6]",
  gold: "from-[#FFF5F7] via-[#FFF8FA] to-[#FFF0F3]",
  mint: "from-[#FFF3F5] via-[#FFFCFB] to-[#FFF4F6]",
};

const EFFECTS: EffectKind[] = ["confetti", "snow", "fireworks", "hearts"];

function Effect({ kind }: { kind: EffectKind }) {
  if (kind === "snow") return <Snow count={70} />;
  if (kind === "fireworks") return <Fireworks />;
  if (kind === "hearts") return <FloatingHearts count={14} />;
  return <Confetti />;
}

export default function Celebration({ content, accent = "#D7263D" }: TemplateRenderProps) {
  const headline = String(content.headline || "");
  const subtitle = String(content.subtitle || "");
  const message = String(content.message || "");
  const from = String(content.from || "");
  const date = String(content.date || "");
  const photos = photosOf(content.photos);

  const emoji = String(content.emoji || "✨");
  const themeKey = String(content.theme || "warm");
  const bg = BACKGROUNDS[themeKey] ?? BACKGROUNDS.warm;
  const effect = EFFECTS.includes(content.effect as EffectKind) ? (content.effect as EffectKind) : "confetti";

  return (
    <div className={`relative overflow-hidden bg-gradient-to-b ${bg} text-neutral-900`}>
      <Effect kind={effect} />

      <Stage>
        <Reveal className="flex flex-col items-center">
          <motion.div
            className="text-6xl sm:text-7xl"
            initial={{ scale: 0.7, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 12 }}
          >
            {emoji}
          </motion.div>
          <h1 className="mt-8 max-w-2xl text-4xl leading-tight sm:text-6xl">{headline}</h1>
          {subtitle ? (
            <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-500 sm:text-base">{subtitle}</p>
          ) : null}
          {date ? (
            <div className="mt-10">
              <Countdown target={date} accent={accent} />
            </div>
          ) : null}
          <motion.span
            className="mt-12 block text-2xl"
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            ✨
          </motion.span>
        </Reveal>
      </Stage>

      {photos.length > 0 ? (
        <Stage className="bg-white/40">
          <Reveal className="w-full max-w-4xl">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {photos.map((photo, index) => (
                <motion.figure
                  key={`${photo.url}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className={index === 0 ? "col-span-2 sm:col-span-1" : ""}
                >
                  <div className="overflow-hidden rounded-2xl border-4 border-white bg-white shadow-softer">
                    <Photo src={photo.url} alt={photo.caption} className="aspect-[4/3] w-full" />
                  </div>
                  {photo.caption ? (
                    <figcaption className="mt-2 text-center text-xs text-neutral-500">{photo.caption}</figcaption>
                  ) : null}
                </motion.figure>
              ))}
            </div>
          </Reveal>
        </Stage>
      ) : null}

      <Stage>
        <Reveal className="mx-auto max-w-xl">
          <p className="font-display text-2xl leading-relaxed text-neutral-800 sm:text-[1.75rem]">{message}</p>
          {from ? <p className="mt-8 text-xs uppercase tracking-[0.28em] text-neutral-400">— {from}</p> : null}
          <div className="mt-10 text-xl" style={{ color: accent }}>
            ♥ ♥ ♥
          </div>
        </Reveal>
      </Stage>
    </div>
  );
}
