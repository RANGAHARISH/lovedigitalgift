"use client";

import { motion } from "framer-motion";
import type { TemplateRenderProps } from "./types";
import { Countdown, Photo, Reveal, Stage, photosOf } from "./shared/primitives";

export default function WeddingInvite({ content, accent = "#D7263D" }: TemplateRenderProps) {
  const couple = String(content.couple || "The Happy Couple");
  const date = String(content.date || "");
  const time = String(content.time || "");
  const venue = String(content.venue || "");
  const message = String(content.message || "");
  const rsvp = String(content.rsvp || "");
  const hashtag = String(content.hashtag || "");
  const photos = photosOf(content.photos);

  const dateLabel = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Save the date";

  return (
    <div className="relative overflow-hidden bg-[#FFF9F7] text-neutral-900">
      <div className="pointer-events-none absolute inset-4 rounded-[2rem] border border-[#F0C9D2] sm:inset-8" aria-hidden />

      <Stage className="px-10">
        <Reveal className="flex flex-col items-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#A85A69]">together with their families</p>
          <h1 className="mt-6 font-display text-4xl leading-tight sm:text-6xl" style={{ color: "#3A1B22" }}>
            {couple}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-[#A85A69]">
            <span className="h-px w-12 bg-current opacity-40" />
            <span className="font-display text-xl italic">are getting married</span>
            <span className="h-px w-12 bg-current opacity-40" />
          </div>
          <p className="mt-8 font-display text-2xl sm:text-3xl" style={{ color: accent }}>
            {dateLabel}
          </p>
          {time ? <p className="mt-2 text-sm uppercase tracking-[0.24em] text-neutral-500">{time}</p> : null}
          {venue ? <p className="mt-1 text-sm text-neutral-500">{venue}</p> : null}

          {date ? <div className="mt-10"><Countdown target={date} accent={accent} /></div> : null}

          <motion.div
            className="mt-10 text-2xl"
            animate={{ rotate: [0, 6, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            💍
          </motion.div>
        </Reveal>
      </Stage>

      {photos.length > 0 ? (
        <Stage className="bg-[#FFF5F7]/70">
          <Reveal className="w-full max-w-4xl">
            <div className="flex gap-3 overflow-x-auto pb-4 sm:justify-center">
              {photos.map((photo, index) => (
                <motion.div
                  key={`${photo.url}-${index}`}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.5 }}
                  className="w-44 shrink-0 sm:w-52"
                >
                  <div className="overflow-hidden rounded-sm border-[6px] border-white bg-white shadow-softer">
                    <Photo src={photo.url} alt={photo.caption} className="aspect-[3/4] w-full" />
                  </div>
                  {photo.caption ? (
                    <p className="mt-2 text-center font-display text-xs italic text-neutral-500">{photo.caption}</p>
                  ) : null}
                </motion.div>
              ))}
            </div>
          </Reveal>
        </Stage>
      ) : null}

      <Stage>
        <Reveal className="mx-auto max-w-xl">
          <p className="font-display text-2xl leading-relaxed text-[#3A1B22] sm:text-[1.7rem]">{message}</p>
          {rsvp ? (
            <p className="mt-8 text-xs uppercase tracking-[0.28em] text-neutral-500">RSVP · {rsvp}</p>
          ) : null}
          {hashtag ? (
            <p className="mt-3 text-sm" style={{ color: accent }}>
              {hashtag}
            </p>
          ) : null}
          <div className="mt-12 text-xl tracking-[0.4em]">♥ ♥ ♥</div>
        </Reveal>
      </Stage>
    </div>
  );
}
