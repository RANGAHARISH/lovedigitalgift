"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { PhotoItem } from "../types";

export function Stage({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative flex min-h-[100svh] w-full flex-col items-center justify-center px-6 py-20 text-center",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function photosOf(value: unknown): PhotoItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) =>
      typeof item === "string" ? { url: item } : (item as PhotoItem | null),
    )
    .filter((item): item is PhotoItem => Boolean(item && typeof item.url === "string" && item.url));
}

export function Photo({
  src,
  alt,
  className,
  style,
}: {
  src?: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-[#FFD9E0] via-[#FFD5DE] to-[#FFEDF0] text-4xl",
          className,
        )}
      >
        📷
      </div>
    );
  }
  // A plain <img> keeps local uploads, data URLs and any remote host working.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt ?? ""} loading="lazy" className={cn("object-cover", className)} style={style} />;
}

export function Typewriter({
  text,
  speed = 24,
  startDelay = 250,
  className,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (reduced) {
      setShown(text.length);
      return;
    }
    setShown(0);
    let index = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        index += 1;
        setShown(index);
        if (index >= text.length && interval) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay, reduced]);

  return (
    <p className={cn("whitespace-pre-line", className)}>
      {text.slice(0, shown)}
      {shown < text.length ? (
        <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-current align-[-0.1em]" />
      ) : null}
    </p>
  );
}

export function Countdown({ target, accent = "#D7263D" }: { target?: string; accent?: string }) {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    if (!target) return;
    const end = new Date(`${target}T00:00:00`).getTime();
    if (Number.isNaN(end)) return;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setLeft({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff / 3_600_000) % 24),
        m: Math.floor((diff / 60_000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [target]);

  if (!left) return null;

  const cells = [
    { label: "days", value: left.d },
    { label: "hours", value: left.h },
    { label: "mins", value: left.m },
    { label: "secs", value: left.s },
  ];

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-3">
      {cells.map((cell) => (
        <div key={cell.label} className="min-w-[58px] rounded-2xl bg-white/80 px-3 py-2 shadow-sm backdrop-blur">
          <div className="font-display text-2xl font-semibold tabular-nums sm:text-3xl" style={{ color: accent }}>
            {String(cell.value).padStart(2, "0")}
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">{cell.label}</div>
        </div>
      ))}
    </div>
  );
}

export function FlipCard({
  front,
  back,
  accent = "#D7263D",
  index = 0,
}: {
  front: ReactNode;
  back: ReactNode;
  accent?: string;
  index?: number;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="relative h-44 w-full [perspective:1200px] focus:outline-none"
      aria-pressed={flipped}
      aria-label={flipped ? "Hide this reason" : "Reveal this reason"}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-3xl border border-white bg-white/90 shadow-softer [backface-visibility:hidden]">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: accent }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">tap to open</span>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center rounded-3xl p-5 text-center text-sm font-medium leading-relaxed text-white shadow-soft [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ backgroundColor: accent }}
        >
          <span className="text-balance">{back}</span>
        </div>
      </motion.div>
    </motion.button>
  );
}

export function PhotoCarousel({
  photos,
  accent = "#D7263D",
  className,
}: {
  photos: PhotoItem[];
  accent?: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  if (!photos.length) return null;
  const current = photos[index];

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-soft">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            drag={photos.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) setIndex((i) => Math.min(i + 1, photos.length - 1));
              if (info.offset.x > 60) setIndex((i) => Math.max(i - 1, 0));
            }}
            className="absolute inset-0"
          >
            <Photo src={current.url} alt={current.caption} className="h-full w-full" />
            {current.caption ? (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4 text-left text-sm text-white">
                {current.caption}
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {photos.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            className="rounded-full bg-white/80 px-3 py-1 text-sm shadow-sm disabled:opacity-40"
            disabled={index === 0}
            aria-label="Previous photo"
          >
            ←
          </button>
          <div className="flex gap-1.5">
            {photos.map((photo, i) => (
              <button
                key={`${photo.url}-${i}`}
                type="button"
                aria-label={`Go to photo ${i + 1}`}
                onClick={() => setIndex(i)}
                className="h-2 w-2 rounded-full transition"
                style={{ backgroundColor: i === index ? accent : "rgba(0,0,0,0.18)" }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(i + 1, photos.length - 1))}
            className="rounded-full bg-white/80 px-3 py-1 text-sm shadow-sm disabled:opacity-40"
            disabled={index === photos.length - 1}
            aria-label="Next photo"
          >
            →
          </button>
        </div>
      ) : null}
    </div>
  );
}
