"use client";

import { motion } from "framer-motion";
import type { TemplateRenderProps } from "./types";
import { FloatingHearts } from "./shared/effects";
import { FlipCard, Reveal, Stage } from "./shared/primitives";

export default function ReasonsCards({ content, accent = "#D7263D" }: TemplateRenderProps) {
  const title = String(content.title || "Reasons I love you");
  const intro = String(content.intro || "");
  const closing = String(content.closing || "");
  const from = String(content.from || "");
  const reasons: string[] = Array.isArray(content.reasons)
    ? content.reasons.map((item: unknown) => String(item || "")).filter(Boolean)
    : [];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FFF4F7] via-[#FFF8F6] to-[#FFF1F4] text-neutral-900">
      <FloatingHearts count={8} />

      <Stage>
        <Reveal className="flex flex-col items-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400">a little list of everything</span>
          <h1 className="mt-5 max-w-xl text-4xl leading-tight sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-500 sm:text-base">{intro}</p>
          <p className="mt-10 animate-bob text-xs uppercase tracking-[0.24em] text-neutral-400">tap each card</p>
        </Reveal>
      </Stage>

      <Stage className="bg-white/40">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <FlipCard
              key={`${reason}-${index}`}
              index={index}
              accent={accent}
              front={"reason"}
              back={reason}
            />
          ))}
        </div>
        {reasons.length === 0 ? (
          <p className="mt-8 text-sm text-neutral-500">Add a few reasons in the editor to fill this page.</p>
        ) : null}
      </Stage>

      <Stage>
        <Reveal className="mx-auto max-w-lg">
          <motion.span
            className="inline-block text-4xl"
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            💗
          </motion.span>
          <p className="mt-6 font-display text-2xl leading-relaxed text-neutral-800 sm:text-3xl">{closing}</p>
          {from ? <p className="mt-8 text-xs uppercase tracking-[0.28em] text-neutral-400">always, {from}</p> : null}
        </Reveal>
      </Stage>
    </div>
  );
}
