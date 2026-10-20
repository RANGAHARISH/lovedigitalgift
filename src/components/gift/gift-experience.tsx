"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { GiftMusic } from "@/lib/gifts";
import { getTemplate } from "@/templates/registry";
import { FloatingHearts } from "@/templates/shared/effects";
import { LogoMark } from "@/components/site/logo";

export type GiftExperienceData = {
  id: string;
  recipientName: string | null;
  content: Record<string, unknown>;
  music: GiftMusic | null;
  themeColor: string | null;
  templateSlug: string;
  senderName?: string;
};

export function GiftExperience({ gift }: { gift: GiftExperienceData }) {
  const template = getTemplate(gift.templateSlug);
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const [musicFailed, setMusicFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch(`/api/gifts/${gift.id}/view`, { method: "POST" }).catch(() => undefined);
  }, [gift.id]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  function openGift() {
    setOpened(true);
    if (!gift.music?.url || audioRef.current) return;
    const audio = new Audio(gift.music.url);
    audio.loop = true;
    audio.volume = 0.6;
    audio.muted = muted;
    audioRef.current = audio;
    void audio.play().catch(() => setMusicFailed(true));
  }

  function toggleMute() {
    const audio = audioRef.current;
    const next = !muted;
    setMuted(next);
    if (audio) audio.muted = next;
  }

  if (!template) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-rosebg px-6 text-center">
        <p className="text-muted">This gift is no longer available.</p>
      </div>
    );
  }

  const accent = gift.themeColor || template.accent;
  const { Component } = template;

  return (
    <div className="relative min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="cover"
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
            style={{
              backgroundImage: `radial-gradient(120% 80% at 50% 0%, ${template.gradient[0]}, ${template.gradient[1]})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/35" aria-hidden />
            <FloatingHearts count={12} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10 flex flex-col items-center text-white"
            >
              <motion.div
                className="text-6xl drop-shadow-lg sm:text-7xl"
                animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {template.emoji}
              </motion.div>

              <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
                {gift.recipientName ? "a gift for" : "someone sent you a gift"}
              </p>
              <h1 className="mt-3 max-w-lg font-display text-4xl leading-tight sm:text-6xl">
                {gift.recipientName || "You"}
              </h1>

              <motion.button
                type="button"
                onClick={openGift}
                className="mt-12 rounded-full bg-white px-8 py-4 text-sm font-bold shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5"
                style={{ color: template.gradient[0] }}
                whileTap={{ scale: 0.97 }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                Tap to open your gift 🎁
              </motion.button>

              <p className="mt-6 max-w-xs text-[11px] leading-relaxed text-white/75">
                {gift.music ? "Best with the sound on 🎵" : "Made with photos, words and a lot of love."}
              </p>
            </motion.div>

            <p className="absolute bottom-6 z-10 text-[10px] uppercase tracking-[0.24em] text-white/60">
              whishmydear.com
            </p>
          </motion.div>
        ) : (
          <motion.main
            key="gift"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="story"
          >
            <Component content={gift.content} accent={accent} />

            <div className="border-t border-white/60 bg-white/70 py-8 text-center backdrop-blur">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-white px-4 py-2 text-[11px] font-medium text-muted shadow-sm transition hover:border-brand/40 hover:text-brand-dark"
              >
                <LogoMark className="h-5 w-5 rounded-[0.4rem]" />
                Made with whishmydear.com · Create yours
              </Link>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {opened && gift.music ? (
        <button
          type="button"
          onClick={toggleMute}
          className="fixed bottom-5 right-5 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-soft backdrop-blur transition hover:scale-105"
          aria-label={muted ? "Unmute music" : "Mute music"}
          title={musicFailed ? "Music could not start — tap to retry" : muted ? "Unmute" : "Mute"}
        >
          {muted || musicFailed ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      ) : null}
    </div>
  );
}
