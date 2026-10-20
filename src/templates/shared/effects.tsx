"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const DEFAULT_CONFETTI = ["#D7263D", "#FF8FA3", "#FFA6B5", "#F2546B", "#FFC9D3", "#FFB7C5"];

type ConfettiPiece = {
  id: number;
  left: number;
  size: number;
  color: string;
  rotate: number;
  drift: number;
  duration: number;
  delay: number;
};

export function Confetti({ count = 36, colors = DEFAULT_CONFETTI }: { count?: number; colors?: string[] }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 7 + Math.random() * 8,
        color: colors[i % colors.length],
        rotate: Math.random() * 360,
        drift: -60 + Math.random() * 120,
        duration: 4.5 + Math.random() * 4,
        delay: Math.random() * 4,
      })),
    );
  }, [count, colors]);

  if (!pieces.length) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute block"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 1.6,
            backgroundColor: piece.color,
            borderRadius: piece.size > 12 ? 2 : 999,
          }}
          initial={{ top: "-8%", rotate: piece.rotate, opacity: 0.9 }}
          animate={{ top: "108%", x: piece.drift, rotate: piece.rotate + 540 }}
          transition={{ duration: piece.duration, delay: piece.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

const HEARTS = ["❤️", "💖", "💕", "💗", "💘", "💝"];

type FloatingItem = { id: number; left: number; size: number; emoji: string; duration: number; delay: number; drift: number };

export function FloatingHearts({ count = 16 }: { count?: number }) {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    setItems(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 96,
        size: 14 + Math.random() * 26,
        emoji: HEARTS[i % HEARTS.length],
        duration: 9 + Math.random() * 8,
        delay: Math.random() * 6,
        drift: -40 + Math.random() * 80,
      })),
    );
  }, [count]);

  if (!items.length) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {items.map((item) => (
        <motion.span
          key={item.id}
          className="absolute select-none"
          style={{ left: `${item.left}%`, fontSize: item.size, opacity: 0.75 }}
          initial={{ top: "112%", x: 0 }}
          animate={{ top: "-12%", x: item.drift }}
          transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: "linear" }}
        >
          {item.emoji}
        </motion.span>
      ))}
    </div>
  );
}

type Snowflake = { id: number; left: number; size: number; duration: number; delay: number; drift: number; opacity: number };

export function Snow({ count = 60 }: { count?: number }) {
  const [flakes, setFlakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    setFlakes(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 3 + Math.random() * 6,
        duration: 7 + Math.random() * 8,
        delay: Math.random() * 8,
        drift: -50 + Math.random() * 100,
        opacity: 0.4 + Math.random() * 0.6,
      })),
    );
  }, [count]);

  if (!flakes.length) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {flakes.map((flake) => (
        <motion.span
          key={flake.id}
          className="absolute rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
          style={{ left: `${flake.left}%`, width: flake.size, height: flake.size, opacity: flake.opacity }}
          initial={{ top: "-5%" }}
          animate={{ top: "105%", x: flake.drift }}
          transition={{ duration: flake.duration, delay: flake.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

type Burst = { id: number; left: number; top: number; delay: number; color: string };

export function Fireworks() {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    setBursts(
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        left: 12 + Math.random() * 76,
        top: 15 + Math.random() * 35,
        delay: i * 1.1,
        color: ["#FF8FA3", "#D7263D", "#FFA6B5", "#FFC9D3", "#FFB7C5"][i % 5],
      })),
    );
  }, []);

  if (!bursts.length) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {bursts.map((burst) => (
        <div key={burst.id} className="absolute" style={{ left: `${burst.left}%`, top: `${burst.top}%` }}>
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const distance = 60 + (i % 3) * 18;
            return (
              <motion.span
                key={i}
                className="absolute block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: burst.color }}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance + 18,
                  opacity: [0, 1, 0],
                  scale: [1, 1.25, 0.2],
                }}
                transition={{
                  duration: 1.6,
                  delay: burst.delay,
                  repeat: Infinity,
                  repeatDelay: 3.2,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function Balloons() {
  const [balloons, setBalloons] = useState<{ id: number; left: number; color: string; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    setBalloons(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        left: 6 + Math.random() * 86,
        color: ["#D7263D", "#FF8FA3", "#FFA6B5", "#FFC9D3", "#F2546B", "#FFB7C5"][i % 6],
        size: 34 + Math.random() * 22,
        delay: Math.random() * 3,
        duration: 6 + Math.random() * 4,
      })),
    );
  }, []);

  if (!balloons.length) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {balloons.map((balloon) => (
        <motion.div
          key={balloon.id}
          className="absolute"
          style={{ left: `${balloon.left}%` }}
          initial={{ top: "105%", rotate: -4 }}
          animate={{ top: "-25%", rotate: [4, -4, 4] }}
          transition={{
            top: { duration: balloon.duration * 2, delay: balloon.delay, repeat: Infinity, ease: "linear" },
            rotate: { duration: 3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
          }}
        >
          <div
            className="rounded-[50%] opacity-80"
            style={{ width: balloon.size, height: balloon.size * 1.2, backgroundColor: balloon.color }}
          />
          <div className="mx-auto h-10 w-px bg-neutral-400/60" />
        </motion.div>
      ))}
    </div>
  );
}
